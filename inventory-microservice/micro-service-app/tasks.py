# products_service/tasks.py
from celery_app import celery
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from main import Product  # Импортируйте модель продукта
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@celery.task(name="tasks.update_product_quantity")
def update_product_quantity(product_id: str, quantity: int):
    """
    Обновляет количество доступных товаров.

    :param product_id: UUID продукта в виде строки.
    :param quantity: Число для обновления (может быть положительным или отрицательным).
    """
    db = SessionLocal()
    try:
        product_uuid = uuid.UUID(product_id)
        product = db.query(Product).filter(Product.pk == product_uuid).first()
        if product:
            product.quantity_available += quantity
            if product.quantity_available < 0:
                product.quantity_available = 0  # Предотвращение отрицательного количества
            db.commit()
            print(f"[Products] Обновлено количество для продукта {
                  product_id}: {product.quantity_available}")
        else:
            print(f"[Products] Продукт с ID {product_id} не найден.")
    except (SQLAlchemyError, ValueError) as e:
        db.rollback()
        print(f"[Products] Ошибка при обновлении продукта {product_id}: {e}")
    finally:
        db.close()
