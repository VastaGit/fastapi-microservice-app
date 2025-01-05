# celery_app.py
from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

CELERY_BROKER_URL = os.getenv(
    "CELERY_BROKER_URL", "pyamqp://guest@localhost//")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "rpc://")

celery = Celery(
    "products",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["tasks"],  # Укажите модуль с задачами
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],  # Ignore other content
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "tasks.update_product_quantity": {"queue": "product_updates"},
    },
)
