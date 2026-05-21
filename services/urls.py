from django.urls import path
from .views import (
    ServiceCategoryListCreateView,
    ServiceCategoryDetailView,
    ServiceListCreateView,
    ServiceDetailView,
    ServiceAccountListCreateView,
    ServiceAccountDetailView
)

urlpatterns = [
    path('categories/', ServiceCategoryListCreateView.as_view(), name='category_list'),
    path('categories/<int:pk>/', ServiceCategoryDetailView.as_view(), name='category_detail'),
    path('', ServiceListCreateView.as_view(), name='service_list'),
    path('<int:pk>/', ServiceDetailView.as_view(), name='service_detail'),
    path('accounts/', ServiceAccountListCreateView.as_view(), name='account_list'),
    path('accounts/<int:pk>/', ServiceAccountDetailView.as_view(), name='account_detail'),
]
