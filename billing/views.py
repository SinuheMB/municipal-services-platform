from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer, InvoiceStatusSerializer
from services.views import IsAdminOrOperator


class InvoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'operator'):
            return Invoice.objects.all().select_related(
                'service_account__user',
                'service_account__service'
            )
        return Invoice.objects.filter(
            service_account__user=user
        ).select_related('service_account__service')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminOrOperator()]
        return [permissions.IsAuthenticated()]


class InvoiceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'operator'):
            return Invoice.objects.all()
        return Invoice.objects.filter(service_account__user=user)


class InvoiceStatusUpdateView(generics.UpdateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceStatusSerializer
    permission_classes = [IsAdminOrOperator]


class PaymentCreateView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrOperator]

    def perform_create(self, serializer):
        payment = serializer.save()
        invoice = payment.invoice
        total_paid = sum(p.amount for p in invoice.payments.all())
        if total_paid >= invoice.total:
            invoice.status = 'paid'
            invoice.save()


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrOperator]

    def get_queryset(self):
        invoice_id = self.kwargs.get('invoice_id')
        return Payment.objects.filter(invoice_id=invoice_id)


class CitizenInvoiceSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        invoices = Invoice.objects.filter(
            service_account__user=request.user
        ).select_related('service_account__service')

        pending = invoices.filter(status='pending')
        overdue = invoices.filter(status='overdue')

        return Response({
            'total_invoices': invoices.count(),
            'pending_count': pending.count(),
            'overdue_count': overdue.count(),
            'pending_amount': sum(i.total for i in pending),
            'overdue_amount': sum(i.total for i in overdue),
        })
