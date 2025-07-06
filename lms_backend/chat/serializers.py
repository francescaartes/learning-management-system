from rest_framework import serializers
from .models import *

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "course", "course_title", "sender", "sender_username", "content", "timestamp"]

