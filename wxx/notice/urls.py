from notice import views
from django.urls import path

urlpatterns = [
    path('getnotice/', views.getnotice, name='getnotice'),
    path('delnotice/', views.delnotice, name='delnotice'),
    path('addnotice/', views.addnotice, name='addnotice'),
]