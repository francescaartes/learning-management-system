from django.db import models
from django.conf import settings
from lms_app.models import Course

class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Course {self.course.title} - {self.sender.username} at {self.timestamp}"