from django.contrib import admin
from .models import Job, Category, SavedJob

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'employer', 'job_type', 'status', 'is_featured', 'created_at']
    list_filter = ['status', 'job_type', 'is_featured']
    search_fields = ['title', 'description']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(SavedJob)
