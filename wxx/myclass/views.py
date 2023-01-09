from django.http import HttpResponse
import requests
from allmysql import models
import json
# Create your views here.
def getclasslist(request):
    classid=request.GET['classid']
    classclass=models.Classclass.objects.filter(classid=classid)
    classclassid=list(classclass.values('classclassid'))
    classclassname=list(classclass.values('classclassname'))
    classclassdata=[]
    for i in range(0,classclassid.__len__()):
        classclassdata.append({'class_class_id':classclassid[i]['classclassid'],'name':classclassname[i]['classclassname']})
    return HttpResponse(json.dumps(classclassdata))

def getmember(request):
    if request.GET['set']=='classclass':
        classclassid=request.GET['classclassid']
        member=models.Userclass.objects.filter(classclassid=classclassid)
        memberid=list(member.values('openid'))
        memberlevel=list(member.values('classlevel'))
        memberlist=[]
        for i in range(0,memberid.__len__()):
            membername=models.UserData.objects.filter(openid=memberid[i]['openid']).values('user_name')
            memberlist.append({'openid':memberid[i]['openid'],'name':membername.values()[0]['user_name'],'level':memberlevel[i]['classlevel']})
        return HttpResponse(json.dumps(memberlist))
    elif request.GET['set']=='class':
        classid=request.GET['classid']
        member=models.Userclass.objects.filter(classid=classid)
        member=list(member.values('openid','classlevel'))
        memberdata=[]
        for i in range(0,member.__len__()):
            membername=models.UserData.objects.filter(openid=member[i]['openid']).values('user_name')
            if member[i]['classlevel']!='1':
                memberdata.append({'openid':member[i]['openid'],'name':membername.values()[0]['user_name']})
        return HttpResponse(json.dumps(memberdata))


def updatamember(request):
    classclassid=request.GET['classclassid']
    openid=request.GET['openid']
    level=request.GET['level']
    models.Userclass.objects.filter(openid=openid,classclassid=classclassid).update(classlevel=level)
    return HttpResponse('success')

def delmember(request):
    classid=request.GET['classid']
    openid=request.GET['openid']
    models.Userclass.objects.filter(openid=openid,classid=classid).delete()
    return HttpResponse('success')

def classset(request):
    classid=request.GET['classid']
    getset=request.GET['set']
    if getset=='get':
        classname=models.AllClass.objects.filter(classid=classid).values('classname')
        return HttpResponse(classname.values()[0]['classname'])
    elif getset=='set':
        classname=request.GET['classname']
        models.AllClass.objects.filter(classid=classid).update(classname=classname)
        return HttpResponse('success')
    elif getset=='del':
        models.AllClass.objects.filter(classid=classid).delete()
        models.Classclass.objects.filter(classid=classid).delete()
        models.Userclass.objects.filter(classid=classid).delete()
        models.Yqm.objects.filter(classid=classid).delete()
        return HttpResponse('success')