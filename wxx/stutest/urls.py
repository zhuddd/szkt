from stutest import views
from django.urls import path

urlpatterns = [
    path('gettestlist/', views.gettestlist),
    path('getone/', views.getone),
    path('addtest/', views.addtest),
    path('gettest/', views.gettest),
    path('addcj/', views.addcj),
    path('getcj/', views.getcj),
    path('endtest/', views.endtest),
    path('deltest/', views.deltest),
]