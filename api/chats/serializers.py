from rest_framework import serializers
from .models import EventRoom, TourRoom, Message
from accounts.models import CustomUser


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")

    class Meta:
        model = Message
        fields = ["id", "sender", "event_room", "tour_room", "content", "timestamp"]
        read_only_fields = ["timestamp"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "pfp"]


class EventRoomSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    created_by = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = EventRoom
        fields = [
            "id",
            "name",
            "description",
            "event_title",
            "created_at",
            "created_by",
            "photo",
        ]


class TourRoomSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = TourRoom
        fields = [
            "id",
            "name",
            "description",
            "created_by",
            "created_at",
            "photo",
        ]
