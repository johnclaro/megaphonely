from django.db import models
from django.conf import settings

from src.accounts.managers import SocialManager, CompanyManager, EmployeeManager


class Profile(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)


class Company(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    accounts = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                      through='Employee')

    objects = CompanyManager()

    class Meta:
        verbose_name_plural = 'companies'

    def __str__(self):
        return self.name


class Employee(models.Model):
    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = EmployeeManager()

    def __str__(self):
        return f"{self.account} - {self.company}"


class Social(models.Model):
    social_id = models.BigIntegerField()
    provider = models.CharField(max_length=30)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100, blank=True)
    picture_url = models.URLField(blank=True)
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider',)

    def __str__(self):
        return self.username
