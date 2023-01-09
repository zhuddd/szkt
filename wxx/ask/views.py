from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json

def getlist(request):
    if request.method == 'GET':
        classid = request.GET.get('classid')
        obj=models.AllClass.objects.get(classid=classid)
        if obj:
            data = models.Ask.objects.filter(classid=obj).first()
            if data:
                asklist=data.asklist
                if(asklist):
                    asklist=asklist.split(',')
                    data=[]
                    for i in asklist:
                        try:
                            name=models.UserData.objects.get(openid=i)
                            data.append({'openid':i,'name':name.user_name})
                        except:
                            data.append({'openid':i,'name':'未知'})
                    return HttpResponse(json.dumps(data))
                else:
                    return HttpResponse('')
            else:
                return HttpResponse('error')
        else:
            return HttpResponse('error')
    else:
        return HttpResponse('error')

def add(request):
    if request.method == 'GET':
        classid = request.GET.get('classid')
        stuopenid= request.GET.get('stuopenid')
        obj=models.AllClass.objects.get(classid=classid)
        if obj:
            data = models.Ask.objects.filter(classid=obj).first()
            if data:
                asklist=data.asklist
                if(asklist):
                    newdata=stuopenid+','+asklist
                else:
                    newdata=stuopenid
                models.Ask.objects.filter(classid=obj).update(asklist=newdata)
                return HttpResponse('success')
            else:
                models.Ask.objects.create(classid=obj,asklist=stuopenid)
                return HttpResponse('success')
        else:
            return HttpResponse('error')
    else:
        return HttpResponse('error')

def delask(request):
    if request.method == 'GET':
        classid = request.GET.get('classid')
        obj=models.AllClass.objects.get(classid=classid)
        if obj:
            models.Ask.objects.filter(classid=obj).update(asklist='')
            return HttpResponse('success')
        else:
            return HttpResponse('error')
    else:
        return HttpResponse('error')