'''
Tests for account serialier
'''
from django.test import TestCase
from django.contrib.auth.models import User

from accounts.models import Account
from accounts.serialize import serialize_account, serialize_accounts


class SerializerTest(TestCase):
    '''
    Tests serializing accounts
    '''
    def test_serializes_an_account(self):
        '''
        An user should have accounts
        '''
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
        self.assertEqual(
            serialize_account(account),
            {
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'balance': account.balance,
                'name': account.name,
                'id': account.id,
                'address': account.address,
                'phoneNumber': account.phone_number
            }
        )

    def test_serializes_two_accounts(self):
        '''
        An user should have accounts
        '''
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
        account2 = Account.objects.create(
            user=user,
            balance=1000,
            name="John's public account",
            address="New York",
            phone_number="9176910399",
        )
        self.assertEqual(
            len(serialize_accounts([account, account2])),
            2
        )
