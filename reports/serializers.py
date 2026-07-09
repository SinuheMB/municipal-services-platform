from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):
    users = serializers.DictField()
    services = serializers.DictField()
    invoices = serializers.DictField()
    payments = serializers.DictField()


class InvoiceReportSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    total_amount = serializers.FloatField()
    results = serializers.ListField()


class PaymentReportSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    total_collected = serializers.FloatField()
    by_method = serializers.ListField()
    results = serializers.ListField()
