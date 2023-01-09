from task import views
from django.urls import path

urlpatterns = [
    path('addtask/', views.addtask),
    path('getall/', views.getall),
    path('onetask/', views.onetask),
    path('onetasklook/', views.onetasklook),
    path('uplv/', views.uplv),
    path('getquestion/', views.getquestion),
    path('sendanswer/', views.sendanswer),
]