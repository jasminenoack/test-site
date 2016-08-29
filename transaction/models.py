"""
Transaction Models
"""
from django.db import models
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import Q

class Transaction(models.Model):
    """
    Transaction model includes withdrawal, deposit, transfer.
    uses ints to avoid pitfalls of floats.
    e.g:
    >>> 1000.00 - 65.43
    934.5699999999999
    >>> (int(1000.00*100) - int(65.43*100))/100
    934.57
    """
    TRANSACTION_TYPES = ("deposit", "withdrawal", "transfer")
    created_on = models.DateTimeField(auto_now=True, null=False, db_index=True,)
    transaction_type = models.CharField(max_length=20, db_index=True, null=False)
    _amount = models.IntegerField(db_index=True, null=False)
    account_to = models.ForeignKey(
        'accounts.Account',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='deposits_to'
    )
    account_from = models.ForeignKey(
        'accounts.Account',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='withdrawals_from'
    )
    creator = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        null=False,
        related_name='transactions_processed'
    )

    @classmethod
    def get_by_account(cls, account):
        return cls.objects.filter(
            Q(account_from=account) | Q(account_to=account)
        ).order_by('-pk').all()

    @property
    def amount(self):
        return self._amount / 100

    @amount.setter
    def amount(self, value):
        self._amount = int(value * 100)
        return self.amount

    def __str__(self):
        return "{0}:{1:.2f}".format(
            self.transaction_type,
            self.amount
        )

    def clean(self, *args, **kwargs):
        """
        Custom Validatation:
        A transaction cannot be edited.
        A transaction must have an account associated
        A transaction must have a known type
        """
        if self.id:
            raise ValidationError("Cannot edit a transaction")
        if not (self.account_from or self.account_to)  or self.account_from == self.account_to:
            raise ValidationError("Must be associated with an account")
        if self.transaction_type not in self.TRANSACTION_TYPES:
            raise ValidationError("Cannot have unknown transaction type")
        if not (
            (
                self.transaction_type == "deposit" and
                self.account_to and
                not self.account_from
            ) or
            (
                self.transaction_type == "withdrawal" and
                not self.account_to and
                self.account_from
            ) or
            (
                self.transaction_type == "transfer" and
                self.account_to and
                self.account_from
            )
        ):
            raise ValidationError("Incorrect transaction format")
        super(Transaction, self).clean(*args, **kwargs)

    @transaction.atomic
    def save(self, *args, **kwargs):
        """
        During save ask the accounts to update.
        """
        self.full_clean()
        if self.account_from:
            self.account_from.withdraw(self.amount)
        if self.account_to:
            self.account_to.deposit(self.amount)
        super(Transaction, self).save(*args, **kwargs)
