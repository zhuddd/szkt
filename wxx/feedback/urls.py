from feedback import views
from django.urls import path

urlpatterns = [
    path('creat/', views.creat, name='creat'),
    path('getclass/', views.getclass, name='getclass'),
    path('delete/', views.delete, name='delete'),
    path('getmy/', views.getmy, name='getmy'),
]
  