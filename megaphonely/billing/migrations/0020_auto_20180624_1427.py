# Generated by Django 2.0.1 on 2018-06-24 13:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0019_auto_20180624_1416'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='name',
            new_name='id',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='pricing_plan',
        ),
        migrations.AddField(
            model_name='subscription',
            name='plan',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='billing.Plan'),
            preserve_default=False,
        ),
    ]