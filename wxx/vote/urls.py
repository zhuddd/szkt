from vote import views
from django.urls import path

urlpatterns = [
    path('addvote/', views.addvote),
    path('getall/', views.getall),
    path('setvote/', views.setvote),
    path('vote/', views.vote),
    path('getvote/', views.getvote),
    path('delvote/', views.delvote),
]