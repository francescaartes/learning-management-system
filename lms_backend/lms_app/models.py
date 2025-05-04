from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    is_instructor = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)

class Course(models.Model):
    title = models.CharField(max_length=200)
    thumbnail = models.ImageField(blank=True)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses', limit_choices_to={'is_instructor': True})
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    language = models.CharField(max_length=100)
    learn = models.JSONField(default=list, blank=True)
    topics = models.JSONField(default=list, blank=True)
    inclusion = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    preview_url = models.URLField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=False)

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        total_reviews = reviews.count()
        if total_reviews > 0:
            total_rating = sum([review.rating for review in reviews])
            return total_rating / total_reviews
        return 0 
    
    @property
    def rating_count(self):
        return self.reviews.count()

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True)