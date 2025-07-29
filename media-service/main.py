from fastapi import FastAPI
from event_handler import send_message, on_message_received
import pika

app = FastAPI()

@app.get("/")
def read_root():
    send_message()
    return {"message": "Hello, World!"}

def main():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()

        channel.queue_declare(queue='media_queue')

        channel.basic_consume(queue='media_queue',
                            on_message_callback=on_message_received,
                            auto_ack=False)

        print(' [*] Waiting for messages. To exit press CTRL+C')

        channel.start_consuming()

    except pika.exceptions.AMQPConnectionError as e:
        print(f"Error connecting to RabbitMQ: {e}")
    except KeyboardInterrupt:
        print("Consumer stopped by user.")
    finally:
        if 'connection' in locals() and connection.is_open:
            connection.close()

if __name__ == '__main__':
    main()