# Generated by Django 2.0.1 on 2018-03-08 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0014_auto_20180308_1409'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='customer_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='plan',
            field=models.CharField(choices=[('trial', 'Trial'), ('standard', 'Standard'), ('advanced', 'Advanced')], default='trial', max_length=20),
        ),
        migrations.AlterField(
            model_name='customer',
            name='subscription_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]