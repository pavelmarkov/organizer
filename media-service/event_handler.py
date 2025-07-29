
import pika
import json

def send_message():
  # Establish a connection
  credentials = pika.PlainCredentials('guest', 'guest')
  parameters = pika.ConnectionParameters(
      'rabbitmq-server',
      5672,
      '/',
      credentials
  )
  connection = pika.BlockingConnection(parameters)
  channel = connection.channel()

  # Declare a queue
  channel.queue_declare(queue='hello')

  # Publish a message
  channel.basic_publish(exchange='',
                        routing_key='hello',
                        body='Hello RabbitMQ!')
  print(" [x] Sent 'Hello RabbitMQ!'")

  # Close the connection
  connection.close()

def on_message_received(ch, method, props, body):
  """
  Callback function executed when a message is received.
  """

  message = json.loads(body.decode())
  print(f" [x] Received {message}")

  print(f" [x] Properties {props}")
  print(message['data'])
  print(message['data']['directoryGuids'])
  ch.basic_publish(exchange='',
    routing_key=props.reply_to,
    properties=pika.BasicProperties(correlation_id=props.correlation_id,
                                    reply_to=props.reply_to),
    body=json.dumps({
      "message": "ok",
      "data":{
        "directoryGuids": message['data']['directoryGuids']
      }
    })
  )
  ch.basic_ack(delivery_tag=method.delivery_tag)