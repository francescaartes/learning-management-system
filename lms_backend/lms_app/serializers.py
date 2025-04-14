from rest_framework import serializers
import models

# Create your serializers here.
class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = ['name', 'email', 'password', 'qualification', 'mobile_no', 'address']

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseCategory
        fields = ['title', 'description']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = ['category', 'teacher', 'title', 'description']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['name', 'email', 'password', 'qualification', 'mobile_no', 'address', 'interest_categories']