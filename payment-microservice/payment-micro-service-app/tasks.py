# orders_service/tasks.py
import time
from celery_app import celery
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from db import Order
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
    if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Убедитесь, что таблицы созданы
Base = Order.__table__.metadata
Base.create_all(bind=engine)


@celery.task(name="tasks.update_order_status")
def update_order_status(order_id: int, delay: int = 10):
    """Ожидает `delay` секунд и обновляет статус заказа на 'Completed'."""
    time.sleep(delay)
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order and order.status != "Completed":
            order.status = "Completed"
            db.commit()
            print(f"[Orders] Статус заказа {
                  order_id} обновлен на 'Completed'.")

            # Инициация задачи обновления количества товара в Продуктах
            celery.send_task(
                "tasks.update_product_quantity",
                args=[str(order.product_id), -order.quantity],
                queue="product_updates"
            )
    except SQLAlchemyError as e:
        db.rollback()
        print(f"[Orders] Ошибка при обновлении заказа {order_id}: {e}")
    finally:
        db.close()
