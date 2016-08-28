def serialize_account(account):
    '''
    Serializes data for a single account
    '''
    return {
        'id': account.id,
        'user': {
            'id': account.user.id,
            'username': account.user.username,
        },
        'name': account.name,
        'balance': account.balance,
        'address': account.address,
        'phoneNumber': account.phone_number
    }

def serialize_accounts(accounts):
    '''
    serializes data for multiple accounts
    '''
    return [serialize_account(account) for account in accounts]
