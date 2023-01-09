from django.shortcuts import render
from django.http import HttpResponse
from notice import models
import json

# Create your views here.
def getnotice(request):
    classid=request.GET['classid']
    noticedata=models.Notice.objects.filter(classid=classid)
    data=[]
    for i in noticedata:
        data.append({
            'data':i.data,
            'dateid':i.dateid,
            'openid':i.openid
        })
    data=json.dumps(data)
    return HttpResponse(data)

def delnotice(request):
    dateid=request.GET['dateid']
    classid=request.GET['classid']
    models.Notice.objects.filter(dateid=dateid,classid=classid).delete()
    return HttpResponse(1)

def addnotice(request):
    data=request.GET['data']
    dateid=request.GET['dateid']
    classid=request.GET['classid']
    openid=request.GET['openid']
    models.Notice.objects.create(data=data,dateid=dateid,classid=classid,openid=openid)
    return HttpResponse(1)