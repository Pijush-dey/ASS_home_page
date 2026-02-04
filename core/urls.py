from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('submit-consultation/', views.submit_consultation, name='submit_consultation'),
]
