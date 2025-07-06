from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is_instructor = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    profile_img = models.ImageField(upload_to='profile_imgs/', default="profile_imgs/default_profile.png")

class InstructorProfile(models.Model):
    TEACHING_EXPERIENCE_CHOICES = [
        ("none", "No experience"),
        ("informal", "Informal or peer teaching"),
        ("online", "Online teaching experience"),
        ("in_person", "In-person professional teaching"),
        ("both", "Both online and in-person teaching"),
    ]

    VIDEO_CREATION_EXPERIENCE_CHOICES = [
        ("none", "No experience"),
        ("basic", "Basic (e.g. Zoom recordings, phone camera)"),
        ("intermediate", "Intermediate (basic editing, YouTube uploads)"),
        ("advanced", "Advanced (course-quality video production)"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="instructor_profile")
    teaching_experience = models.CharField(max_length=20, choices=TEACHING_EXPERIENCE_CHOICES)
    video_creation_experience = models.CharField(max_length=20, choices=VIDEO_CREATION_EXPERIENCE_CHOICES)
    agreed_to_policy = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
    class Meta:
        verbose_name_plural = "Instructor Profile"

class CourseCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Course Categories"

class Course(models.Model):
    title = models.CharField(max_length=200, blank=True)
    thumbnail = models.ImageField(upload_to='courses_thumbnail/', default="courses_thumbnail/default_thumbnail.jpg")
    description = models.TextField(blank=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses', limit_choices_to={'is_instructor': True})
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    language = models.CharField(max_length=100, blank=True)
    learn = models.JSONField(default=list, blank=True)
    topics = models.JSONField(default=list, blank=True)
    category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    inclusion = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    preview_url = models.URLField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.title} - {self.instructor}'

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        total_reviews = reviews.count()
        if total_reviews > 0:
            total_rating = sum([review.rating for review in reviews])
            return round(total_rating / total_reviews, 1)
        return 0 
    
    @property
    def rating_count(self):
        return self.reviews.count()
    
    @property
    def enrollment_count(self):
        return self.enrollments.count()

class Post(models.Model):
    POST_TYPES = [
        ("announcement", "Announcement"),
        ("resource", "Resource"),
        ("assignment", "Assignment"),
        ("quiz", "Quiz")
    ]
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_instructor': True})
    type = models.CharField(max_length=20, choices=POST_TYPES)
    title = models.CharField(max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_on']
        
    def __str__(self):
        return f'{self.title} - {self.type}'
    
class Announcement(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='announcement', limit_choices_to={'type': 'announcement'})
    message = models.TextField()

class Resource(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='resource', limit_choices_to={'type': 'resource'})
    content = models.TextField(blank=True)

class Assignment(models.Model):
    SUBMISSION_TYPES = [
        ("file", "File Upload"),
        ("text", "Text Area"),
        ("link", "URL")
    ]
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='assignment', limit_choices_to={'type': 'assignment'})
    instructions = models.TextField()
    due_date = models.DateTimeField(null=True, blank=True)
    max_score = models.PositiveIntegerField(default=100)
    submission_type = models.CharField(max_length=20, choices=SUBMISSION_TYPES, default='file')

class Submission(models.Model):
    assignment = models.ForeignKey("Assignment", on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to="submissions/", blank=True, null=True)
    text = models.TextField(blank=True)
    link = models.URLField(blank=True)
    submitted_on = models.DateTimeField(auto_now_add=True)
    score = models.PositiveBigIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.assignment.id} - {self.student.username}"

class Quiz(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='quiz', limit_choices_to={'type': 'quiz'})
    instructions = models.TextField()
    due_date = models.DateTimeField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=1)

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    options = models.JSONField() 
    correct_answer = models.CharField(max_length=255)

class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    student = models.ForeignKey("User", on_delete=models.CASCADE, related_name="quiz_attempts")
    started_on = models.DateTimeField(auto_now_add=True)
    submitted_on = models.DateTimeField(null=True, blank=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    answers = models.JSONField()

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, limit_choices_to={'is_published': True}, related_name='enrollments')
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
    
    def __str__(self):
        return f'{self.student} - {self.course}'

class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f'{self.user} - {self.course} '