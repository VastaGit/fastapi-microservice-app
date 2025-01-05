import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import requests

from db import SessionLocal, Order
from models import OrderCreate, OrderRead
from tasks import update_order_status
from dotenv import load_dotenv

load_dotenv()

# Настройки JWT
SECRET_KEY = os.getenv("JWT_SECRET", "123456789")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Невалидные учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM],
            options={"verify_exp": False})
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# Эндпоинт для получения всех заказов текущего пользователя


@app.get("/orders", response_model=list[OrderRead])
async def get_user_orders(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return [
        OrderRead(
            id=order.id,
            product_id=order.product_id,
            fee=order.fee,
            price=order.price,
            quantity=order.quantity,
            total=order.total,
            status=order.status,
            user_id=order.user_id,
        )
        for order in orders
    ]

# Эндпоинт для создания заказа с привязкой к пользователю


@app.post("/order", response_model=OrderRead)
async def create_order(
    order_create: OrderCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    response = requests.get(
        f'http://127.0.0.1:8000/products/{order_create.product_id}'
    )
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Product not found")
    product = response.json()

    order = Order(
        product_id=order_create.product_id,
        fee=product["price"] * 0.2,
        price=product["price"],
        quantity=order_create.quantity,
        total=(product["price"] * 1.2) * order_create.quantity,
        status="Pending",
        user_id=user_id,  # Установка user_id из JWT
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Добавление фоновой задачи
    update_order_status.delay(
        str(order.id),
        delay=10
    )

    return OrderRead(
        id=order.id,
        product_id=order.product_id,
        price=order.price,
        quantity=order.quantity,
        fee=order.fee,
        total=order.total,
        status=order.status,
        user_id=order.user_id,
    )
