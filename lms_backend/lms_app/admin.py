from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Instructor)
admin.site.register(models.CourseCategory)
admin.site.register(models.Course)
admin.site.register(models.Student)