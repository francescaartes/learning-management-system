import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message
from lms_app.models import Course
from django.conf import settings

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.course_id = self.scope["url_route"]["kwargs"]["course_id"]
        self.room_group_name = f"chat_course_{self.course_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        user = self.scope["user"]

        print("[DEBUG] User in receive:", user, message)

        if user.is_anonymous:
            return

        saved_message = await self.save_message(user, self.course_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": {
                    "id": saved_message.id,
                    "sender": saved_message.sender.id,
                    "sender_username": saved_message.sender.username,
                    "sender_profile_img": (settings.SITE_DOMAIN + saved_message.sender.profile_img.url),
                    "content": saved_message.content,
                    "timestamp": str(saved_message.timestamp),
                },
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def save_message(self, user, course_id, message):
        course = Course.objects.get(pk=course_id)
        return Message.objects.create(
            sender=user,
            course=course,
            content=message,
        )
