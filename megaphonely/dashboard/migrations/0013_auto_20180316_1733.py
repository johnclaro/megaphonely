# Generated by Django 2.0.1 on 2018-03-16 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0012_auto_20180316_1708'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='message',
            field=models.TextField(max_length=1),
        ),
    ]
