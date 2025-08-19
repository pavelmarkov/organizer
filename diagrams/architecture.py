from diagrams import Cluster, Diagram
from diagrams.onprem.analytics import Spark
from diagrams.onprem.compute import Server
from diagrams.onprem.database import PostgreSQL
from diagrams.onprem.inmemory import Redis
from diagrams.onprem.aggregator import Fluentd
from diagrams.onprem.monitoring import Grafana, Prometheus
from diagrams.onprem.network import Nginx
from diagrams.onprem.queue import Kafka

from diagrams.programming.framework import Angular
from diagrams.programming.language import Nodejs
from diagrams.programming.language import Python
from diagrams.programming.language import Sql
from diagrams.custom import Custom

with Diagram("Organizer Architecture", filename="../notes/media/architecture", show=False):

    with Cluster("Client"):
        web_client = Angular("Web Client")
        client = [
            web_client,
        ]

    with Cluster("Backend"):
        directory_service = Nodejs("Directory Service")
        media_service = Python("Media Service")
        rabbitmq = Custom("Message Broker", "../notes/media/rabbitmq-icon.png")

    with Cluster("Persistence"):
        directory_service_db = Sql("Directory Service DB")

    client >> directory_service
    directory_service >> directory_service_db

    directory_service >> rabbitmq >> media_service
