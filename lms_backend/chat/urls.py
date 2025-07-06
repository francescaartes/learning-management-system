from django.urls import path
from .views import *

urlpatterns = [
    path("courses/<int:course_id>/messages/", CourseMessageListView.as_view()),
]