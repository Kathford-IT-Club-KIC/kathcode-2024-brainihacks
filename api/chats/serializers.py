from rest_framework import serializers
from .models import Message, Conversation, Room
from accounts.models import CustomUser as User


class ConversationSerializer(serializers.ModelSerializer):
    user_message = serializers.SerializerMethodField()
    ai_response = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["user_message", "ai_response", "timestamp"]

    def get_user_message(self, obj):
        return obj.get_decrypted_user_message()

    def get_ai_response(self, obj):
        return obj.get_decrypted_ai_response()


class GeminiRequestSerializer(serializers.Serializer):
    prompt = serializers.CharField(max_length=2048, required=True)
    # Add other input fields as needed


class GeminiResponseSerializer(serializers.Serializer):
    text = serializers.CharField()
    # Add other response fields from Gemini API


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class RoomSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.username")
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "room_type",
            "created_by",
            "photo",
            "created_at",
            "event",
            "tour",
            "participants",
        ]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "room", "sender", "content", "timestamp"]
