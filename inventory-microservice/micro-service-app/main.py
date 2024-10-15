from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
from pydantic import BaseModel
from dotenv import load_dotenv
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


class Product(HashModel):
    name: str
    price: float
    quantity_available: int

    class Meta:
        database = redis


class ProductCreate(BaseModel):
    name: str
    price: float
    quantity_available: int


class ProductRead(BaseModel):
    id: str
    name: str
    price: float
    quantity_available: int


# @app.get("/products", response_model=list[ProductRead])
# async def get_products():
#     products = Product.find().all()
#     return [ProductRead(id=prod.pk, name=prod.name, price=prod.price, quantity_available=prod.quantity_available) for prod in products]

@app.get("/products", response_model=list[ProductRead])
async def get_products():
    product_pks = Product.all_pks()
    products = [Product.get(pk) for pk in product_pks]
    return [ProductRead(id=prod.pk, name=prod.name, price=prod.price, quantity_available=prod.quantity_available) for prod in products]


@app.post("/products", response_model=ProductRead)
async def create_product(product: ProductCreate):
    prod = Product(**product.model_dump())
    prod.save()
    return ProductRead(id=prod.pk, name=prod.name, price=prod.price, quantity_available=prod.quantity_available)

@app.get("/products/{pk}", response_model=ProductRead)
async def get_product(pk: str):
    product = Product.get(pk)
    return ProductRead(id=product.pk, name=product.name, price=product.price, quantity_available=product.quantity_available)

@app.delete("/products/{pk}")
async def delete_product(pk: str):
    return Product.delete(pk)

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
