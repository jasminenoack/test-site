from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

from transaction.models import Transaction
from accounts.models import Account

class TransactionTest(TestCase):
    def test_str_representation_of_transaction(self):
        """
        String representation of transaction is transaction_type and amount
        """
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
        transaction1 = Transaction.objects.create(
            transaction_type="withdrawal",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )
        transaction2 = Transaction.objects.create(
            transaction_type="deposit",
            amount=30,
            account_from=None,
            account_to=account,
            creator=user
        )
        self.assertEqual(str(transaction1), "withdrawal:30.00")
        self.assertEqual(str(transaction2), "deposit:30.00")

    def test_an_account_can_have_many_transactions(self):
        """
        Tests that can get all transactions for account
        """
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
        transaction1 = Transaction.objects.create(
            transaction_type="withdrawal",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )
        transaction2 = Transaction.objects.create(
            transaction_type="deposit",
            amount=30,
            account_from=None,
            account_to=account,
            creator=user
        )
        self.assertEqual(Transaction.get_by_account(account).count(), 2)


    def test_must_have_transaction_type(self):
        """
        Transaction requires transaction_type
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_must_have_known_transaction_type(self):
        """
        Transaction requires known transaction_type
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="penguin",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_must_have_amount(self):
        """
        Transaction requires amount
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="deposit",
            account_from=None,
            account_to=account,
            creator=user
        )

    def test_must_have_amount_greater_than_zero(self):
        """
        Transaction requires amount greater than 0
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="withdrawal",
            amount=-1,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_must_have_account(self):
        """
        Transaction requires amount
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="deposit",
            creator=user
        )

    def test_must_have_deposit_must_have_account_to(self):
        """
        Transaction requires amount
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="deposit",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_must_have_withdrawal_must_have_account_from(self):
        """
        Transaction requires amount
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="withdrawal",
            amount=30,
            account_to=account,
            account_from=None,
            creator=user
        )

    def test_must_have_transfer_must_have_both_accounts(self):
        """
        Transaction requires amount
        """
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
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="transfer",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_withdrawal_also_changes_account_balance(self):
        """
        Withdrawal affects balance
        """
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
        transaction1 = Transaction.objects.create(
            transaction_type="withdrawal",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )
        self.assertEqual(account.balance, 970)

    def test_cannot_over_withdraw(self):
        """
        Can't withdraw past 0
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account = Account.objects.create(
            user=user,
            balance=0,
            address="New York",
            phone_number="9176910399",
            name="John's private account",
            creator=user
        )
        self.assertRaises(
            ValidationError,
            Transaction.objects.create,
            transaction_type="withdrawal",
            amount=30,
            account_from=account,
            account_to=None,
            creator=user
        )

    def test_deposit_affects_account_balance(self):
        """
        Deposit affects balance
        """
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
        transaction2 = Transaction.objects.create(
            transaction_type="deposit",
            amount=30,
            account_from=None,
            account_to=account,
            creator=user
        )
        self.assertEqual(account.balance, 1030)

    def test_transfer_affects_both_account_balances(self):
        """
        Transfer affects both balances
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account1 = Account.objects.create(
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
        transaction2 = Transaction.objects.create(
            transaction_type="transfer",
            amount=30,
            account_from=account1,
            account_to=account2,
            creator=user
        )
        self.assertEqual(account1.balance, 970)
        self.assertEqual(account2.balance, 1030)

    def test_cannot_change_transaction_value_after_save(self):
        """
        Cannot edit transaction value after create
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account1 = Account.objects.create(
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
            account_from=account1,
            account_to=None,
            creator=user
        )
        transaction.amount = 50
        self.assertRaises(
            ValidationError,
            transaction.save,
        )

    def test_cannot_change_transaction_transaction_type_after_save(self):
        """
        Cannot edit transaction transaction_type after create
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account1 = Account.objects.create(
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
            account_from=account1,
            account_to=None,
            creator=user
        )
        transaction.transaction_type = "deposit"
        self.assertRaises(
            ValidationError,
            transaction.save
        )

    def test_cannot_change_transaction_accounts_after_save(self):
        """
        Cannot edit transaction accounts after create
        """
        user = User.objects.create_user(
            'john',
            'lennon@thebeatles.com',
            'johnpassword'
        )
        account1 = Account.objects.create(
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
            transaction_type="withdrawal",
            amount=30,
            account_from=account1,
            account_to=None,
            creator=user
        )
        transaction.account_to = account1
        transaction.account_from = account2
        self.assertRaises(
            ValidationError,
            transaction.save
        )
