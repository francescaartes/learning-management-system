# Generated by Django 5.2 on 2025-05-15 06:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lms_app', '0011_instructorprofile_delete_instructorapplication'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='instructorprofile',
            options={'verbose_name_plural': 'Instructor Profile'},
        ),
        migrations.RenameField(
            model_name='instructorprofile',
            old_name='created_at',
            new_name='created_on',
        ),
    ]
