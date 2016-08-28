from django.db import models

class Account(models.Model):
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        null=False
    )
    address = models.CharField(
        max_length=1000,
        null=False
    )
    name = models.CharField(
        max_length=40,
        db_index=True,
        null=False
    )
    phone_number = models.CharField(
        max_length=40,
        db_index=True,
        null=False
    )
    balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        db_index=True,
        default=0
    )
