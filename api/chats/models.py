from django.db import models
from django.conf import settings
from accounts.models import CustomUser as User
from events.models import Event
from tours.models import Tour


class EventRoom(models.Model):
    event = models.OneToOneField(
        Event, on_delete=models.CASCADE, related_name="event_chat_room", default=""
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    photo = models.ImageField(
        upload_to="event-room/", null=True, blank=True, default="event-room/default.jpg"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="event_eventrooms_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="event_rooms"
    )

    def __str__(self):
        return self.name


class TourRoom(models.Model):
    tour = models.OneToOneField(
        Tour, on_delete=models.CASCADE, related_name="tour_chat_room", default=""
    )
    photo = models.ImageField(
        upload_to="tour-room/", null=True, blank=True, default="tour-room/default.jpg"
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tour_tourrooms_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="tour_rooms"
    )

    def __str__(self):
        return self.name


class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event_room = models.ForeignKey(
        EventRoom, on_delete=models.CASCADE, null=True, blank=True
    )
    tour_room = models.ForeignKey(
        TourRoom, on_delete=models.CASCADE, null=True, blank=True
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} at {self.timestamp}"
