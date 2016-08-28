'''
Account models
'''
from django.db import models

class Account(models.Model):
    '''
    User account data
    '''
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        null=False
    )
    address = models.CharField(
        max_length=1000,
        null=False,
    )
    name = models.CharField(
        max_length=40,
        db_index=True,
        null=False,
    )
    phone_number = models.CharField(
        max_length=40,
        db_index=True,
        null=False,
    )
    balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        db_index=True,
        default=0
    )
    unique_together = (("user", "name"),)

    def __str__(self):
        return "{username}:{0:.2f}".format(
            self.balance,
            username=self.user.username
        )

    def save(self, *args, **kwargs):
        '''
        Run full_clean on save
        '''
        self.full_clean()
        super(Account, self).save(*args, **kwargs)
