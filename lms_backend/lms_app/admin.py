from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.CourseCategory)
admin.site.register(models.Course)
admin.site.register(models.Post)
admin.site.register(models.Assignment)
admin.site.register(models.Announcement)
admin.site.register(models.Quiz)
admin.site.register(models.Resource)
admin.site.register(models.Enrollment)
admin.site.register(models.Review)
admin.site.register(models.InstructorProfile)