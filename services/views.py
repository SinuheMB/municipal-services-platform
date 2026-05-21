from rest_framework import generics, permissions
from .models import ServiceCategory, Service, ServiceAccount
from .serializers import (
    ServiceCategorySerializer,
    ServiceSerializer,
    ServiceAccountSerializer
)


class IsAdminOrOperator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ('admin', 'operator')


class ServiceCategoryListCreateView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.filter(is_active=True)
    serializer_class = ServiceCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsAdminOrOperator()]


class ServiceCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAdminOrOperator]


class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.filter(is_active=True).select_related('category')
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [IsAdminOrOperator()]


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrOperator]


class ServiceAccountListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'operator'):
            return ServiceAccount.objects.all().select_related('user', 'service')
        return ServiceAccount.objects.filter(user=user).select_related('service')


class ServiceAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceAccount.objects.all()
    serializer_class = ServiceAccountSerializer
    permission_classes = [IsAdminOrOperator]
