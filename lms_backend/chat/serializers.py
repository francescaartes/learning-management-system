from rest_framework import serializers
from .models import *

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    sender_profile_img = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "course", "course_title", "sender", "sender_username", "content", "timestamp", "sender_profile_img"]

    def get_sender_profile_img(self, obj):
        request = self.context.get("request")
        if obj.sender.profile_img and hasattr(obj.sender.profile_img, 'url'):
            return request.build_absolute_uri(obj.sender.profile_img.url)
        return None

