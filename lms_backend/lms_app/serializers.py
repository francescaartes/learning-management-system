from rest_framework import serializers
from . import models

# Create your serializers here.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_instructor', 'bio', 'interests', 'profile_img'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = models.User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = models.User(
            username=validated_data['username'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class InstructorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InstructorProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_on']

    def create(self, validated_data):
        user = self.context["request"].user
        if user.is_instructor:
            raise serializers.ValidationError("You are already an instructor.")

        user.is_instructor = True
        user.save()

        return super().create({**validated_data, "user": user})

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseCategory
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    instructor = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = models.Course
        fields = '__all__'

    def validate(self, data):
        is_publishing = data.get('is_published', self.instance.is_published if self.instance else False)

        if is_publishing:
            required_fields = ['title', 'description', 'language']
            for field in required_fields:
                value = data.get(field) or getattr(self.instance, field, None)
                if not value:
                    raise serializers.ValidationError({field: f"{field} is required to publish the course."})

            course = self.instance
            if course and course.lessons.count() == 0:
                raise serializers.ValidationError("You must add at least one lesson before publishing.")
        return data

class LessonSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    class Meta:
        model = models.Lesson
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=models.Course.objects.all(), write_only=True, source='course')
    class Meta:
        model = models.Enrollment
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = models.Review
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)