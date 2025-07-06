from django.shortcuts import render
from rest_framework import generics, permissions
from .models import *
from .serializers import *

# Create your views here.
class CourseMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        return Message.objects.filter(course_id=course_id).order_by("timestamp")