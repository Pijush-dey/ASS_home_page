from django.contrib import admin

from .models import ConsultationRequest, GeneralFAQ, SubsidyFAQ, TechnicalFAQ, InstallationFAQ

@admin.register(ConsultationRequest)
class ConsultationRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'mobile_number', 'district', 'created_at')
    search_fields = ('full_name', 'mobile_number')
    list_filter = ('district', 'created_at')

@admin.register(GeneralFAQ)
class GeneralFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'created_at')
    list_filter = ('is_active',)

@admin.register(SubsidyFAQ)
class SubsidyFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'created_at')
    list_filter = ('is_active',)

@admin.register(TechnicalFAQ)
class TechnicalFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'created_at')
    list_filter = ('is_active',)

@admin.register(InstallationFAQ)
class InstallationFAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'is_active', 'created_at')
    list_filter = ('is_active',)
