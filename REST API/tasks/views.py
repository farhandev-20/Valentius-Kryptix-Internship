from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Task resource.
    - Protected: requires a valid JWT Bearer token.
    - User Isolation: users can only view, create, edit, or delete their own tasks.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return tasks belonging to authenticated user
        user = self.request.user
        queryset = Task.objects.filter(owner=user)

        # Optional query parameter filtering
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        search_param = self.request.query_params.get('search')
        ordering_param = self.request.query_params.get('ordering')

        if status_param:
            queryset = queryset.filter(status=status_param.strip().upper())
        if priority_param:
            queryset = queryset.filter(priority=priority_param.strip().upper())
        if search_param:
            queryset = queryset.filter(
                Q(title__icontains=search_param.strip()) |
                Q(description__icontains=search_param.strip())
            )
        if ordering_param:
            valid_orderings = ['created_at', '-created_at', 'due_date', '-due_date', 'priority', '-priority', 'title', '-title']
            if ordering_param in valid_orderings:
                queryset = queryset.order_by(ordering_param)

        return queryset

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the task owner
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({
                "success": True,
                "message": "Task created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)
        return Response({
            "success": False,
            "message": "Failed to create task. Please check the submitted fields.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                "success": True,
                "message": "Task updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Failed to update task. Please check the submitted fields.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "success": True,
            "message": "Task deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)
