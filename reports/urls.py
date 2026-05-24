from django.urls import path
from .views import DashboardSummaryView, InvoiceReportView, PaymentReportView

urlpatterns = [
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard'),
    path('invoices/', InvoiceReportView.as_view(), name='invoice_report'),
    path('payments/', PaymentReportView.as_view(), name='payment_report'),
]
