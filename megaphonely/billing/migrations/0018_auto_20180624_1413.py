# Generated by Django 2.0.1 on 2018-06-24 13:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0017_auto_20180619_2223'),
    ]

    operations = [
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('stripe_pricing_plan_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(choices=[('free', 'Free'), ('standard', 'Standard'), ('premium', 'Premium')], max_length=20)),
                ('price', models.IntegerField()),
                ('socials', models.IntegerField()),
                ('contents', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='plan',
        ),
        migrations.AddField(
            model_name='subscription',
            name='pricing_plan',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to='billing.Plan'),
            preserve_default=False,
        ),
    ]
