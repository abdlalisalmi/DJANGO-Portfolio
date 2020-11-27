from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required



@login_required()
def dashboard(request):
    template_name = 'dashboard.html'
    return render(request, template_name, {})
