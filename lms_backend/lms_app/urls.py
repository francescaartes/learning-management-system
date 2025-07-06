from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'announcements', views.AnnouncementViewSet, basename='announcements')
router.register(r'resources', views.ResourceViewSet, basename='resources')
router.register(r'assignments', views.AssignmentViewSet, basename='assignments')
router.register(r'quizzes', views.QuizViewSet, basename='quizzes')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterView.as_view()),
    path('me/', views.CurrentUserView.as_view()),
    path('instructor_profile/', views.InstructorProfileCreateList.as_view()),
    
    path('categories/', views.CourseCategoryList.as_view()),
    path('courses/', views.CourseList.as_view()),
    path('courses/<int:pk>/', views.CourseDetail.as_view()),
    path('create_course/', views.CourseCreate.as_view()),
    
    path('enrollments/', views.EnrollmentList.as_view()),
    path('reviews/', views.ReviewList.as_view()),

    path('posts/', views.PostListView.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),

    path("submissions/", views.SubmissionCreateView.as_view()),
    path('submissions/<int:pk>/', views.SubmissionDeleteView.as_view()),
    path("submissions/<int:pk>/score/", views.SubmissionScoreUpdateView.as_view()),
    path("submissions/instructor/", views.InstructorSubmissionsListView.as_view()),

    path('quizzes/<int:pk>/info/', views.QuizInfoView.as_view()),
    path('quiz-attempts/', views.QuizAttemptListCreateView.as_view()),
    path('quiz-attempts/<int:pk>/', views.QuizAttemptDetailView.as_view()),
    path("quizzes/<int:pk>/instructor_detail/", views.InstructorQuizDetailView.as_view()),
    path("quizzes/<int:quiz_id>/my_attempts/", views.MyQuizAttemptsView.as_view()),
]