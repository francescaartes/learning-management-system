from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token 
from . import views

router = DefaultRouter()
router.register(r'instructors', views.InstructorViewSet, basename='instructor')
router.register(r'students', views.StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('courses/', views.CourseList.as_view()),
    path('course-categories/', views.CourseCategoryList.as_view()),
    path('api-tokens-auth/', obtain_auth_token)
]