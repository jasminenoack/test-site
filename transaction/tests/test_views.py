from unittest.mock import patch

from django.test import TestCase, RequestFactory, Client
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser, User

from bank_management.utils import decode_json_content
from auth.permissions import MANAGER, TELLER, PERMISSION_CLASSES
from auth.tests.test_views import MockRequest
from accounts.views import index, detail
from accounts.models import Account
from transaction.models import Transaction


class TransactionPostViewTest(TestCase):
    '''
    Test for posts to the detail view
    '''
    def setUp(self):
        self.client = Client()

    @patch('transaction.views.teller_permission', return_value=True)
    @patch("transaction.views.decode_json_content")
    def test_teller_can_create_withdrawal(self, mock_decode, mock_permission):
        '''
        Should create withdrawal
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
        mock_decode.return_value = {
            'accountFrom': account.id,
            'accountTo': None,
            'amount': 40.98,
            'transaction_type': "withdrawal"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(transactions), 1)

    @patch('transaction.views.teller_permission', return_value=False)
    @patch("transaction.views.decode_json_content")
    def test_customer_cannot_create_withdrawal(self, mock_decode, mock_permission):
        '''
        Should not create withdrawal
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
        mock_decode.return_value = {
            'accountFrom': account.id,
            'accountTo': None,
            'amount': 40.98,
            'transaction_type': "withdrawal"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(transactions), 0)

    @patch('transaction.views.teller_permission', return_value=True)
    @patch("transaction.views.decode_json_content")
    def test_teller_can_create_deposit(self, mock_decode, mock_permission):
        '''
        Should create deposit
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
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': None,
            'amount': 40.98,
            'transaction_type': "deposit"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(transactions), 1)

    @patch('transaction.views.teller_permission', return_value=False)
    @patch("transaction.views.decode_json_content")
    def test_customer_cannot_create_deposit(self, mock_decode, mock_permission):
        '''
        Should not create deposit
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
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': None,
            'amount': 40.98,
            'transaction_type': "deposit"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(transactions), 0)

    @patch('transaction.views.teller_permission', return_value=True)
    @patch("transaction.views.decode_json_content")
    def test_teller_can_create_transfer(self, mock_decode, mock_permission):
        '''
        Should create transfer
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
            name="John's public account",
            creator=user
        )
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': account2.id,
            'amount': 40.98,
            'transaction_type': "transfer"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(transactions), 1)

    @patch('transaction.views.teller_permission', return_value=False)
    @patch("transaction.views.decode_json_content")
    def test_customer_can_create_transfer_if_they_own_accounts(self, mock_decode, mock_permission):
        '''
        Should transfer customer between accounts
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
            name="John's public account",
            creator=user
        )
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': account2.id,
            'amount': 40.98,
            'transaction_type': "transfer"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(transactions), 1)

    @patch('transaction.views.teller_permission', return_value=False)
    @patch("transaction.views.decode_json_content")
    def test_customer_cannot_create_transfer_do_not_own_both(self, mock_decode, mock_permission):
        '''
        Should not transfer customer between multiple customer accounts
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
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account2 = Account.objects.create(
            user=user2,
            balance=1000,
            address="New York",
            phone_number="9176910399",
            name="John's private account",
            creator=user
        )
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': account2.id,
            'amount': 40.98,
            'transaction_type': "transfer"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(transactions), 0)

    @patch('transaction.views.teller_permission', return_value=True)
    @patch("transaction.views.decode_json_content")
    def test_teller_can_create_transfer_do_not_own_both(self, mock_decode, mock_permission):
        '''
        Should allow teller to transfer between multiple customer accounts
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
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account2 = Account.objects.create(
            user=user2,
            balance=1000,
            address="New York",
            phone_number="9176910399",
            name="John's private account",
            creator=user
        )
        mock_decode.return_value = {
            'accountTo': account.id,
            'accountFrom': account2.id,
            'amount': 40.98,
            'transaction_type': "transfer"
        }
        self.client.force_login(user)
        response = self.client.post(
            reverse('transaction:post')
        )
        transactions = Transaction.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(transactions), 1)
