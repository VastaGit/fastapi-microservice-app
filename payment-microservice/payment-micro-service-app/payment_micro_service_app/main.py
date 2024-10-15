from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.background import BackgroundTasks
from redis_om import get_redis_connection, HashModel
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import time
import os

load_dotenv()

redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("RESIS_PORT")
redis_passport = os.getenv("REDIS_PASSPORT")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
redis = get_redis_connection(
    host = redis_host,
    port = int(redis_port),
    password = redis_passport,
    decode_responses = True,
)

class Order(HashModel):
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str
    
    class Meta:
        database = redis


class OrderCreate(BaseModel):
    product_id: str
    quantity: int

class OrderRead(BaseModel):
    id: str
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str

def order_operation(order: Order):
    time.sleep(5)
    order.status = "Completed"
    order.save()
    redis.xadd('order_completed', order.model_dump(), '*')
    
@app.get("/orders", response_model=list[OrderRead])
async def get_Orders():
    Order_pks = Order.all_pks()
    Orders = [Order.get(pk) for pk in Order_pks]
    return [OrderRead(id=ord.pk, product_id=ord.product_id, fee=ord.fee, price=ord.price, quantity=ord.quantity, total=ord.total, status=ord.status) for ord in Orders]


@app.post("/order", response_model=OrderRead)
async def create_order(order_create: OrderCreate, background_tasks: BackgroundTasks):
    
    response = requests.get(f'http://127.0.0.1:8000/products/{order_create.product_id}')
    product = response.json()
    
    order = Order(product_id=order_create.product_id, fee=product["price"] * 0.2, price=product["price"], quantity=order_create.quantity, total=(product["price"] * 1.2) * order_create.quantity, status="Pending")
    order.save()
    
    background_tasks.add_task(order_operation, order)
    
    return OrderRead(id=order.pk, product_id=order.product_id, price=order.price, quantity=order.quantity, fee=order.fee, total=order.total, status=order.status)
    
@app.get("/orders/{pk}", response_model=OrderRead)
async def get_Order(pk: str):
    order = Order.get(pk)
    return OrderRead(id=order.pk, product_id=order.product_id, price=order.price, quantity=order.quantity, fee=order.fee, total=order.total, status=order.status)

# @app.delete("/Orders/{pk}")
# async def delete_Order(pk: str):
#     return Order.delete(pk)
