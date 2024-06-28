from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(
        r"event_room/ws/chat/(?P<room_id>\d+)/$",
        consumers.PersonalChatConsumer.as_asgi(),
    ),
    re_path(
        r"tour_room/ws/chat/(?P<room_id>\d+)/$",
        consumers.PersonalChatConsumer.as_asgi(),
    ),
]
