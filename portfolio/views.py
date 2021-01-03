from django.shortcuts import render, get_object_or_404, HttpResponse
from django.http import JsonResponse
from django.core import serializers

import json
from django.db.models import Q
from decouple import config

from django.core.mail import send_mail
from django.conf import settings

from info.forms import MessageForm
from info.models import (
    Competence,
    Education,
    Experience,
    Project,
    Information,
    Message
)


def email_send(data):
    old_message = Message.objects.last()
    if old_message.name == data['name'] and old_message.email == data['email'] and old_message.message == data['message']:
        return False
    subject = 'Portfolio : Mail from {}'.format(data['name'])
    message = '{}\nSender Email: {}'.format(data['message'], data['email'])
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [settings.EMAIL_HOST_USER, ]
    send_mail(subject, message, email_from, recipient_list)
    return True


def homePage(request):
    template_name = 'homePage.html'
    context = {}

    if request.method == 'POST':
        if request.POST.get('rechaptcha', None):
            form = MessageForm(request.POST)
            if form.is_valid():
                form.save(commit=False)
                data = {
                    'name': request.POST['name'],
                    'email': request.POST['email'],
                    'message': request.POST['message']
                }
                if email_send(data):
                    form.save()

                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': form.errors})
        return JsonResponse({'success': False, 'errors': "Oops, you have to check the recaptcha !"})

    if request.method == 'GET':
        form = MessageForm()
        competences = Competence.objects.all().order_by('id')
        education = Education.objects.all().order_by('-id')
        experiences = Experience.objects.all().order_by('-id')
        projects = Project.objects.filter(show_in_slider=True).order_by('-id')
        info = Information.objects.first()
        context = {
            'info': info,
            'competences': competences,
            'education': education,
            'experiences': experiences,
            'projects': projects,
            'form': form,
            'recaptcha_key': config("recaptcha_site_key", default="")
        }
    return render(request, template_name, context)


def projectsPage(request):
    template_name = 'projects/projects_page.html'
    if request.method == 'GET':
        projects = Project.objects.all().order_by('-id')
        context = {
            'projects': projects
        }
        return render(request, template_name, context)


def projectDetail(request, slug):
    template_name = 'projects/project_detail.html'
    if request.method == 'GET':
        project = get_object_or_404(Project, slug=slug)
        return render(request, template_name, {'project': project})


def search(request):
    if request.method == 'POST':
        search_text = request.POST.get('searchText', False)
        if search_text:
            lookups = Q(title__icontains=search_text) | Q(
                description__icontains=search_text) | Q(tools__icontains=search_text)

            objs = Project.objects.filter(lookups)
            if objs:
                projects = Project.objects.filter(lookups).values()
                projects = list(projects)
                for project, obj in zip(projects, objs):
                    project.update({
                        'url': obj.get_project_absolute_url(),
                        'image_url': obj.image.url
                    })
                return JsonResponse({'success': True, 'projects': projects, 'searchText': search_text})
    return JsonResponse({'success': False, 'searchText': search_text})


def handler404(request, exception):
    return render(request, 'errors/404.html', status=404)


def test404(request):
    return render(request, 'errors/404.html')


