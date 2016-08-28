'''
Tests for the auth views.
'''
from unittest.mock import patch

from django.test import TestCase
from django.test import Client
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser, User

from auth.views import data
from bank_management.utils import decode_json_content
from auth.permissions import MANAGER, TELLER, PERMISSION_CLASSES

CLIENT = Client()

class MockRequest(object):
    '''
    A fake request with an attached user.
    '''
    def __init__(self, user, method="get"):
        self.user = user
        self.method = method

class DataViewTest(TestCase):
    '''
    Tests for the data view of users
    '''
    def test_returns_a_200(self):
        '''
        A request should return a 200
        '''
        response = CLIENT.get(reverse('users:data'))
        self.assertEqual(response.status_code, 200)

    def test_it_returns_data_if_no_user(self):
        '''
        A request should indicate if there is no user
        '''
        request = MockRequest(AnonymousUser())
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['loggedIn'],
            False
        )

    def test_it_returns_data_if_a_user(self):
        '''
        A request should indicate if there is a user
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['loggedIn'],
            True
        )

    def test_empty_string_for_username_of_anon(self):
        '''
        A request should have an empty string as a name if
        the user was AnonymousUser
        '''
        request = MockRequest(AnonymousUser())
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['username'],
            ''
        )

    def test_it_returns_username(self):
        '''
        A request should have username as name
        if there is one.
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['username'],
            'john'
        )

    def test_user_is_a_manager(self):
        '''
        return permissions for a manager
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        user.user_permissions.add(MANAGER)
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['isManager'],
            True
        )
        self.assertEqual(
            decode_json_content(response.content)['isTeller'],
            True
        )

    def test_user_is_a_teller(self):
        '''
        Returns permissions for a teller
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        user.user_permissions.add(TELLER)
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['isManager'],
            False
        )
        self.assertEqual(
            decode_json_content(response.content)['isTeller'],
            True
        )

    def test_user_is_a_superuser(self):
        '''
        Returns permissions for a superuser
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
            is_superuser=True
        )
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['isManager'],
            True
        )
        self.assertEqual(
            decode_json_content(response.content)['isTeller'],
            True
        )

    def test_user_is_a_customer(self):
        '''
        Returns permissions for a customer
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        request = MockRequest(user)
        response = data(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            decode_json_content(response.content)['isManager'],
            False
        )
        self.assertEqual(
            decode_json_content(response.content)['isTeller'],
            False
        )

class LoginViewTest(TestCase):
    '''
    Tests for login
    '''
    @patch(
        "auth.views.decode_json_content",
        return_value={'username': 'john', 'password': 'johnpassword'}
    )
    def test_logs_in(self, mock_decode):
        '''
        Should log in a user with the right credentials
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        response = CLIENT.post(reverse('users:login'))
        self.assertEqual(response.status_code, 200)

    @patch(
        "auth.views.decode_json_content",
        return_value={'username': 'john', 'password': 'wrongpassword'}
    )
    def test_rejects_wrong_creds(self, mock_decode):
        '''
        Should not log in a user with the wrong credentials
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        response = CLIENT.post(reverse('users:login'))
        self.assertEqual(response.status_code, 400)

