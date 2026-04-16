FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/frontend

COPY frontend /app/frontend

EXPOSE 8501

CMD ["python", "-m", "http.server", "8501", "--bind", "0.0.0.0"]
