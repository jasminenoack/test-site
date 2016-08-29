def serialize_transaction(transaction):
    '''
    Serializes data for a single transaction
    '''
    data = {
        'id': transaction.id,
        'transactionType': transaction.transaction_type,
        'amount': transaction.amount,
        'accountTo': {
            'name': transaction.account_to and transaction.account_to.name,
            'id':transaction.account_to and transaction.account_to.id,
        },
        'accountFrom': {
            'name': transaction.account_from and transaction.account_from.name,
            'id': transaction.account_from and transaction.account_from.id
        },
    }
    return data

def serialize_transactions(transactions):
    '''
    serializes data for multiple tranactions
    '''
    return [serialize_transaction(transaction) for transaction in transactions]
