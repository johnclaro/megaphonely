# Generated by Django 2.0.1 on 2018-06-19 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0011_auto_20180619_1824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='stripe_customer_id',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]