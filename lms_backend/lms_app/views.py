from rest_framework import generics, permissions, viewsets, views, response, status, exceptions
from django_filters import rest_framework as filters
from django.db.models import Count
from .permissions import IsInstructorOrReadOnly
from . import serializers
from . import models

class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'

class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = serializers.UserSerializer(user, context={'request': request})
        return response.Response(serializer.data, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.RegisterSerializer
    permission_classes = [permissions.AllowAny]

class InstructorProfileCreateList(generics.ListCreateAPIView):
    serializer_class = serializers.InstructorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return models.InstructorProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CourseCategoryList(generics.ListAPIView):
    serializer_class = serializers.CourseCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        queryset = models.CourseCategory.objects.all()
        if self.request.query_params.get('used'):
            queryset = models.CourseCategory.objects.annotate(course_count=Count('courses'))
            type = self.request.query_params.get('used')

            if type == 'true':
                queryset = queryset.filter(course_count__gt=0)
            elif type == 'false':
                queryset = queryset.filter(course_count=0)

        if self.request.query_params.get("search"):
            search = self.request.query_params.get("search")
            queryset = models.CourseCategory.objects.filter(name__icontains=search)

        return queryset
    
class CourseList(generics.ListAPIView):
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['category', 'instructor', 'is_published']

    def get_queryset(self):
        user = self.request.user
        queryset = models.Course.objects.filter(is_published=True)

        if user.is_authenticated:
            return queryset | models.Course.objects.filter(instructor=user)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        if 'instructor' in request.query_params:
            self.pagination_class = None
        return super().list(request, *args, **kwargs)
    
class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = models.Course.objects.filter(is_published=True)
        
        if user.is_authenticated:
            return queryset | models.Course.objects.filter(instructor=user)
        
        return queryset

class CourseCreate(generics.CreateAPIView):
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class PostView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = models.Post.objects.all().order_by('-created_on')
        serializer = serializers.PostSerializer(posts, many=True)
        return response.Response(serializer.data)
    
    def post(self, request):
        serializer = serializers.PostSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(author=request.user)
            return response.Response(serializers.PostSerializer(post).data, status=status.HTTP_201_CREATED)
        return response.Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = models.Announcement.objects.all()
    serializer_class = serializers.AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResourceViewSset(viewsets.ModelViewSet):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssignmentViewSset(viewsets.ModelViewSet):
    queryset = models.Assignment.objects.all()
    serializer_class = serializers.AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuizViewSset(viewsets.ModelViewSet):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

class EnrollmentList(generics.ListCreateAPIView):
    serializer_class = serializers.EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return models.Enrollment.objects.filter(student=self.request.user, course__is_published=True)
    
    def perform_create(self, serializer):
        user = self.request.user
        course = serializer.validated_data.get('course')

        if course.instructor == user:
            raise exceptions.ValidationError("Instructors cannot enroll in their own course.")
        
        if models.Enrollment.objects.filter(course=course, student=user ).exists():
            raise exceptions.ValidationError("You are already enrolled in this course.")

        serializer.save(student=user)

class ReviewList(generics.ListCreateAPIView):
    serializer_class = serializers.ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return models.Review.objects.filter(course_id=course_id)
        return models.Review.objects.none()
