'''
Tests for transaction serialier
'''
from django.test import TestCase
from django.contrib.auth.models import User

from transaction.serialize import serialize_transaction, serialize_transactions
from accounts.models import Account
from transaction.models import Transaction

class SerializerTest(TestCase):
    '''
    Tests serializing transactions
    '''
    def test_serializes_a_withdrawal(self):
        '''
        Serializers a withdrawal
        '''
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
        transaction = Transaction.objects.create(
            transaction_type="withdrawal",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )
        self.assertEqual(
            serialize_transaction(transaction),
            {
                'id': transaction.id,
                'amount': transaction.amount,
                'transactionType': transaction.transaction_type,
                'accountFrom': {
                    'name': account.name,
                    'id': account.id
                },
                'accountTo': {
                    'name': None,
                    'id': None
                },
            }
        )

    def test_serializes_a_deposit(self):
        '''
        Serializers a withdrawal
        '''
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
        transaction = Transaction.objects.create(
            transaction_type="deposit",
            amount=30,
            account_to=account,
            account_from=None,
            creator=user
        )
        self.assertDictEqual(
            serialize_transaction(transaction),
            {
                'id': transaction.id,
                'amount': transaction.amount,
                'transactionType': transaction.transaction_type,
                'accountTo': {
                    'name': account.name,
                    'id': account.id
                },
                'accountFrom': {
                    'name': None,
                    'id': None
                },
            }
        )

    def test_serializes_a_transfer(self):
        '''
        Serializers a transfer
        '''
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
        account2 = Account.objects.create(
            user=user,
            balance=1000,
            address="New York",
            phone_number="9176910399",
            name="John's business account",
            creator=user
        )
        transaction = Transaction.objects.create(
            transaction_type="transfer",
            amount=30,
            account_to=account,
            account_from=account2,
            creator=user
        )
        data = serialize_transaction(transaction)
        self.assertDictEqual(
            data['accountTo'],
            {
                'name': account.name,
                'id': account.id
            }
        )
        self.assertEqual(
            data['accountFrom'],
            {
                'name': account2.name,
                'id': account2.id
            }
        )

    def test_serializes_two_transactions(self):
        '''
        An serialisers multiple transactions
        '''
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
        account2 = Account.objects.create(
            user=user,
            balance=1000,
            address="New York",
            phone_number="9176910399",
            name="John's business account",
            creator=user
        )
        transaction = Transaction.objects.create(
            transaction_type="transfer",
            amount=30,
            account_from=account,
            account_to=account2,
            creator=user
        )
        transaction2 = Transaction.objects.create(
            transaction_type="transfer",
            amount=30,
            account_from=account,
            account_to=account2,
            creator=user
        )
        self.assertEqual(
            len(serialize_transactions([transaction, transaction2])),
            2
        )
