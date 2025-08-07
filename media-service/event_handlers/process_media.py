
import pika
import json
from pika.adapters.blocking_connection import BlockingConnection, BlockingChannel
from pika.spec import BasicProperties, Basic

def on_process_media_message_received(
    ch: BlockingChannel,
    method: Basic.Deliver,
    props: BasicProperties,
    body: bytes
  ):
  """
  Callback function executed when a message is received.
  """

  message = json.loads(body.decode())

  print('\n')
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