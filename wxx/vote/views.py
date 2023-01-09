from turtle import title
from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json
import time


def addvote(request):
    data=request.GET['data']
    title=request.GET['title']
    ps=request.GET['ps']
    voteset=request.GET['set']
    voteid=int(round(time.time() * 1000))
    classid=request.GET['classid']
    obj=models.AllClass.objects.get(classid=classid)
    try:
        models.Vote.objects.create(data=data,title=title,ps=ps,set=voteset,voteid=voteid,classid=obj)
        return HttpResponse('success')
    except Exception as e:
        return HttpResponse('error')

def getall(request):
    classid=request.GET['classid']
    classid=models.AllClass.objects.get(classid=classid)
    allvote=models.Vote.objects.filter(classid=classid)
    data=[]
    for i in allvote:
        data.append({'title':i.title,'set':i.set,'voteid':i.voteid})
    return HttpResponse(json.dumps(data))

def getvote(request):
    voteid=request.GET['voteid']
    classid=request.GET['classid']
    obj=models.AllClass.objects.get(classid=classid)
    sqldata=models.Vote.objects.filter(classid=obj,voteid=voteid)
    return HttpResponse(json.dumps(list(sqldata.values())))

def setvote(request):
    voteid=request.GET['voteid']
    classid=request.GET['classid']
    try:
        models.Vote.objects.filter(classid=classid,voteid=voteid).update(set='已结束')
        return HttpResponse('success')
    except:
        return HttpResponse('error')

def vote(request):
    voteid=request.GET['voteid']
    classid=request.GET['classid']
    data=request.GET['data']
    openid=request.GET['openid']
    try:
        obj=models.AllClass.objects.get(classid=classid)
        sqldata=models.Vote.objects.get(classid=obj,voteid=voteid)
        if sqldata.set=='已结束':
            return HttpResponse('已结束')
        else:
            tpdata=json.loads(sqldata.data)
            if sqldata.ren==None:
                ren=openid
                for i in range(tpdata.__len__()):
                    if str(tpdata[i]['id']) in data:
                        tpdata[i]['getps']+=1
                tpdata=json.dumps(tpdata)
                models.Vote.objects.filter(classid=obj,voteid=voteid).update(data=tpdata,ren=ren)
            else:
                ren=sqldata.ren.split(',')
                if openid in ren:
                    return HttpResponse('已投票')
                else:
                    ren.append(openid)
                    for i in range(tpdata.__len__()):
                    
                        if str(tpdata[i]['id']) in data:
                            tpdata[i]['getps']+=1
                    tpdata=json.dumps(tpdata)
                    models.Vote.objects.filter(classid=obj,voteid=voteid).update(data=tpdata,ren=','.join(ren))
        return HttpResponse('ok')
    except Exception as e:
        return HttpResponse('error')

def delvote(request):
    voteid=request.GET['voteid']
    classid=request.GET['classid']
    try:
        models.Vote.objects.filter(classid=classid,voteid=voteid).delete()
        return HttpResponse('success')
    except:
        return HttpResponse('error')