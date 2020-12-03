from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
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
    messages = Message.objects.all().order_by('-send_time')
    context.update({'messages_active': True, 'messages': messages})
    return render(request, template_name, context)

@login_required()
def messages_api(request):
    if request.method == 'POST':
        type = request.POST.get('option_type')
        message_id = request.POST.get('message_id')
        if type == "delete":
            message = Message.objects.get(id=int(message_id))
            message.delete()
            return JsonResponse({'status': 'success'})
        elif type == "view":
            message = Message.objects.get(id=int(message_id))
            message.is_read = True
            message.save()
            return JsonResponse({'status': 'success'})
        elif type == "search":
            search_text = request.POST.get('search_text')

            lookups = Q(name__icontains=search_text) | Q(
                email__icontains=search_text) | Q(message__icontains=search_text)

            messages = Message.objects.filter(lookups).values()
            messages = list(messages)

            return JsonResponse({'status': 'success', 'messages': messages})
    return JsonResponse({'status': 'bad request'})