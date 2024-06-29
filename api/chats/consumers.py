import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Message
from accounts.models import CustomUser as User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_id}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("Received message:", text_data_json)  # Add log to check received data

        if "user_id" not in text_data_json:
            print("Error: user_id not found in message")
            return

        message = text_data_json["message"]
        user_id = text_data_json["user_id"]
        image = text_data_json.get("image")

        # Save message to database
        await self.save_message(user_id, self.room_id, message, image)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "user_id": user_id,
                "image": image,
                "sender": {
                    "id": user_id,
                },
            },
        )

    async def chat_message(self, event):
        message = event["message"]
        user_id = event["user_id"]
        image = event.get("image")

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "user_id": user_id,
                    "image": image,
                    "sender": user_id,
                }
            )
        )

    @database_sync_to_async
    def save_message(self, user_id, room_id, message, image):
        user = User.objects.get(id=user_id)
        room = Room.objects.get(id=room_id)
        Message.objects.create(sender=user, room=room, content=message, image=image)
