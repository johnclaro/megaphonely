# Generated by Django 2.0.1 on 2018-02-10 08:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0023_auto_20180210_0842'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='schedule',
            field=models.CharField(choices=[('n', 'Now'), ('c', 'Custom')], default='n', max_length=1),
        ),
    ]