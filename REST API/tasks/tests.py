from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task

class TaskAPITests(APITestCase):
    def setUp(self):
        # User 1
        self.user1 = User.objects.create_user(
            username='userone',
            email='userone@example.com',
            password='Password123!'
        )
        self.token1 = str(RefreshToken.for_user(self.user1).access_token)

        # User 2
        self.user2 = User.objects.create_user(
            username='usertwo',
            email='usertwo@example.com',
            password='Password123!'
        )
        self.token2 = str(RefreshToken.for_user(self.user2).access_token)

        # Tasks for User 1
        self.task1 = Task.objects.create(
            owner=self.user1,
            title='Task One',
            description='First task description',
            status='TODO',
            priority='HIGH'
        )
        self.task2 = Task.objects.create(
            owner=self.user1,
            title='Task Two',
            description='Second task description',
            status='IN_PROGRESS',
            priority='MEDIUM'
        )

        # Task for User 2
        self.task3 = Task.objects.create(
            owner=self.user2,
            title='Task Three',
            description='Third task description',
            status='COMPLETED',
            priority='LOW'
        )

        self.list_create_url = reverse('task-list')

    def test_unauthenticated_request_returns_401(self):
        """Unauthenticated requests must be rejected with 401 Unauthorized."""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post(self.list_create_url, {'title': 'Sample'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tasks_authenticated_and_isolated(self):
        """User should only see their own tasks."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['count'], 2)
        titles = [task['title'] for task in response.data['data']]
        self.assertIn('Task One', titles)
        self.assertIn('Task Two', titles)
        self.assertNotIn('Task Three', titles)

    def test_create_task_success(self):
        """Authenticated user can create a task with valid input."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        payload = {
            'title': 'New Feature Deployment',
            'description': 'Deploy the new API endpoints',
            'status': 'TODO',
            'priority': 'HIGH',
            'due_date': '2026-10-01'
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['title'], 'New Feature Deployment')
        self.assertEqual(response.data['data']['owner_username'], 'userone')

    def test_create_task_validation_failure_empty_title(self):
        """Creating a task with empty title should return 400 Bad Request."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        payload = {
            'title': '   ',
            'description': 'No title provided'
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_create_task_validation_failure_invalid_status(self):
        """Creating a task with invalid status should return 400 Bad Request."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        payload = {
            'title': 'Task With Bad Status',
            'status': 'INVALID_STATUS'
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_task_success(self):
        """Retrieve task detail for own task."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        url = reverse('task-detail', kwargs={'pk': self.task1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Task One')

    def test_retrieve_other_user_task_returns_404(self):
        """User cannot access another user's task."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        url = reverse('task-detail', kwargs={'pk': self.task3.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task_put(self):
        """Full update on a task."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        url = reverse('task-detail', kwargs={'pk': self.task1.id})
        payload = {
            'title': 'Task One - Updated',
            'description': 'Updated description',
            'status': 'COMPLETED',
            'priority': 'LOW'
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Task One - Updated')
        self.assertEqual(response.data['data']['status'], 'COMPLETED')

    def test_partial_update_task_patch(self):
        """Partial update on a task."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        url = reverse('task-detail', kwargs={'pk': self.task1.id})
        payload = {'status': 'IN_PROGRESS'}
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], 'IN_PROGRESS')

    def test_delete_task(self):
        """Delete task returns 204 No Content."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        url = reverse('task-detail', kwargs={'pk': self.task1.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(id=self.task1.id).exists())

    def test_filter_and_search_tasks(self):
        """Filter tasks by status and search keyword."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token1}')
        
        # Filter by status
        response = self.client.get(f"{self.list_create_url}?status=TODO")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['data'][0]['title'], 'Task One')

        # Search by keyword
        response = self.client.get(f"{self.list_create_url}?search=Second")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['data'][0]['title'], 'Task Two')
