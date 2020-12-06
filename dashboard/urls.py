from django.urls import path

from .views import (
    dashboard,
    profile,
    profile_edit,
    messages,
    messages_api,
    projects,
    )

app_name = 'dashboard'
urlpatterns = [

    path('', dashboard, name='dashboard'),

    path('profile/', profile, name='profile'),
    path('profile/edit/', profile_edit, name='profile_edit'),

    path('messages', messages, name='messages'),
    path('messages/api/', messages_api, name='messages_api'),

    path('projects', projects, name='projects'),
]
