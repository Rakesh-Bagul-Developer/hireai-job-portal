from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, JobSeekerProfile, EmployerProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('role', 'phone', 'bio', 'location', 'profile_picture')}),
    )

@admin.register(JobSeekerProfile)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['user', 'experience_years', 'is_open_to_work']

@admin.register(EmployerProfile)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'user', 'is_verified']
