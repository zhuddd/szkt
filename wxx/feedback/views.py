from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json
import time
# Create your views here.


def creat(request):
    openid=request.GET.get('openid')
    data=request.GET.get('data')
    classid=request.GET.get('classid')
    dateid=int(round(time.time() * 1000))
    obj=models.AllClass.objects.get(classid=classid)
    openid=models.UserData.objects.get(openid=openid)
    try:
        models.Feedback.objects.create(dateid=dateid,openid=openid,data=data,classid=obj)
        return HttpResponse('success')
    except:
        return HttpResponse('error')

def getclass(request):
    classid=request.GET.get('classid')
    dateid=request.GET.get('dateid')
    if dateid==None:
        try:
            data=models.Feedback.objects.filter(classid=classid)
            data=list(data.values())
            return HttpResponse(json.dumps(data))
        except:
            return HttpResponse('error')
    else:
        try:
            data=models.Feedback.objects.filter(classid=classid,dateid=dateid)
            data=list(data.values())
            return HttpResponse(json.dumps(data))
        except:
            return HttpResponse('error')

def getmy(request):
    openid=request.GET.get('openid')
    try:
        data=models.Feedback.objects.filter(openid=openid)
        data=list(data.values())
        return HttpResponse(json.dumps(data))
    except:
        return HttpResponse('error')

def delete(request):
    openid=request.GET.get('openid')
    classid=request.GET.get('classid')
    dateid=request.GET.get('dateid')
    try:
        models.Feedback.objects.filter(openid=openid,classid=classid,dateid=dateid).delete()
        return HttpResponse('success')
    except:
        return HttpResponse('error')
