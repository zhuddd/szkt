from mail import views
from django.urls import path

urlpatterns = [
    path('getmail/', views.getmail, name='getmail'),
    path('sedmail/', views.sedmail, name='sedmail'),
    path('getmsg/', views.getmsg, name='getmsg'),
]