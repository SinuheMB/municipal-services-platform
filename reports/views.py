from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from billing.models import Invoice, Payment
from services.models import ServiceAccount, Service
from users.models import User
from services.views import IsAdminOrOperator


class DashboardSummaryView(APIView):
    permission_classes = [IsAdminOrOperator]

    def get(self, request):
        today = timezone.now().date()
        first_day_month = today.replace(day=1)

        invoices = Invoice.objects.all()
        payments = Payment.objects.all()

        return Response({
            'users': {
                'total': User.objects.count(),
                'citizens': User.objects.filter(role='citizen').count(),
                'operators': User.objects.filter(role='operator').count(),
            },
            'services': {
                'total_accounts': ServiceAccount.objects.count(),
                'active_accounts': ServiceAccount.objects.filter(status='active').count(),
                'suspended_accounts': ServiceAccount.objects.filter(status='suspended').count(),
            },
            'invoices': {
                'total': invoices.count(),
                'pending': invoices.filter(status='pending').count(),
                'paid': invoices.filter(status='paid').count(),
                'overdue': invoices.filter(status='overdue').count(),
                'pending_amount': invoices.filter(
                    status='pending'
                ).aggregate(total=Sum('total'))['total'] or 0,
                'overdue_amount': invoices.filter(
                    status='overdue'
                ).aggregate(total=Sum('total'))['total'] or 0,
            },
            'payments': {
                'total_this_month': payments.filter(
                    paid_at__date__gte=first_day_month
                ).aggregate(total=Sum('amount'))['total'] or 0,
                'count_this_month': payments.filter(
                    paid_at__date__gte=first_day_month
                ).count(),
            }
        })


class InvoiceReportView(APIView):
    permission_classes = [IsAdminOrOperator]

    def get(self, request):
        status_filter = request.query_params.get('status')
        service_filter = request.query_params.get('service')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        invoices = Invoice.objects.all().select_related(
            'service_account__user',
            'service_account__service'
        )

        if status_filter:
            invoices = invoices.filter(status=status_filter)
        if service_filter:
            invoices = invoices.filter(service_account__service_id=service_filter)
        if date_from:
            invoices = invoices.filter(period_start__gte=date_from)
        if date_to:
            invoices = invoices.filter(period_end__lte=date_to)

        data = []
        for inv in invoices:
            data.append({
                'invoice_number': inv.invoice_number,
                'account_number': inv.service_account.account_number,
                'user': inv.service_account.user.username,
                'service': inv.service_account.service.name,
                'period': f'{inv.period_start} / {inv.period_end}',
                'total': str(inv.total),
                'status': inv.get_status_display(),
                'due_date': str(inv.due_date),
            })

        return Response({
            'count': len(data),
            'total_amount': sum(float(d['total']) for d in data),
            'results': data
        })


class PaymentReportView(APIView):
    permission_classes = [IsAdminOrOperator]

    def get(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        method_filter = request.query_params.get('method')

        payments = Payment.objects.all().select_related(
            'invoice__service_account__user',
            'invoice__service_account__service'
        )

        if date_from:
            payments = payments.filter(paid_at__date__gte=date_from)
        if date_to:
            payments = payments.filter(paid_at__date__lte=date_to)
        if method_filter:
            payments = payments.filter(method=method_filter)

        by_method = payments.values('method').annotate(
            count=Count('id'),
            total=Sum('amount')
        )

        data = []
        for p in payments:
            data.append({
                'reference': p.reference or 'N/A',
                'invoice_number': p.invoice.invoice_number,
                'user': p.invoice.service_account.user.username,
                'amount': str(p.amount),
                'method': p.get_method_display(),
                'paid_at': str(p.paid_at),
            })

        return Response({
            'count': len(data),
            'total_collected': sum(float(d['amount']) for d in data),
            'by_method': list(by_method),
            'results': data
        })
