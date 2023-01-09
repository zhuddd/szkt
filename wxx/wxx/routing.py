from django.urls import re_path 
from msg import consumers
websocket_urlpatterns = [
    re_path(r'ws/msg/', consumers.msgconsumer.as_asgi()),
]