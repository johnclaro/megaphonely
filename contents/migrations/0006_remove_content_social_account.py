# Generated by Django 2.0.1 on 2018-01-19 18:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contents', '0005_auto_20180119_1756'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='content',
            name='social_account',
        ),
    ]
