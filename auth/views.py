from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from string_utils import camel_case_to_snake

from bank_management.utils import decode_json_content
from auth.permissions import (
    manager_permission,
    teller_permission,
    has_teller_permission,
    PERMISSION_CLASSES
)
from auth.serialize import serialize_users

@has_teller_permission
def users_index(request):
    return JsonResponse(
        serialize_users(User.objects.extra(
            select={'lower_name':'lower(username)'}
        ).order_by('lower_name').all()),
        status=200,
        safe=False
    )

def data(request):
    """
    Get Data on a user.
    """
    user = request.user
    return JsonResponse(
        {
            "loggedIn": not user.is_anonymous(),
            "username": user.username,
            "isManager": manager_permission(user),
            "isTeller": teller_permission(user)
        },
        status=200
    )


@csrf_exempt
def login_user(request):
    """
    Log in a user. Returns 400 for an invalid user.
    """
    data = decode_json_content(request.body)
    username = data.get("username", "")
    password = data.get("password", "")
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({}, status=200)
    else:
        return JsonResponse({}, status=400)


def logout_user(request):
    """
    Log in a user. Returns 400 for an invalid user.
    """
    logout(request)
    return JsonResponse({}, status=200)


@csrf_exempt
@has_teller_permission
def create_user(request):
    """
    Creates a user based on a request
    """
    try:
        data = decode_json_content(request.body)
        if "password2" in data:
            del data["password2"]

        data = {
            camel_case_to_snake(key): data[key]
            for key in data
            if data[key]
        }

        role = None
        if data.get('role') and not manager_permission(request.user):
            return JsonResponse({}, status=403)
        elif data.get('role'):
            role = data['role']
            del data['role']
        user = User.objects.create_user(**data)

        if role in PERMISSION_CLASSES:
            user.user_permissions.add(PERMISSION_CLASSES[role])
        return JsonResponse({}, status=200)
    except TypeError as e:
        return JsonResponse({}, status=422)
