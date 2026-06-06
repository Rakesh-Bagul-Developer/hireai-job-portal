from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('seeker-profile/', views.seeker_profile, name='seeker-profile'),
    path('employer-profile/', views.employer_profile_view, name='employer-profile'),
    path('users/', views.UserListView.as_view(), name='users-list'),
]
