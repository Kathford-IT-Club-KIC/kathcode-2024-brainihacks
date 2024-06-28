from channels.generic.websocket import AsyncWebsocketConsumer
import json
from cryptography.fernet import Fernet
from django.contrib.auth.models import AnonymousUser
from accounts.models import CustomUser as User
from .models import Message
from channels.db import database_sync_to_async
import jwt


class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_id}"

        query_string = self.scope["query_string"].decode()
        token = query_string.split("=")[1] if "=" in query_string else None

        self.user = await self.authenticate_user(token)

        if self.user.is_authenticated:
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    @database_sync_to_async
    def authenticate_user(self, token):
        if token:
            try:
                payload = jwt.decode(token, "your-secret-key", algorithms=["HS256"])
                user_id = payload["user_id"]
                return self.get_user(user_id)
            except (
                jwt.ExpiredSignatureError,
                jwt.InvalidTokenError,
                User.DoesNotExist,
            ):
                return AnonymousUser()
        return AnonymousUser()

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            message_content = data.get("message", "")
            receiver_id = data.get("receiver_id", None)

            if receiver_id:
                receiver = await self.get_user(receiver_id)
                await database_sync_to_async(Message.objects.create)(
                    sender=self.user, receiver=receiver, content=message_content
                )

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "message": message_content,
                        "username": self.user.username,
                    },
                )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]
        await self.send(
            text_data=json.dumps({"message": message, "username": username})
        )
