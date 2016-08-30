'''
Account models
'''
from django.db import models
from django.core.exceptions import ValidationError

class Account(models.Model):
    '''
    User account data
    uses ints to avoid pitfalls of floats.
    e.g:
    >>> 1000.00 - 65.43
    934.5699999999999
    >>> (int(1000.00*100) - int(65.43*100))/100
    934.57
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
    _balance = models.IntegerField(
        db_index=True,
        default=0,
    )
    unique_together = (("user", "name"),)
    creator = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        null=False,
        related_name='accounts_created'
    )
    unique_together = (("user", "name"),)

    @property
    def balance(self):
        return self._balance / 100

    @balance.setter
    def balance(self, value):
        self._balance = int(value * 100)
        return self.balance


    def __str__(self):
        return "{username}:{0:.2f}".format(
            self.balance,
            username=self.user.username
        )

    def full_clean(self, *args, **kwargs):
        '''
        Overwrites full clean to not allow accounts to have a negative balance
        '''
        if self._balance and self.balance < 0:
            raise ValidationError("Can't create account with negative balance")
        super(Account, self).full_clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        '''
        Run full_clean on save
        '''
        self.full_clean()
        super(Account, self).save(*args, **kwargs)

    def withdraw(self, amount):
        '''
        Withdraws money from account.
        '''
        self.balance = self.balance - amount
        if self.balance < 0:
            raise ValidationError("Overdrawn")
        self.save()

    def deposit(self, amount):
        self.balance = self.balance + amount
        self.save()
