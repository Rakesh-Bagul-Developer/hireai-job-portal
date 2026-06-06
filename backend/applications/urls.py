from django.urls import path
from . import views

urlpatterns = [
    path('apply/', views.ApplyJobView.as_view(), name='apply-job'),
    path('my/', views.MyApplicationsView.as_view(), name='my-applications'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:pk>/status/', views.update_application_status, name='update-status'),
    path('job/<int:job_id>/', views.JobApplicationsView.as_view(), name='job-applications'),
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark-read'),
    path('notifications/read-all/', views.mark_all_read, name='mark-all-read'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
]
