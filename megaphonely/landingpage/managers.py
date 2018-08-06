from django.db import models


class CharlieManager(models.Manager):

    def email_exists(self, email):
        return self.filter(email=email).exists()
