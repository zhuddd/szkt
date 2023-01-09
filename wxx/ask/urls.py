from ask import views
from django.urls import path

urlpatterns = [
    path('getlist/', views.getlist, name='getlist'),
    path('add/', views.add, name='add'),
    path('delask/', views.delask, name='delask'),
]
  