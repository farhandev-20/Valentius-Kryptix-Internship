from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Root API endpoint providing metadata and sitemap of available endpoints.
    """
    return Response({
        "status": "online",
        "api_name": "Task Management REST API",
        "version": "1.0.0",
        "documentation": "See README.md and postman_collection.json for full reference",
        "endpoints": {
            "authentication": {
                "register": "/api/auth/register/ [POST]",
                "login": "/api/auth/login/ [POST]",
                "refresh_token": "/api/auth/refresh/ [POST]",
                "user_profile": "/api/auth/me/ [GET, PUT]"
            },
            "tasks": {
                "list_tasks": "/api/tasks/ [GET] (Query params: status, priority, search, ordering)",
                "create_task": "/api/tasks/ [POST]",
                "get_task_by_id": "/api/tasks/{id}/ [GET]",
                "update_task": "/api/tasks/{id}/ [PUT, PATCH]",
                "delete_task": "/api/tasks/{id}/ [DELETE]"
            }
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-overview'),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('tasks.urls')),
]
