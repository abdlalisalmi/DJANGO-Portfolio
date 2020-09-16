from django.contrib import admin
from .models import Competence, Education, Experience, Project, Message, Information


admin.site.register(Information)
admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Competence)
admin.site.register(Project)
admin.site.register(Message)
