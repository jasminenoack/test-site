'''
Tests for the account views.
'''
from unittest.mock import patch

from django.test import TestCase, RequestFactory, Client
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser, User

from bank_management.utils import decode_json_content
from auth.permissions import MANAGER, TELLER, PERMISSION_CLASSES
from auth.tests.test_views import MockRequest
from accounts.views import index, detail
from accounts.models import Account


class IndexViewTest(TestCase):
    '''
    Tests index view for accounts
    '''
    def setUp(self):
        self.client = Client()

    def test_can_call_view(self):
        '''
        Can call view
        '''
        response = self.client.get(reverse('accounts:index'))
        self.assertEqual(response.status_code, 200)

    def test_anon_user_has_no_accounts(self):
        '''
        An anon user should have no accounts
        '''
        request = MockRequest(user=AnonymousUser)
        response = index(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(decode_json_content(response.content)), 0)

    def test_gets_users_accounts(self):
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
        request = MockRequest(user=user)
        response = index(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(decode_json_content(response.content)), 2)

    def test_returns_nothing_if_user_does_not_have_accounts(self):
        '''
        An user should be able to have no accounts
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user=user)
        response = index(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(decode_json_content(response.content)), 0)

    def test_does_not_return_other_users_account(self):
        '''
        Should not return other users accounts
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
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user=user2)
        response = index(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(decode_json_content(response.content)), 0)

class ManagementIndexViewTest(TestCase):
    """
    Tests for the management index that returns all accounts
    """
    def setUp(self):
        self.client = Client()

    @patch('auth.permissions.teller_permission', return_value=True)
    def test_teller_can_view_all_accounts(self, mock_permission):
        '''
        Should return all accounts
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
            creator=user
        )
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user=user2,
            balance=1000,
            name="John's public account",
            address="New York",
            phone_number="9176910399",
            creator=user
        )
        user3 = User.objects.create_user(
            'fred',
            'lennon@thebeatles.com',
            'johnpassword'
        )

        response = self.client.get(reverse('accounts:manage_index'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(decode_json_content(response.content)), 2)

    @patch('auth.permissions.teller_permission', return_value=False)
    def test_customer_cannot_call(self, mock_permission):
        '''
        Should be forbidden to customers
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
            creator=user
        )
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user=user2,
            balance=1000,
            name="John's public account",
            address="New York",
            phone_number="9176910399",
            creator=user
        )
        user3 = User.objects.create_user(
            'fred',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        response = self.client.get(reverse('accounts:manage_index'))
        self.assertEqual(response.status_code, 403)

class DetailViewTest(TestCase):
    '''
    Tests for the detail view of accounts
    '''
    def setUp(self):
        self.client = Client()

    @patch('accounts.views.teller_permission', return_value=False)
    def test_gets_account_detail_if_user_owns_account(self, mock_permission):
        '''
        User can see his own account
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.client.force_login(user)
        account = Account.objects.create(
            user=user,
            balance=1000,
            name="John's private account",
            address="New York",
            phone_number="9176910399",
            creator=user
        )
        request = MockRequest(user=user)
        response = detail(request, account.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(decode_json_content(response.content)['id'], account.id)

    @patch('accounts.views.teller_permission', return_value=True)
    def test_gets_account_detail_if_user_is_teller_or_above(self, mock_permission):
        '''
        Teller can see other people's accounts
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
            creator=user
        )
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user=user2)
        response = detail(request, account.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(decode_json_content(response.content)['id'], account.id)

    @patch('accounts.views.teller_permission', return_value=False)
    def test_does_not_get_if_not_owned(self, mock_permission):
        '''
        Customer can't see other people's accounts
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
            creator=user
        )
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user=user2)
        response = detail(request, account.id)
        self.assertEqual(response.status_code, 404)

    def test_can_call_view(self):
        '''
        Can call view
        '''
        response = self.client.get(reverse('accounts:detail', kwargs={'account_id': 3}))
        self.assertEqual(response.status_code, 404)

class DetailPostViewTest(TestCase):
    '''
    Test for posts to the detail view
    '''
    def setUp(self):
        self.client = Client()

    @patch('accounts.views.teller_permission', return_value=True)
    @patch("accounts.views.decode_json_content", return_value={
        'user': 1,
        'name': "personal",
        'address': "New York",
        'phoneNumber': "9176910399"
    })
    def test_teller_can_create(self, mock_decode, mock_permission):
        '''
        Should create account
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.client.force_login(user)
        response = self.client.post(
            reverse('accounts:index')
        )
        accounts = Account.objects.all()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(accounts), 1)

    @patch('accounts.views.teller_permission', return_value=False)
    def test_customer_cannot_call(self, mock_permission):
        '''
        Should be forbidden to customers
        '''
        response = self.client.post(reverse('accounts:index'))
        self.assertEqual(response.status_code, 403)
