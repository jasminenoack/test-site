'''
Tests for auth serialier
'''
from django.test import TestCase
from django.contrib.auth.models import User

from auth.serialize import serialize_user, serialize_users
from accounts.serialize import serialize_accounts
from accounts.models import Account

class SerializerTest(TestCase):
    '''
    Tests serializing users
    '''
    def test_serializes_an_user(self):
        '''
        Serializers a user
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.assertEqual(
            serialize_user(user),
            {
                'id': user.id,
                'username': user.username,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'accounts': [],
                'isManager': False,
                'isTeller': False
            }
        )

    def test_serializes_an_user(self):
        '''
        Serializers users
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
        result = serialize_user(user)
        self.assertEqual(
            result['accounts'],
            serialize_accounts([account])
        )

    def test_serializes_two_users(self):
        '''
        An serialisers multiple users
        '''
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        user2 = User.objects.create_user(
            'jack',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        self.assertEqual(
            len(serialize_users([user, user2])),
            2
        )
