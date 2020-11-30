from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .forms import EditProfileForm



@login_required()
def dashboard(request):
    template_name = 'dashboard.html'
    return render(request, template_name, {})


@login_required()
def profile(request):
    template_name = 'profile.html'
    context = {}

    context.update({'profile_active': True})
    return render(request, template_name, context)


@login_required()
def profile_edit(request):
    if request.method == 'POST':
        return JsonResponse({'test':request.POST['full_name']})
    return render(request, template_name, context)