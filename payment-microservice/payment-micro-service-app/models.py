# models.py

from pydantic import BaseModel
import uuid

# Модель для создания заказа


class OrderCreate(BaseModel):
    product_id: str
    quantity: int

# Модель для чтения заказа


class OrderRead(BaseModel):
    id: uuid.UUID
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str
    user_id: str  # Поле для идентификатора пользователя

    class Config:
        orm_mode = True
