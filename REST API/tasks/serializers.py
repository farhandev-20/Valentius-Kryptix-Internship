from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Task
        fields = (
            'id',
            'title',
            'description',
            'status',
            'priority',
            'due_date',
            'owner',
            'owner_username',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'owner', 'owner_username', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Task title cannot be empty.")
        if len(value.strip()) > 200:
            raise serializers.ValidationError("Task title cannot exceed 200 characters.")
        return value.strip()

    def validate_status(self, value):
        if isinstance(value, str):
            value_upper = value.strip().upper()
            valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
            if value_upper not in valid_statuses:
                raise serializers.ValidationError(
                    f"Invalid status '{value}'. Valid options are: {', '.join(valid_statuses)}."
                )
            return value_upper
        return value

    def validate_priority(self, value):
        if isinstance(value, str):
            value_upper = value.strip().upper()
            valid_priorities = [choice[0] for choice in Task.PRIORITY_CHOICES]
            if value_upper not in valid_priorities:
                raise serializers.ValidationError(
                    f"Invalid priority '{value}'. Valid options are: {', '.join(valid_priorities)}."
                )
            return value_upper
        return value
