from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ]

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text="The user who owns this task."
    )
    title = models.CharField(
        max_length=200,
        help_text="Title of the task."
    )
    description = models.TextField(
        blank=True,
        default='',
        help_text="Detailed description of the task."
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TODO',
        help_text="Current status: TODO, IN_PROGRESS, or COMPLETED."
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='MEDIUM',
        help_text="Priority level: LOW, MEDIUM, or HIGH."
    )
    due_date = models.DateField(
        null=True,
        blank=True,
        help_text="Due date in YYYY-MM-DD format."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self):
        return f"{self.title} ({self.status}) - {self.owner.username}"
