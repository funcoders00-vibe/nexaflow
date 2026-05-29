from celery import Celery
import os
import redis

# Get Redis broker URL
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Test Redis connection to determine if Celery should run in eager (sync) mode
redis_available = False
try:
    # Attempt to ping Redis with a short timeout
    r = redis.Redis.from_url(redis_url, socket_timeout=1.0)
    r.ping()
    redis_available = True
    print(f"[Celery] Connected to Redis broker at {redis_url}")
except Exception:
    print("[Celery] Redis broker is unreachable. Activating task_always_eager mode (synchronous execution).")

celery_app = Celery(
    "nexaflow_tasks",
    broker=redis_url if redis_available else None,
    backend=redis_url if redis_available else None
)

if not redis_available:
    # Enable eager execution mode (tasks execute locally inside caller process)
    celery_app.conf.update(
        task_always_eager=True,
        task_eager_propagates=True
    )
else:
    celery_app.conf.update(
        broker_connection_retry_on_startup=True
    )

# Set imports so Celery knows where to find tasks
celery_app.conf.update(
    imports=["src.services.tasks"]
)
