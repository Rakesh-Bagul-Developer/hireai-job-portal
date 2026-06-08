from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'message': 'HireAI Job Portal API is running! ✅',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'jobs': '/api/jobs/',
            'applications': '/api/applications/',
        }
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/applications/', include('applications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)