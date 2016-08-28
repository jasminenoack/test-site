from django.test import TestCase
from django.core.exceptions import ValidationError
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
            user=user,
            balance=1000,
            address="New York",
            phone_number="9176910399",
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
            user=user,
            balance=1000,
            name="John's private account",
            address="New York",
            phone_number="9176910399",
        )
        account = Account.objects.create(
            user=user,
            balance=1000,
            name="John's public account",
            address="New York",
            phone_number="9176910399",
        )
        self.assertEqual(len(user.account_set.all()), 2)

    def test_does_not_allow_no_phone_number(self):
        """
        Account requires phone number
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.assertRaises(
            ValidationError,
            Account.objects.create,
            user=user,
            balance=1000,
            address="New York",
            name="John's private account"
        )

    def test_does_not_allow_no_address(self):
        """
        Account requires address
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.assertRaises(
            ValidationError,
            Account.objects.create,
            user=user,
            balance=1000,
            phone_number="9176910399",
            name="John's private account"
        )

    def test_does_not_allow_no_name(self):
        """
        Account requires name
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.assertRaises(
            ValidationError,
            Account.objects.create,
            user=user,
            balance=1000,
            address="New York",
            phone_number="9176910399"
        )

    def test_does_not_allow_no_user(self):
        """
        Account requires user
        """
        self.assertRaises(
            ValidationError,
            Account.objects.create,
            balance=1000,
            address="New York",
            phone_number="9176910399",
            name="John's private account"
        )
