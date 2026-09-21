from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.refresh_url = reverse('auth-refresh')
        self.me_url = reverse('auth-me')
        
        self.user_data = {
            'username': 'johndoe',
            'email': 'johndoe@example.com',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
            'first_name': 'John',
            'last_name': 'Doe'
        }

    def test_user_registration_success(self):
        """Test registering a new user successfully."""
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['username'], 'johndoe')
        self.assertEqual(response.data['user']['email'], 'johndoe@example.com')
        
        # Verify password is NOT stored in plain text
        user = User.objects.get(username='johndoe')
        self.assertNotEqual(user.password, 'StrongPassword123!')
        self.assertTrue(user.check_password('StrongPassword123!'))

    def test_user_registration_duplicate_username(self):
        """Test registration fails with duplicate username."""
        self.client.post(self.register_url, self.user_data, format='json')
        duplicate_data = self.user_data.copy()
        duplicate_data['email'] = 'other@example.com'
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_user_registration_duplicate_email(self):
        """Test registration fails with duplicate email."""
        self.client.post(self.register_url, self.user_data, format='json')
        duplicate_data = self.user_data.copy()
        duplicate_data['username'] = 'differentuser'
        response = self.client.post(self.register_url, duplicate_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_user_registration_password_mismatch(self):
        """Test registration fails if passwords don't match."""
        mismatch_data = self.user_data.copy()
        mismatch_data['password_confirm'] = 'MismatchPassword999!'
        response = self.client.post(self.register_url, mismatch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test login with valid credentials."""
        self.client.post(self.register_url, self.user_data, format='json')
        login_payload = {
            'username': 'johndoe',
            'password': 'StrongPassword123!'
        }
        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_user_login_invalid_password(self):
        """Test login fails with invalid password."""
        self.client.post(self.register_url, self.user_data, format='json')
        login_payload = {
            'username': 'johndoe',
            'password': 'WrongPassword!'
        }
        response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_user_profile_authenticated(self):
        """Test retrieving user profile when authenticated."""
        reg_response = self.client.post(self.register_url, self.user_data, format='json')
        token = reg_response.data['tokens']['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'johndoe')

    def test_user_profile_unauthenticated(self):
        """Test accessing profile without auth returns 401."""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
