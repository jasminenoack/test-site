from django.http import JsonResponse

from string_utils import camel_case_to_snake

from bank_management.utils import decode_json_content
from .models import Transaction
from auth.permissions import teller_permission

def post(request):
    user = request.user
    if user.is_anonymous:
        account_ids = []
    else:
        account_ids = user.account_set.values_list('id', flat=True)
    data = decode_json_content(request.body)
    data = {
        camel_case_to_snake(key): data[key]
        for key in data
    }
    data['creator'] = user
    data['amount'] = float(data['amount'])

    if "account_to" in data:
        data["account_to_id"] = data["account_to"]
        del data["account_to"]
    if "account_from" in data:
        data["account_from_id"] = data["account_from"]
        del data["account_from"]

    if (
        teller_permission(user) or
        (
            data.get("transaction_type") == "transfer" and
            data.get("account_to_id") in account_ids and
            data.get("account_from_id") in account_ids
        )
    ):
        Transaction.objects.create(**data)
        return JsonResponse({}, status=201)
    else:
        return JsonResponse({}, status=403)
