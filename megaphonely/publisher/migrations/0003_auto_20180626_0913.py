# Generated by Django 2.0.1 on 2018-06-26 08:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0002_auto_20180625_2314'),
    ]

    operations = [
        migrations.AddField(
            model_name='social',
            name='is_prompt',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='content',
            name='account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='editor', to=settings.AUTH_USER_MODEL),
        ),
    ]
