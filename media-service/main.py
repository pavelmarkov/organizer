from fastapi import FastAPI
from event_handler import send_message

app = FastAPI()

@app.get("/")
def read_root():
    send_message()
    return {"message": "Hello, World!"}
