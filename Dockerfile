FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

CMD ["gunicorn", "--bind", "0.0.0.0:80", "main:app"]
