# db.py

import uuid
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Float, Integer
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Конфигурация базы данных
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ORM-модель Order


class Order(Base):
    __tablename__ = "orders"

    id = Column(PGUUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, index=True)
    product_id = Column(String, index=True, nullable=False)
    price = Column(Float, nullable=False)
    fee = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    user_id = Column(String, index=True, nullable=False)


# Создание таблиц
Base.metadata.create_all(bind=engine)
