from joinadd import views
from django.urls import path

urlpatterns = [
    path('add/', views.add, name='add'),
    path('find/', views.find, name='find'),
    path('join/', views.join, name='join'),
    path('getkt', views.getkt, name='getkt'),
]