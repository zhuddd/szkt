from attendclass import views
from django.urls import path

urlpatterns = [
    path('updata/', views.updata),
    path('getpage/', views.getpage),
    path('getpagelist/', views.getpagelist),
    path('setpage/', views.setpage),
]