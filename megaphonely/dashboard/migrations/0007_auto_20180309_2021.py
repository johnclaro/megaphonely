# Generated by Django 2.0.1 on 2018-03-09 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0006_auto_20180309_2020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='social',
            name='access_token_key',
            field=models.TextField(max_length=1000),
        ),
    ]