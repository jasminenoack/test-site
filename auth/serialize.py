from accounts.serialize import serialize_accounts
from auth.permissions import (
    manager_permission,
    teller_permission,
)

def serialize_user(user):
    '''
    Serializes user data
    '''
    return {
        'id': user.id,
        'username': user.username,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'accounts': serialize_accounts(user.account_set.all()),
        "isManager": manager_permission(user),
        "isTeller": teller_permission(user)
    }

def serialize_users(users):
    '''
    Serializes user data for multiple users
    '''
    return [serialize_user(user) for user in users]
