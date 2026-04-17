FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/frontend

RUN useradd --create-home --shell /usr/sbin/nologin appuser

COPY frontend /app/frontend

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8501

CMD ["python", "-m", "http.server", "8501", "--bind", "0.0.0.0"]
