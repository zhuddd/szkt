from signin import views
from django.urls import path

urlpatterns = [
    path('signin/', views.signin),
]