class LogoutViewTest(TestCase):
    '''
    Tests for logout
    '''
    def test_logs_out(self):
        '''
        Should log a user out
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        response = CLIENT.get(
            reverse('users:logout'),
        )
        self.assertEqual(response.status_code, 200)

class CreateUser(TestCase):
    '''
    Tests for creating a user
    '''
    def setUp(self):
        self.patcher = patch('auth.permissions.teller_permission')
        self.mock = self.patcher.start()
        self.mock.return_value = True

    def tearDown(self):
        self.patcher.stop()

    @patch("auth.views.decode_json_content")
    def test_creates_user(self, mock_decode):
        '''
        Should create a user with the appropriate credentials
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'password2': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
        }
        response = CLIENT.post(reverse('users:create'))
        user = User.objects.get()
        self.assertEqual(user.username, name)
        self.assertEqual(user.email, email)
        self.assertEqual(user.first_name, first_name)
        self.assertEqual(user.last_name, last_name)
        self.assertTrue(user.check_password(password))
        self.assertEqual(response.status_code, 200)

    @patch("auth.views.decode_json_content")
    def test_creates_user_for_partial_data(self, mock_decode):
        '''
        Should create a user with appropriate credentials
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
        }
        response = CLIENT.post(reverse('users:create'))
        user = User.objects.get()
        self.assertEqual(user.username, name)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertEqual(response.status_code, 200)

    @patch("auth.views.decode_json_content")
    def test_creates_fails_missing_data(self, mock_decode):
        '''
        Should not create a user with incorrent credentials
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'password': password,
            'email': email,
        }
        response = CLIENT.post(reverse('users:create'))
        self.assertEqual(response.status_code, 422)

    @patch("auth.views.decode_json_content")
    @patch("auth.views.manager_permission", return_value=True)
    def test_creates_teller(self, mock_permission, mock_decode):
        '''
        Should create a teller
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': 'teller'
        }
        mock_permission.return_value = True
        response = CLIENT.post(reverse('users:create'))
        user = User.objects.get()
        self.assertEqual(
            user.user_permissions.all()[0],
             PERMISSION_CLASSES['teller']
        )

    @patch("auth.views.decode_json_content")
    @patch("auth.views.manager_permission")
    def test_creates_manager(self, mock_permission, mock_decode):
        '''
        Should create a manager
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': 'manager'
        }
        mock_permission.return_value = True
        response = CLIENT.post(reverse('users:create'))
        user = User.objects.get()
        self.assertEqual(
            user.user_permissions.all()[0],
            PERMISSION_CLASSES['manager']
        )

    @patch("auth.views.decode_json_content")
    @patch("auth.views.manager_permission")
    def test_creates_with_unknown_role(self, mock_permission, mock_decode):
        '''
        Should ignore other roles
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': 'customer'
        }
        mock_permission.return_value = True
        response = CLIENT.post(reverse('users:create'))
        user = User.objects.get()
        self.assertFalse(
            user.user_permissions.all()
        )

    @patch("auth.views.decode_json_content")
    @patch("auth.permissions.manager_permission")
    def test_creates_does_not_create_role_without_permissions(self, mock_permission, mock_decode):
        '''
        Should not create a user with roles if user doesn't have permissions
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': 'teller'
        }
        mock_permission.return_value = False
        response = CLIENT.post(reverse('users:create'))
        self.assertEqual(response.status_code, 403)

    @patch("auth.views.decode_json_content")
    def test_creates_does_not_create_is_not_teller(self, mock_decode):
        '''
        Should not create a user with roles if user doesn't have permissions
        '''
        name = 'john'
        password = 'johnpassword'
        email = 'email@example.com'
        first_name = 'frank'
        last_name = 'sam'
        mock_decode.return_value = {
            'username': name,
            'password': password,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': 'teller'
        }
        self.mock.return_value = False
        response = CLIENT.post(reverse('users:create'))
        self.assertEqual(response.status_code, 403)

class TestUsersView(TestCase):
    '''
    Test users index view
    '''
    def setUp(self):
        self.client = Client()

    @patch('auth.permissions.teller_permission', return_value=True)
    def test_teller_can_view_users(self, mock_permission):
        '''
        Teller can view users
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        response = self.client.get(
            reverse('users:index')
        )
        self.assertEqual(response.status_code, 200)

    @patch('auth.permissions.teller_permission', return_value=False)
    def test_customer_cannot_call(self, mock_permission):
        '''
        user list should be forbidden to customers
        '''
        response = self.client.get(reverse('users:index'))
        self.assertEqual(response.status_code, 403)
