from django.test import TestCase
from accounts.models import Account
from django.contrib.auth.models import User

class AccountTest(TestCase):
    def test_str_representation_of_account(self):
        """
        String representation of account is the username and the balance
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user='john',
            balance=1000,
            name="John's private account"
        )
        self.assertEqual(str(account), "john:1000.00")

    def test_a_user_can_have_many_accounts(self):
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user='john',
            balance=1000,
            name="John's private account"
        )
        account = Account.objects.create(
            user='john',
            balance=1000,
            name="John's public account"
        )
        self.assertEqual(len(john.accounts_set), 2)
