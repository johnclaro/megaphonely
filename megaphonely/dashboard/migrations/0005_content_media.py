# Generated by Django 2.0.1 on 2018-02-08 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0004_remove_content_media'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='media',
            field=models.ImageField(blank=True, null=True, upload_to='uploads'),
        ),
    ]