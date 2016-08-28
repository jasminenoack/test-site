"""
Data on custom permissions
"""
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from django.http import JsonResponse


MANAGER = Permission.objects.get_or_create(
    codename='manager',
    name='manager',
    content_type=ContentType.objects.get_for_model(User)
)[0]
TELLER = Permission.objects.get_or_create(
    codename='teller',
    name='teller',
    content_type=ContentType.objects.get_for_model(User)
)[0]


PERMISSION_CLASSES = {
    'manager': MANAGER,
    'teller': TELLER
}


def manager_permission(user):
    """
    Checks for permission of manager or greater
    """
    return user.is_superuser or user.has_perm("auth.manager")


def teller_permission(user):
    """
    Checks for permission of teller or greater
    """
    return manager_permission(user) or user.has_perm("auth.teller")


def has_manager_permission(function):
    def wrapper(request, *args, **kwargs):
        user = request.user
        if not manager_permission(user):
            return JsonResponse('You cannot view this.', status=403, safe=False)
        else:
            return function(request, *args, **kwargs)
    return wrapper


def has_teller_permission(function):
    def wrapper(request, *args, **kwargs):
        user = request.user
        if not teller_permission(user):
            return JsonResponse('You cannot view this.', status=403, safe=False)
        else:
            return function(request, *args, **kwargs)
    return wrapper
