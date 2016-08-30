import json

from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt

from string_utils import camel_case_to_snake

from bank_management.utils import decode_json_content
from accounts.serialize import serialize_account, serialize_accounts
from accounts.models import Account
from auth.permissions import teller_permission, has_teller_permission

def index(request):
    '''
    Supports the index of a users account and the post for a single account
    '''
    user = request.user
    if request.method == "POST":
        if teller_permission(user):
            data = decode_json_content(request.body)
            data = {
                camel_case_to_snake(key): data[key]
                for key in data
            }
            data["user_id"] = data["user"]
            del data["user"]
            data['creator'] = user
            data['balance'] = float(data.get('balance', 0))
            Account.objects.create(**data)
            return JsonResponse({}, status=201)
        else:
            return JsonResponse({}, status=403)

    if user.is_anonymous:
        return JsonResponse([], status=200, safe=False)
    serialized_q = serialize_accounts(
        user.account_set.extra(
            select={'lower_name':'lower(name)'}
        ).order_by('lower_name').all()
    )
    return JsonResponse(
        serialized_q,
        status=200,
        safe=False
    )

@csrf_exempt
def detail(request, account_id):
    """
    Returns the details of the account
    """
    if request.user.is_anonymous:
        return JsonResponse([], status=404, safe=False)
    try:
        if teller_permission(request.user):
            account = Account.objects.get(pk=account_id)
        else:
            account = Account.objects.get(pk=account_id, user=request.user)
        return JsonResponse(serialize_account(account), status=200, safe=False)
    except Account.DoesNotExist:
        return JsonResponse([], status=404, safe=False)

@csrf_exempt
@has_teller_permission
def manage_index(request):
    """
    Returns a list of all accounts
    """
    accounts = Account.objects.extra(
        select={'lower_name':'lower(name)'}
    ).order_by('lower_name').all()
    serialized_q = serialize_accounts(accounts)
    return JsonResponse(
        serialized_q,
        status=200,
        safe=False
    )
