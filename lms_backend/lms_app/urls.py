from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'announcements', views.AnnouncementViewSet, basename='announcements')
router.register(r'resources', views.ResourceViewSset, basename='resources')
router.register(r'assignments', views.AssignmentViewSset, basename='assignments')
router.register(r'quizzes', views.QuizViewSset, basename='quizzes')

urlpatterns = [
    path('', include(router.urls)),
    path('courses/', views.CourseList.as_view()),
    path('courses/<int:pk>/', views.CourseDetail.as_view()),
    path('posts/', views.PostView.as_view()),
    path('create_course/', views.CourseCreate.as_view()),
    path('categories/', views.CourseCategoryList.as_view()),
    path('enrollments/', views.EnrollmentList.as_view()),
    path('reviews/', views.ReviewList.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('me/', views.CurrentUserView.as_view()),
    path('instructor_profile/', views.InstructorProfileCreateList.as_view())
]