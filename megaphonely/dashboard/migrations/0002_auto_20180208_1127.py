# Generated by Django 2.0.1 on 2018-02-08 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='social',
            name='social_id',
            field=models.CharField(max_length=250),
        ),
    ]