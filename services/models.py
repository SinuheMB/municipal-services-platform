from django.db import models


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Categoría de servicio'
        verbose_name_plural = 'Categorías de servicios'

    def __str__(self):
        return self.name


class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name='services'
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    base_rate = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, help_text='Ej: m3, mes, servicio')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'

    def __str__(self):
        return f'{self.name} - ${self.base_rate}/{self.unit}'


class ServiceAccount(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Activo'
        SUSPENDED = 'suspended', 'Suspendido'
        CANCELLED = 'cancelled', 'Cancelado'

    user = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        related_name='service_accounts'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='accounts'
    )
    account_number = models.CharField(max_length=20, unique=True)
    address = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Cuenta de servicio'
        verbose_name_plural = 'Cuentas de servicio'

    def __str__(self):
        return f'{self.account_number} - {self.user} - {self.service}'