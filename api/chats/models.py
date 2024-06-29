from django.db import models
from django.conf import settings
from accounts.models import CustomUser as User
from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings
import base64

# Ensure you generate and store a secure key in your settings
settings.SECRET_KEY = Fernet.generate_key()


class Room(models.Model):
    ROOM_TYPES = (
        ("event", "Event"),
        ("tour", "Tour"),
        ("user", "User"),
    )
    name = models.CharField(max_length=255)
    room_type = models.CharField(max_length=5, choices=ROOM_TYPES)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_rooms"
    )
    photo = models.ImageField(upload_to="room_photos/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    event = models.ForeignKey(
        "events.Event", on_delete=models.CASCADE, null=True, blank=True
    )
    tour = models.ForeignKey(
        "tours.Tour", on_delete=models.CASCADE, null=True, blank=True
    )
    participants = models.ManyToManyField(
        User, related_name="participated_rooms", blank=True
    )

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"


class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    user_message = models.TextField()
    ai_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def encrypt_text(self, text):
        f = Fernet(settings.SECRET_KEY)
        return base64.urlsafe_b64encode(f.encrypt(text.encode())).decode()

    def decrypt_text(self, encrypted_text):
        f = Fernet(settings.SECRET_KEY)
        return f.decrypt(base64.urlsafe_b64decode(encrypted_text)).decode()

    def save(self, *args, **kwargs):
        if not self.pk:  # Only encrypt if the object is being created
            self.user_message = self.encrypt_text(self.user_message)
            self.ai_response = self.encrypt_text(self.ai_response)
        super().save(*args, **kwargs)

    def get_decrypted_user_message(self):
        return self.decrypt_text(self.user_message)

    def get_decrypted_ai_response(self):
        return self.decrypt_text(self.ai_response)
