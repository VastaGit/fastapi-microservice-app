from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import uuid
from sqlalchemy import create_engine, Column, String, Float, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from fastapi import HTTPException, status


load_dotenv()

db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    pk = Column(PGUUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4)  # Use UUID
    name = Column(String)
    price = Column(Float)
    quantity_available = Column(Integer)

    def __repr__(self):
        return f'''Product(pk={self.pk},
                name={self.name},
                price={self.price},
                quantity_available={self.quantity_available})'''


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProductCreate(BaseModel):
    name: str
    price: float
    quantity_available: int


class ProductRead(BaseModel):
    id: uuid.UUID  # Change to id
    name: str
    price: float
    quantity_available: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/products", response_model=list[ProductRead])
async def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [ProductRead(
        id=prod.pk, name=prod.name, price=prod.price,
        quantity_available=prod.quantity_available) for prod in products
    ]


@app.post("/products", response_model=ProductRead)
async def create_product(
        product: ProductCreate, db: Session = Depends(get_db)):
    prod = Product(**product.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return ProductRead(
        id=prod.pk, name=prod.name, price=prod.price,
        quantity_available=prod.quantity_available)


@app.get("/products/{pk}", response_model=ProductRead)
async def get_product(pk: uuid.UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.pk == pk).first()
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return ProductRead(
        id=product.pk, name=product.name, price=product.price,
        quantity_available=product.quantity_available)


@app.delete("/products/{pk}")
async def delete_product(pk: uuid.UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.pk == pk).first()
    if product:
        db.delete(product)
        db.commit()
        return {"message": "Product deleted successfully"}
    return {"message": "Product not found"}
