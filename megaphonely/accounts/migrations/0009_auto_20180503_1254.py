# Generated by Django 2.0.1 on 2018-05-03 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_auto_20180503_1208'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='name',
        ),
        migrations.AddField(
            model_name='profile',
            name='fullname',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]