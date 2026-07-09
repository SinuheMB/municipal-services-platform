from rest_framework import serializers
from .models import Invoice, Payment


class PaymentSerializer(serializers.ModelSerializer):
    method_display = serializers.CharField(
        source='get_method_display',
        read_only=True
    )

    class Meta:
        model = Payment
        fields = (
            'id', 'invoice', 'amount', 'method',
            'method_display', 'reference', 'paid_at', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class InvoiceSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    account_number = serializers.CharField(
        source='service_account.account_number',
        read_only=True
    )
    user_username = serializers.CharField(
        source='service_account.user.username',
        read_only=True
    )

    class Meta:
        model = Invoice
        fields = (
            'id', 'service_account', 'account_number', 'user_username',
            'invoice_number', 'period_start', 'period_end',
            'amount', 'tax', 'total', 'status', 'status_display',
            'due_date', 'issued_at', 'payments', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


class InvoiceStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ('id', 'status')


class CitizenSummarySerializer(serializers.Serializer):
    total_invoices = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    overdue_count = serializers.IntegerField()
    pending_amount = serializers.FloatField()
    overdue_amount = serializers.FloatField()
