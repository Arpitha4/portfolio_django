from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/', views.projects, name='projects'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('resume/', views.resume, name='resume')
]
