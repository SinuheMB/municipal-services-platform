from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone', 'is_active')
        read_only_fields = ('id',)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'phone')

    def validate_role(self, value):
        requester = self.context['request'].user
        if requester.role == 'admin' and value not in ('admin', 'operator', 'citizen'):
            raise serializers.ValidationError("Rol no válido.")
        if requester.role == 'operator' and value not in ('operator', 'citizen'):
            raise serializers.ValidationError("Operator solo puede crear operator o citizen.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()