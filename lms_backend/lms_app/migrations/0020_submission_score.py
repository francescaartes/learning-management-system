# Generated by Django 5.2 on 2025-07-03 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lms_app', '0019_alter_submission_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='score',
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
    ]
