from django.contrib import admin
from .models import ServiceCategory, Service, ServiceAccount


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_rate', 'unit', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name',)


@admin.register(ServiceAccount)
class ServiceAccountAdmin(admin.ModelAdmin):
    list_display = ('account_number', 'user', 'service', 'status', 'created_at')
    list_filter = ('status', 'service')
    search_fields = ('account_number', 'user__username')