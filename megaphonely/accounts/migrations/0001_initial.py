# Generated by Django 2.0.1 on 2018-01-31 22:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Facebook',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('fullname', models.CharField(max_length=100)),
                ('picture_url', models.URLField()),
                ('access_token_key', models.TextField(max_length=1000)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Twitter',
            fields=[
                ('id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('fullname', models.CharField(max_length=100)),
                ('picture_url', models.URLField()),
                ('access_token_key', models.TextField(max_length=1000)),
                ('access_token_secret', models.TextField()),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
