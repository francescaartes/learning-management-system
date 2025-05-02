from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('courses/', views.CourseList.as_view()),
]