from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .forms import EditProfileForm, CreateProjectForm

from info.models import Information, Message, Project



@login_required()
def dashboard(request):
    template_name = 'dashboard.html'
    profile = Information.objects.first()
    return render(request, template_name, {'profile':profile, 'dashboard': True})


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
    profile = Information.objects.first()
    messages = Message.objects.all().order_by('-send_time')

    page = request.GET.get('page', 1)

    paginator = Paginator(messages, 6)

    try:
        messages = paginator.page(page)
    except PageNotAnInteger:
        messages = paginator.page(1)
    except EmptyPage:
        messages = paginator.page(paginator.num_pages)

    context.update({'messages_active': True, 'messages': messages, 'profile': profile})
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
            if not message.is_read:
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


@login_required()
def projects(request):
    template_name = 'dashboard_projects.html'
    context = {}
    profile = Information.objects.first()
    projects = Project.objects.all().order_by('-id')
    context.update({'projects_active': True, 'projects': projects, 'profile': profile})
    return render(request, template_name, context)

@login_required()
def projects_api(request):
    if request.method == 'POST':

        if request.POST.get('type') == 'create':
            form = CreateProjectForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return JsonResponse({'status': 'Create Project Successfully', 'code': 200})
            else:
                return JsonResponse({'status': 'Create Project Failed', 'code': 400, 'errors':form.errors})

        elif request.POST.get('type') == 'update':
            id = int(request.POST.get('id'))
            if request.POST.get('first', False):
                project = Project.objects.filter(id=id).values()
                return JsonResponse({'project':list(project)[0], 'code': 200})
            else:
                project = Project.objects.get(id=id)
                form = CreateProjectForm(request.POST, request.FILES, instance=project)
                if form.is_valid():
                    form.save()
                    return JsonResponse({'status': 'Update Project Successfully', 'code': 200})
                else:
                    return JsonResponse({'status': 'Update Project Failed', 'code': 400, 'errors':form.errors})
            return JsonResponse({'status': 'Project Does Not Exist', 'code': 400})

        elif request.POST.get('type') == 'delete':
            id = int(request.POST.get('id'))
            Project.objects.filter(id=id).delete()
            return JsonResponse({'status': 'Remove Project Successfully', 'code': 200})

    return JsonResponse({'status': 'Bad Request'})
