from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json


def addtask(request):
    taskid = request.GET['id']
    classid = request.GET['classid']
    obj = models.AllClass.objects.get(classid=classid)
    data = request.GET['task']
    try:
        models.Task.objects.create(taskid=taskid, classid=obj, data=data)
        return HttpResponse('success')
    except:
        return HttpResponse('error')

def getall(request):
    classid = request.GET['classid']
    # openid = request.GET['openid']
    # level = models.Userclass.objects.get(openid=openid, classid=classid).classlevel

    obj = models.AllClass.objects.get(classid=classid)
    data = models.Task.objects.filter(classid=obj)
    data = json.dumps(list(data.values()))
    return HttpResponse(data)


def onetask(request):
    classid=models.AllClass.objects.get(classid=request.GET['classid'])
    taskid=models.Task.objects.get(taskid=request.GET['taskid'],classid=classid)
    user = models.Userclass.objects.filter(classid=request.GET['classid'])
    alluser = []
    for i in user:
        if i.classlevel != '1':
            try:
                print(i.openid)
                lv=models.Onetask.objects.get(openid=i.openid, taskid=taskid).lv
            except:
                lv=-1
            alluser.append({
                'openid':i.openid,
                'name':models.UserData.objects.get(openid=i.openid).user_name,
                'lv':lv
            })
    data = json.dumps(alluser)
    print(data)
    return HttpResponse(data)

def onetasklook(request):
    classid=models.AllClass.objects.get(classid=request.GET['classid'])
    taskid=models.Task.objects.get(taskid=request.GET['taskid'],classid=classid)
    openid=request.GET['openid']
    try:
        answer=models.Onetask.objects.get(openid=openid, taskid=taskid,classid=classid).data
        lv=models.Onetask.objects.get(openid=openid, taskid=taskid,classid=classid).lv
        return HttpResponse(json.dumps({'data':answer,'lv':lv}))
    except:
        return HttpResponse('error')


def uplv(request):
    openid=request.GET['openid']
    classid=models.AllClass.objects.get(classid=request.GET['classid'])
    taskid=models.Task.objects.get(taskid=request.GET['taskid'],classid=classid)
    lv=request.GET['lv']
    try:
        models.Onetask.objects.filter(openid=openid, taskid=taskid,classid=classid).update(lv=lv)
        return HttpResponse('success')
    except:
        return HttpResponse('error')

def getquestion(request):
    classid=request.GET['classid']
    obj=models.AllClass.objects.get(classid=classid)
    taskid=request.GET['taskid']
    try:
        data=models.Task.objects.get( taskid=taskid,classid=obj).data
        return HttpResponse(data)
    except:
        return HttpResponse('error')

def sendanswer(request):
    classid=models.AllClass.objects.get(classid=request.GET['classid'])
    taskid=models.Task.objects.get(taskid=request.GET['taskid'],classid=classid)
    openid=request.GET['openid']
    answer=request.GET['answer']
    try:
        models.Onetask.objects.create(openid=openid, taskid=taskid,classid=classid,data=answer,lv=0)
    except :
        models.Onetask.objects.filter(openid=openid, taskid=taskid,classid=classid).update(data=answer)
    return HttpResponse('success')