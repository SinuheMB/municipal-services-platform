from django.contrib import admin
from .models import Invoice, Payment


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'service_account', 'total', 'status', 'due_date')
    list_filter = ('status',)
    search_fields = ('invoice_number',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'amount', 'method', 'paid_at')
    list_filter = ('method',)
    search_fields = ('invoice__invoice_number', 'reference')
