FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app
COPY manage.py .
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY megaphonely/ .
COPY scripts/ .

EXPOSE 8000

CMD ["run_web.sh"]