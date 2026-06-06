from django.urls import path
from . import views

urlpatterns = [
    path('', views.JobListView.as_view(), name='job-list'),
    path('featured/', views.FeaturedJobsView.as_view(), name='featured-jobs'),
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('create/', views.JobCreateView.as_view(), name='job-create'),
    path('my-jobs/', views.EmployerJobsView.as_view(), name='my-jobs'),
    path('saved/', views.SavedJobsView.as_view(), name='saved-jobs'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/edit/', views.JobUpdateDeleteView.as_view(), name='job-edit'),
    path('<int:job_id>/save/', views.toggle_save_job, name='toggle-save'),
]
