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
            name="John's private account",
            creator=user
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
            creator=user
        )
        account = Account.objects.create(
            user=user,
            balance=1000,
            name="John's public account",
            address="New York",
            phone_number="9176910399",
            creator=user
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
            name="John's private account",
            creator=user
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
            name="John's private account",
            creator=user
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
            phone_number="9176910399",
            creator=user
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
            name="John's private account",
        )

    def test_has_deposit(self):
        """
        Account can deposit
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
            name="John's private account",
            creator=user
        )
        account.deposit(65.43)
        self.assertEqual(account.balance, 1065.43)

    def test_can_withdraw(self):
        """
        Account can withdraw
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
            name="John's private account",
            creator=user
        )
        account.withdraw(65.43)
        self.assertEqual(account.balance, 934.57)

    def test_cannot_withdraw_beyond_zero(self):
        """
        Account cannot withdraw beyond zero
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user=user,
            balance=0,
            address="New York",
            phone_number="9176910399",
            name="John's private account",
            creator=user
        )
        self.assertRaises(
            ValidationError,
            account.withdraw,
            65.43,
        )
