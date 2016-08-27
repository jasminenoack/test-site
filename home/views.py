"""
Base view for the site that renders the react.
"""
from django.shortcuts import render


def base(request):
    """
    Base html view that renders the site react.
    """
    return render(request, 'home/base.html')
