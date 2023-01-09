from file import views
from django.urls import path

urlpatterns = [
    path('uploadfile/', views.uploadfile),
    path('uploadmd5/', views.uploadmd5),
    path('download/', views.download),
    path('getfilelist/', views.getfilelist),
    path('deletefile/', views.deletefile),
    path('bigfile/', views.bigfile),
    path('updata/', views.updata),
]