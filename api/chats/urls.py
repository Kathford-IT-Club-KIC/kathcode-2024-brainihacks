from django.urls import path
from .consumers import PersonalChatConsumer
from .views import (
    SendMessageView,
    EventRoomListView,
    TourRoomListView,
    EventRoomAccessView,
    TourRoomAccessView,
)

urlpatterns = [
    path("send_message/", SendMessageView.as_view(), name="send_message"),
    path("event-rooms/", EventRoomListView.as_view(), name="event-room-list"),
    path("tour-rooms/", TourRoomListView.as_view(), name="tour_room_list"),
    path(
        "event_room/<int:room_id>/",
        EventRoomAccessView.as_view(),
        name="event_room_access",
    ),
    path(
        "tour_room/<int:room_id>/",
        TourRoomAccessView.as_view(),
        name="tour_room_access",
    ),
]

websocket_patterns = [
    path("ws/<int:id>/", PersonalChatConsumer.as_asgi()),
    path(
        "event/ws/<int:room_id>/",
        PersonalChatConsumer.as_asgi(),
        {"room_type": "event"},
    ),
    path(
        "tour/ws/<int:room_id>/", PersonalChatConsumer.as_asgi(), {"room_type": "tour"}
    ),
]
