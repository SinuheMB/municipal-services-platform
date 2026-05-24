from django.urls import path
from .views import (
    InvoiceListCreateView,
    InvoiceDetailView,
    InvoiceStatusUpdateView,
    PaymentCreateView,
    PaymentListView,
    CitizenInvoiceSummaryView
)

urlpatterns = [
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice_list'),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice_detail'),
    path('invoices/<int:pk>/status/', InvoiceStatusUpdateView.as_view(), name='invoice_status'),
    path('invoices/<int:invoice_id>/payments/', PaymentListView.as_view(), name='payment_list'),
    path('payments/', PaymentCreateView.as_view(), name='payment_create'),
    path('summary/', CitizenInvoiceSummaryView.as_view(), name='citizen_summary'),
]
