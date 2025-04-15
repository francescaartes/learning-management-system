from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, viewsets
from . import serializers
from . import models

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = models.Instructor.objects.all()
    serializer_class = serializers.InstructorSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseList(generics.ListCreateAPIView):
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CourseCategoryList(generics.ListAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = serializers.CourseCategorySerializer
