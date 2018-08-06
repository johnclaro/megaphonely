# Generated by Django 2.0.1 on 2018-08-06 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Charlie',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('business', models.CharField(choices=[('brand', 'Brand'), ('influencer', 'Influencer')], max_length=10)),
                ('category', models.CharField(choices=[('books', 'Books'), ('business', 'Business'), ('education', 'Education'), ('entertainment', 'Entertainment'), ('finance', 'Finance'), ('food & drink', 'Food & Drink'), ('games', 'Games'), ('health & fitness', 'Health & Fitness'), ('kids', 'Kids'), ('lifestyle', 'Lifestyle'), ('medical', 'Medical'), ('music', 'Music'), ('navigation', 'Navigation'), ('news', 'News'), ('photo & video', 'Photo & Video'), ('productivity', 'Productivity'), ('reference', 'Reference'), ('social networking', 'Social Networking'), ('shopping', 'Shopping'), ('sports', 'Sports'), ('travel', 'Travel'), ('utilities', 'Utilities'), ('weather', 'Weather')], max_length=100)),
            ],
        ),
    ]