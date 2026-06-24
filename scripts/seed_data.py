import os

from users.models import User
from services.models import ServiceCategory, Service, ServiceAccount
from billing.models import Invoice, Payment
from datetime import date

u, _ = User.objects.get_or_create(username='admin1', defaults={'email':'admin@municipal.com', 'role':'admin', 'is_superuser':True, 'is_staff':True})
u.role = 'admin'
u.set_password(os.getenv('ADMIN_PASSWORD', 'Admin1234!'))
u.save()

ciudadanos = []
for i in range(1, 6):
    c, _ = User.objects.get_or_create(username=f'ciudadano{i}', defaults={'email':f'ciudadano{i}@demo.com', 'role':'citizen'})
    ciudadanos.append(c)

cat, _ = ServiceCategory.objects.get_or_create(name='Agua Potable', defaults={'description':'Servicio de agua potable'})
cat2, _ = ServiceCategory.objects.get_or_create(name='Alcantarillado', defaults={'description':'Red de drenaje'})
svc, _ = Service.objects.get_or_create(name='Consumo de agua', defaults={'category':cat, 'base_rate':12.50, 'unit':'m3'})
Service.objects.get_or_create(name='Drenaje mensual', defaults={'category':cat2, 'base_rate':85.00, 'unit':'mes'})

for i, c in enumerate(ciudadanos):
    acc, _ = ServiceAccount.objects.get_or_create(
        account_number=f'AGU-2026-00{i+1}',
        defaults={'user':c, 'service':svc, 'address':f'Calle Demo {i+1}, Morelia'}
    )
    for m in range(1, 4):
        inv, created = Invoice.objects.get_or_create(
            invoice_number=f'FAC-2026-{i+1}{m}',
            defaults={
                'service_account':acc,
                'period_start':date(2026,m,1),
                'period_end':date(2026,m,28),
                'amount':125.00,
                'tax':20.00,
                'total':145.00,
                'due_date':date(2026,m+1,15),
                'status':'paid' if m < 3 else 'pending'
            }
        )
        if created and m < 3:
            Payment.objects.create(invoice=inv, amount=145.00, method='cash', reference=f'PAG-{i+1}{m}')

print('Datos de demo creados correctamente')
