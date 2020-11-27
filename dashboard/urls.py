from django.urls import path

from .views import dashboard

app_name = 'dashboard'
urlpatterns = [

    path('', dashboard, name='dashboard'),

]
