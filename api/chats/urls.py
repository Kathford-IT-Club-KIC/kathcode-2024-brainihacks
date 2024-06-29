from django.urls import path
from .views import (
    SendMessageView,
    ExpressEventInterestView,
    ExpressTourInterestView,
    chat_room,
    ChatRoomListView,
    ChatRoomDetailView,
    RoomMessagesAPIView,  # Import the new view for fetching room messages
)
from .views import GeminiAPIView

urlpatterns = [
    path("gemini/", GeminiAPIView.as_view()),
    path("send-message/", SendMessageView.as_view(), name="send_message"),
    path(
        "express-event-interest/<int:event_id>/",
        ExpressEventInterestView.as_view(),
        name="express_event_interest",
    ),
    path(
        "express-tour-interest/<int:tour_id>/",
        ExpressTourInterestView.as_view(),
        name="express_tour_interest",
    ),
    path("room/<int:room_id>/", chat_room, name="chat_room"),
    path(
        "rooms/<int:pk>/", ChatRoomDetailView.as_view(), name="chat_room_detail"
    ),  # Use pk as the lookup field
    path("rooms/", ChatRoomListView.as_view(), name="chat_room_list"),
    path(
        "rooms/<int:room_id>/messages/",
        RoomMessagesAPIView.as_view(),
        name="room_messages",
    ),  # New endpoint for fetching room messages
]
