# Generated by Django 2.0.1 on 2018-01-23 00:05

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0003_auto_20180122_2222'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialAccount',
            fields=[
                ('social_account_id', models.BigIntegerField(primary_key=True, serialize=False)),
                ('provider', models.CharField(max_length=30)),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='twitteraccount',
            name='users',
        ),
        migrations.DeleteModel(
            name='TwitterAccount',
        ),
        migrations.AlterUniqueTogether(
            name='socialaccount',
            unique_together={('social_account_id', 'provider')},
        ),
    ]
