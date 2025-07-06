from rest_framework import generics, permissions, viewsets, views, response, status, exceptions
from django_filters import rest_framework as filters
from django.db.models import Count, Q
from .permissions import IsInstructorOrReadOnly
from . import serializers
from . import models
from django.utils import timezone

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
            queryset = models.CourseCategory.objects.annotate(course_count=Count('courses', Q(courses__is_published=True)))
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
    pagination_class = None

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

class PostListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        course_id = self.request.query_params.get('course')
        user = self.request.user
        
        if not models.Course.objects.filter(instructor=user.id, id=course_id).exists() and not models.Enrollment.objects.filter(student=user.id,course=course_id).exists():
             raise exceptions.ValidationError("You have no access in this course.")

        posts = models.Post.objects.filter(course=course_id).order_by('-created_on')
        serializer = serializers.PostSerializer(posts, many=True)
        return response.Response(serializer.data)
    
    def post(self, request):
        serializer = serializers.PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            return response.Response(serializers.PostSerializer(post).data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        post = super().get_object()
        user = self.request.user
        course_id = post.course.id

        if not models.Course.objects.filter(instructor=user.id, id=course_id).exists() and not models.Enrollment.objects.filter(student=user.id, course=course_id).exists():
            raise exceptions.PermissionDenied("You have no access to this post.")
        
        return post
    
    def perform_destroy(self, instance):
        user = self.request.user

        if instance.author != user:
            raise exceptions.PermissionDenied("You are not allowed to delete this post.")

        instance.delete()

    def perform_update(self, serializer):
        user = self.request.user

        if serializer.instance.author != user:
            raise exceptions.PermissionDenied("You are not allowed to edit this post.")
        
        serializer.save()

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = models.Announcement.objects.all()
    serializer_class = serializers.AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = models.Assignment.objects.all()
    serializer_class = serializers.AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuizViewSet(viewsets.ModelViewSet):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubmissionCreateView(generics.ListCreateAPIView):
    queryset = models.Submission.objects.all()
    serializer_class = serializers.SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        student = self.request.user
        assignment = serializer.validated_data["assignment"]
        course = assignment.post.course

        enrolled = models.Enrollment.objects.filter(course=course, student=student).exists()
        if not enrolled:
            raise exceptions.ValidationError("You must be enrolled in this course to submit.")

        existing = models.Submission.objects.filter(assignment=assignment, student=student).first()
        if existing:
            raise exceptions.ValidationError("You have already submitted this assignment.")
        
        if assignment.due_date and timezone.now() > assignment.due_date:
            raise exceptions.ValidationError("The submission deadline has passed.")

        serializer.save(student=student)

    def get_queryset(self):
        queryset = self.queryset.filter(student=self.request.user)
        assignment_id = self.request.query_params.get("assignment")
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)
        return queryset

class SubmissionDeleteView(generics.DestroyAPIView):
    queryset = models.Submission.objects.all()
    serializer_class = serializers.SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

class InstructorSubmissionsListView(generics.ListAPIView):
    serializer_class = serializers.SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        assignment_id = self.request.query_params.get('assignment')
        if not assignment_id:
            raise exceptions.ValidationError("assignment parameter is required.")
        
        try:
            assignment = models.Assignment.objects.select_related('post__course').get(id=assignment_id)
        except models.Assignment.DoesNotExist:
            raise exceptions.NotFound("Assignment not found.")

        course = assignment.post.course
        if course.instructor != self.request.user:
            raise exceptions.PermissionDenied("You are not the instructor of this course.")

        return models.Submission.objects.filter(assignment=assignment).select_related("student").order_by("-submitted_on")

class SubmissionScoreUpdateView(generics.UpdateAPIView):
    queryset = models.Submission.objects.all()
    serializer_class = serializers.SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        submission = self.get_object()

        if submission.assignment.post.course.instructor != request.user:
            return response.Response({"detail": "You do not have permission to grade this submission."}, status=403)

        score = request.data.get("score")
        if score is None:
            return response.Response({"detail": "Score is required."}, status=400)

        try:
            score = int(score)
        except ValueError:
            return response.Response({"detail": "Score must be an integer."}, status=400)

        if score < 0 or score > submission.assignment.max_score:
            return response.Response({"detail": f"Score must be between 0 and {submission.assignment.max_score}."}, status=400)

        submission.score = score
        submission.save()

        return response.Response({"detail": "Score updated successfully."})

class QuizInfoView(generics.RetrieveAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizInfoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        quiz = super().get_object()
        user = self.request.user
        course = quiz.post.course

        enrolled = models.Enrollment.objects.filter(course=course, student=user).exists()
        if not enrolled:
            raise exceptions.PermissionDenied("You must be enrolled to view this quiz.")
        return quiz

class QuizAttemptListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = models.QuizAttempt.objects.filter(student=self.request.user)
        quiz_id = self.request.query_params.get("quiz")
        if quiz_id:
            queryset = queryset.filter(quiz_id=quiz_id)
        return queryset

    def perform_create(self, serializer):
        quiz_id = self.request.data.get("quiz")
        if not quiz_id:
            raise exceptions.ValidationError({"quiz": "This field is required."})

        quiz = models.Quiz.objects.get(id=quiz_id)
        course = quiz.post.course

        enrolled = models.Enrollment.objects.filter(course=course, student=self.request.user).exists()
        if not enrolled:
            raise exceptions.PermissionDenied("You must be enrolled to attempt this quiz.")

        prior_attempts = models.QuizAttempt.objects.filter(student=self.request.user, quiz=quiz).count()
        if prior_attempts >= quiz.max_attempts:
            raise exceptions.ValidationError(f"You have reached the maximum of {quiz.max_attempts} attempts.")

        answers = self.request.data.get("answers", {})
        correct_count = 0
        total_questions = quiz.questions.count()

        for q in quiz.questions.all():
            submitted_answer = answers.get(str(q.id))
            if submitted_answer is not None and submitted_answer.strip() == q.correct_answer.strip():
                correct_count += 1

        serializer.save(
            student=self.request.user,
            quiz=quiz,
            score=correct_count, 
            answers=answers,
            submitted_on=timezone.now()
        )

        self._custom_response = {
            "score": correct_count,
            "total": total_questions,
        }

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return response.Response(self._custom_response, status=status.HTTP_201_CREATED)

class QuizAttemptDetailView(generics.RetrieveAPIView):
    queryset = models.QuizAttempt.objects.all()
    serializer_class = serializers.QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        attempt = super().get_object()
        if attempt.student != self.request.user:
            raise exceptions.PermissionDenied("You do not have access to this attempt.")
        return attempt

class InstructorQuizDetailView(generics.RetrieveAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.InstructorQuizDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        quiz = super().get_object()
        user = self.request.user

        if quiz.post.course.instructor != user:
            raise exceptions.PermissionDenied("You are not the instructor of this course.")

        return quiz
    
class MyQuizAttemptsView(generics.ListAPIView):
    serializer_class = serializers.QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs["quiz_id"]
        return models.QuizAttempt.objects.filter(
            quiz_id=quiz_id,
            student=self.request.user
        ).order_by("-started_on")

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
