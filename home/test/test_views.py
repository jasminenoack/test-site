from django.test import TestCase
from django.test import Client
from django.urls import reverse

client = Client()


class HomeViewTest(TestCase):
    def test_base_view(self):
        """
        A request should render the base view
        """
        response = client.get(reverse('home:base'))
        self.assertEqual(response.status_code, 200)
