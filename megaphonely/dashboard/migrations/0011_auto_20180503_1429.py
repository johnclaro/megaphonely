# Generated by Django 2.0.1 on 2018-05-03 14:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0010_auto_20180503_1423'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='admin',
            new_name='owner',
        ),
        migrations.RenameField(
            model_name='content',
            old_name='owner',
            new_name='admin',
        ),
    ]
