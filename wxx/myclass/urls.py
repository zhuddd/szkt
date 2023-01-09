from myclass import views
from django.urls import path

urlpatterns = [
    path('getclasslist/', views.getclasslist, name='getclasslist'),
    path('getmember/', views.getmember, name='getmember'),
    path('updatamember/', views.updatamember, name='updatamember'),
    path('delmember/', views.delmember, name='delmember'),
    path('classset/', views.classset, name='classset'),
]