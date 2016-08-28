'''
Tests for the user permissions checkers.
'''
from unittest.mock import MagicMock

from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

from auth.permissions import (
    manager_permission,
    teller_permission,
    has_manager_permission,
    has_teller_permission
)
from auth.tests.test_views import MockRequest
from auth.permissions import MANAGER, TELLER


class ManagerPermission(TestCase):
    '''
    Tests for manager permissions
    '''
    def setUp(self):
        self.manager = MANAGER
        self.teller = TELLER

    def test_knows_if_someone_is_a_manager(self):
        '''
        Tells if a someone is a manager
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.set([self.manager])
        self.assertTrue(manager_permission(user))

    def test_determines_not_a_teller(self):
        '''
        Returns false if someone is just a teller
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.add(self.teller)
        self.assertFalse(manager_permission(user))

    def test_determines_superuser(self):
        '''
        Returns true is superuser
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
            is_superuser=True
        )
        self.assertTrue(manager_permission(user))

    def test_determines_no_permission(self):
        '''
        Returns false if no permissions
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        self.assertFalse(manager_permission(user))

    def test_decorator(self):
        '''
        Test the decorator to check for manager permissions
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.set([self.manager])
        request = MockRequest(user)
        function = MagicMock()
        self.assertTrue(has_manager_permission(function)(request))
        self.assertTrue(function.called)

    def test_decorator_without_permissions(self):
        '''
        Test the decorator to check for manager permissions no perms
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        function = MagicMock()
        request = MockRequest(user)
        self.assertTrue(has_manager_permission(function)(request))
        self.assertFalse(function.called)

class TellerPermission(TestCase):
    '''
    Tests for teller permissions
    '''
    def setUp(self):
        self.manager = MANAGER
        self.teller = TELLER

    def test_knows_if_someone_is_a_manager(self):
        '''
        Tells if a someone is a manager
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.add(self.manager)
        self.assertTrue(teller_permission(user))

    def test_determines_is_teller(self):
        '''
        Returns True if someone is a teller
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.add(self.teller)
        self.assertTrue(teller_permission(user))

    def test_determines_superuser(self):
        '''
        Returns true is superuser
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
            is_superuser=True
        )
        self.assertTrue(teller_permission(user))

    def test_determines_no_permission(self):
        '''
        Returns false if no permissions
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        self.assertFalse(teller_permission(user))

    def test_decorator(self):
        '''
        Test the decorator to check for teller permissions
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        user.user_permissions.set([self.teller])
        function = MagicMock()
        request = MockRequest(user)
        self.assertTrue(has_teller_permission(function)(request))
        self.assertTrue(function.called)

    def test_decorator_without_permissions(self):
        '''
        Test the decorator to check for teller permissions no perms
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword',
        )
        function = MagicMock()
        request = MockRequest(user)
        self.assertTrue(has_teller_permission(function)(request))
        self.assertFalse(function.called)
