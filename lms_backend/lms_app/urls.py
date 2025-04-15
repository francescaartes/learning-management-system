from django.urls import path
from . import views

urlpatterns = [
    path('instructors/', views.InstructorList.as_view()),
    path('instructors/<int:pk>/', views.InstructorDetails.as_view()),
    path('students/', views.StudentList.as_view()),
    path('students/<int:pk>/', views.StudentDetails.as_view()),
    path('courses/', views.CourseList.as_view()),
    path('course-categories/', views.CourseCategoryList.as_view()),
]