from django.urls import path

from .views import (
    dashboard,
    profile,
    profile_edit,
    )

app_name = 'dashboard'
urlpatterns = [

    path('', dashboard, name='dashboard'),
    path('profile/', profile, name='profile'),
    path('profile/edit/', profile_edit, name='profile_edit'),

]
