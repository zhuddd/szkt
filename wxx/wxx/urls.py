"""wxx URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from . import settings
from django.conf.urls.static import static
urlpatterns = [
    path('login/', include('login.urls')),
    path('joinadd/', include('joinadd.urls')),
    path('notice/', include('notice.urls')),
    path('myclass/', include('myclass.urls')),
    path('signin/', include('signin.urls')),
    path('feedback/', include('feedback.urls')),
    path('vote/', include('vote.urls')),
    path('task/', include('task.urls')),
    path('mail/', include('mail.urls')),
    path('file/', include('file.urls')),
    path('ask/', include('ask.urls')),
    path('attendclass/', include('attendclass.urls')),
    path('stutest/', include('stutest.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
