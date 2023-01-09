from pydoc import classname
from time import sleep
from django.http import HttpResponse
from allmysql import models
import json


def add(request):
    classid = request.GET['class_id']
    classname=request.GET['name']
    creator=request.GET['creator']
    openid=request.GET['openid']
    yqm=request.GET['yqm']
    classclassdata=json.loads(request.GET['class_class_data'])
    models.AllClass.objects.create(classid=classid,classname=classname,creator=creator,openid=openid)
    models.Yqm.objects.create(classid=classid,yqm=yqm)
    models.Userclass.objects.create(classid=classid,openid=openid,classlevel='1',classclassid=classid)
    for i in range(0,classclassdata.__len__()):
        models.Classclass.objects.create(classid=classid,classclassid=classclassdata[i]['class_class_id'],classclassname=classclassdata[i]['name'])
    return HttpResponse('success') 

def find(request):
    yqm=request.GET['yqm']
    classdata=models.Yqm.objects.filter(yqm=yqm).first()
    try:
        classid=classdata.classid
    except AttributeError:
        return HttpResponse('error')
    else:
        
        try:
            models.Userclass.objects.get(classid=classid,openid=request.GET['openid'])
        except models.Userclass.DoesNotExist:
            creator=models.AllClass.objects.filter(classid=classid).first().creator
            classname=models.AllClass.objects.filter(classid=classid).first().classname
            classclassid=models.Classclass.objects.filter(classid=classid).values('classclassid')
            classclassid=list(classclassid)
            classclassname=models.Classclass.objects.filter(classid=classid).values('classclassname')
            classclassname=list(classclassname)
            classclassdata=[]
            for i in range(0,classclassid.__len__()):
                classclassdata.append({'class_class_id':classclassid[i]['classclassid'],'name':classclassname[i]['classclassname']})
            return HttpResponse(json.dumps({'classid':classid,'classname':classname,'creator':creator,'classclassdata':classclassdata}))
        else:
            return HttpResponse('error')

def join(request):
    classclassid=request.GET['classclassid']
    openid=request.GET['openid']
    classid=models.Classclass.objects.filter(classclassid=classclassid).first().classid
    try:
        models.Userclass.objects.create(classid=classid,openid=openid,classlevel='3',classclassid=classclassid)
    except:
        return HttpResponse('error')
    else:
        return HttpResponse('success')


def getkt(request):
    openid=request.GET['openid']
    classlist=models.Userclass.objects.filter(openid=openid)
    
    classlist=list(classlist)
    classdata=[]
    for i in range(0,classlist.__len__()):
        classname=models.AllClass.objects.filter(classid=classlist[i].classid).first().classname
        classclassname=models.Classclass.objects.filter(classid=classlist[i].classid)
        classclassname=list(classclassname)
        name=[]
        for j in range(0,classclassname.__len__()):
            name.append(classclassname[j].classclassname)
        classlevel=classlist[i].classlevel
        classdata.append({'classid':classlist[i].classid,'classname':classname,'classlevel':classlevel,'classclassname':name})
        
    return HttpResponse(json.dumps(classdata))

