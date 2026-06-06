from django.contrib import admin
from .models import Application, Interview, Notification

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status', 'applied_at']
    list_filter = ['status']

admin.site.register(Interview)
admin.site.register(Notification)
