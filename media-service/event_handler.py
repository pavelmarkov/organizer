
import pika

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