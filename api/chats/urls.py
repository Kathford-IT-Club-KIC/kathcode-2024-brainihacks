from django.urls import path
from .views import (
    SendMessageView,
    ExpressEventInterestView,
    ExpressTourInterestView,
    chat_page,
    chat_room,
)
from .views import GeminiAPIView

urlpatterns = [
    path("", chat_page, name="chat_page"),
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
    path("chat/<int:room_id>/", chat_room, name="chat_room"),
]
