from turtle import title
from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json

def gettestlist(request):
    classid=request.GET.get('classid')
    memberdata=models.Userclass.objects.filter(classid=classid) 
    memberdata=list(memberdata.values())
    num=len(memberdata)
    obj=models.AllClass.objects.get(classid=classid)
    data=models.Test.objects.filter(classid=obj)
    data=list(data.values())
    returndata=[]
    for i in range(len(data)):
        stutest=models.Stutest.objects.filter(testid=data[i]['testid'])
        stutest=list(stutest.values())
        num2=len(stutest)
        returndata.append({
            'testid':data[i]['testid'],
            'titel':data[i]['titel'],
            'set':data[i]['set'],
            'num':str(num2)+'/'+str(num-1),
        })
    return HttpResponse(json.dumps(returndata))

def getone(request):
    classid=request.GET.get('classid')
    memberdata=models.Userclass.objects.filter(classid=classid) 
    memberdata=list(memberdata.values())

    testid=request.GET.get('testid')
    testdata=models.Stutest.objects.filter(testid=testid)
    testdata=list(testdata.values())
    returndata=[]
    for i in range(len(memberdata)):
        openid=memberdata[i]['openid']
        if memberdata[i]['classlevel']=='1':
            pass
        else:
            name=models.UserData.objects.get(openid=openid).user_name
            returndata.append({
                'openid':openid,
                'name':name,
                'cj':'',
            })
    for i in range(len(testdata)):
        for j in range(len(returndata)):
            if returndata[j]['openid']==testdata[i]['openid_id']:
                returndata[j]['cj']=testdata[i]['cj']
    return HttpResponse(json.dumps(returndata))

def addtest(request):
    testid=request.GET.get('testid')
    questionList=request.GET.get('questionList')
    set=request.GET.get('set')
    title=request.GET.get('title')
    classid=request.GET.get('classid')
    obj=models.AllClass.objects.get(classid=classid)
    models.Test.objects.create(
        testid=testid,
        data=questionList,
        set=set,
        titel=title,
        classid=obj,
    )
    return HttpResponse('success')

def gettest(request):
    testid=request.GET.get('testid')
    classid=request.GET.get('classid')
    openid=request.GET.get('openid')
    obj1=models.Userclass.objects.get(openid=openid)
    
    obj2=models.AllClass.objects.get(classid=classid)
    data=models.Test.objects.filter(testid=testid,classid=obj2)
    data=list(data.values())
    data.append(False)
    if(models.Stutest.objects.filter(testid_id=testid,openid=obj1)):
        data2=models.Stutest.objects.filter(testid_id=testid,openid=obj1)
        data2=list(data2.values())
        data[0]['cj']=data2[0]['cj']
        data[0]['data']=data2[0]['data']
        data[1]=True

    return HttpResponse(json.dumps(data))

def addcj(request):
    testid=request.GET.get('testid')
    openid=request.GET.get('openid')
    obj=models.Userclass.objects.get(openid=openid)
    cj=request.GET.get('cj')
    data=request.GET.get('data')
    models.Stutest.objects.create(
        testid_id=testid,
        openid=obj,
        cj=cj,
        data=data,
    )
    return HttpResponse('success')

def getcj(request):
    testid=request.GET.get('testid')
    openid=request.GET.get('openid')
    data=models.Stutest.objects.filter(testid_id=testid,openid=openid)
    data=list(data.values())
    return HttpResponse(json.dumps(data))

def endtest(request):
    testid=request.GET.get('testid')
    classid=request.GET.get('classid')
    obj=models.AllClass.objects.get(classid=classid)
    models.Test.objects.filter(testid=testid,classid=obj).update(set='2')
    return HttpResponse('success')

def deltest(request):
    testid=request.GET.get('testid')
    classid=request.GET.get('classid')
    obj=models.AllClass.objects.get(classid=classid)
    models.Test.objects.filter(testid=testid,classid=obj).delete()
    return HttpResponse('success')