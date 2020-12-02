from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .forms import EditProfileForm

from info.models import Information, Message



@login_required()
def dashboard(request):
    template_name = 'dashboard.html'
    return render(request, template_name, {})


@login_required()
def profile(request):
    template_name = 'profile.html'
    context = {}
    profile = Information.objects.first()
    context.update({'profile_active': True, 'profile': profile})
    return render(request, template_name, context)


@login_required()
def profile_edit(request):
    if request.method == 'POST':
        instance = Information.objects.first()

        avatar = request.FILES.get('avatar', False)
        if avatar:
            account = Information.objects.first()
            account.avatar = avatar
            account.save()
            return redirect('dashboard:profile')
        else:
            form = EditProfileForm(instance=instance, data=request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True})
            return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'status':'bad request'})


@login_required()
def messages(request):
    template_name = 'messages.html'
    context = {}
    messages = Message.objects.all()
    context.update({'messages_active': True, 'messages': messages})
    return render(request, template_name, context)