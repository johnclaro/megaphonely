# Generated by Django 2.0.1 on 2018-03-06 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0002_auto_20180305_2209'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='plan',
            field=models.CharField(choices=[('standard', 'Standard'), ('advanced', 'Advanced')], default='standard', max_length=20),
            preserve_default=False,
        ),
    ]