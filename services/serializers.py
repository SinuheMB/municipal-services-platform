from rest_framework import serializers
from .models import ServiceCategory, Service, ServiceAccount


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ('id', 'name', 'description', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = Service
        fields = (
            'id', 'category', 'category_name', 'name',
            'description', 'base_rate', 'unit', 'is_active', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class ServiceAccountSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(
        source='user.username',
        read_only=True
    )
    service_name = serializers.CharField(
        source='service.name',
        read_only=True
    )

    class Meta:
        model = ServiceAccount
        fields = (
            'id', 'user', 'user_username', 'service', 'service_name',
            'account_number', 'address', 'status', 'created_at'
        )
        read_only_fields = ('id', 'created_at')
