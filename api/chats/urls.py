from django.urls import path
from .views import (
    SendMessageView,
    EventRoomAccessView,
    TourRoomAccessView,
    ExpressEventInterestView,
    ExpressTourInterestView,
    EventRoomListView,
    TourRoomListView,
)

urlpatterns = [
    path("send-message/", SendMessageView.as_view(), name="send_message"),
    path("event-rooms/", EventRoomListView.as_view(), name="event_room_list"),
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
]
