# Generated by Django 2.0.1 on 2018-02-10 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0021_auto_20180210_0839'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='schedule',
            field=models.CharField(choices=[('', 'Please select a schedule type'), ('n', 'Now'), ('c', 'Custom')], max_length=1),
        ),
    ]