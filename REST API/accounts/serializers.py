from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        style={'input_type': 'password'},
        help_text="Password must be at least 6 characters long."
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'},
        help_text="Confirm your password (optional, must match if provided)."
    )
    email = serializers.EmailField(
        required=True,
        help_text="Valid email address."
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }

    def validate_username(self, value):
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if User.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value.strip()

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.strip().lower()

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password_confirm is not None and password != password_confirm:
            raise serializers.ValidationError({"password_confirm": ["Passwords do not match."]})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        username = attrs.get('username', '').strip()
        password = attrs.get('password', '')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        # Authenticate by username or email
        user = None
        if '@' in username:
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials. Please verify your username/email and password.")

        if not user.is_active:
            raise serializers.ValidationError("This user account is inactive.")

        attrs['user'] = user
        return attrs
