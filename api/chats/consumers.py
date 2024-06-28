from channels.generic.websocket import AsyncWebsocketConsumer
import json
from cryptography.fernet import Fernet
from accounts.models import CustomUser as User
from .models import Message


class PersonalChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.key)

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        room_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"chat_{room_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            decrypted_data = self.cipher_suite.decrypt(text_data.encode())
            data = json.loads(decrypted_data)
            message_content = data.get("message", "")
            sender_id = self.user.id
            receiver_id = data.get("receiver_id", None)

            if receiver_id:
                receiver = User.objects.get(id=receiver_id)
                message = Message.objects.create(
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
        encrypted_message = self.cipher_suite.encrypt(
            json.dumps({"message": message, "username": username}).encode()
        )
        await self.send(text_data=encrypted_message.decode())
