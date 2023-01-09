from django.shortcuts import render
from django.http import HttpResponse
import requests
from allmysql import models
import json
import time
# Create your views here.

def getmail(request):
    if request.method == 'GET':
        openid = request.GET['openid']
        classid=request.GET['classid']
        lastTime=int(request.GET['lastTime'])
        canget=models.Userclass.objects.filter(openid=openid,classid=classid)
        bool(canget)
        if canget:
            try:
                with open('./maildata/'+classid+'mail.json', 'r') as f:
                    data = json.load(f)
                    try:
                        if lastTime==0:
                            data.append({'status':1})
                            return HttpResponse(json.dumps(data))
                        else:
                            newdata=[]
                            for i in range(len(data)):
                                if int(data[i]['time'])>lastTime:
                                    newdata.append(data[i])
                            newdata.append({'status':1})
                            return HttpResponse(json.dumps(newdata))
                    except:
                        data.append({'status':1})
                        return HttpResponse(json.dumps(data))
            except FileNotFoundError :
                data=open('./maildata/'+classid+'mail.json','w')
                data.write('[]')
                data.close()
                return HttpResponse('{"status":0,"msg":"获取失败"}')
        else:
            return HttpResponse('{"status":0,"msg":"你没有权限"}')

def sedmail(request):
    openid = request.GET['openid']
    classid=request.GET['classid']
    msg=request.GET['msg']
    cansed=models.Userclass.objects.filter(openid=openid,classid=classid)
    name=models.UserData.objects.filter(openid=openid).values('user_name')[0]['user_name']
    bool(cansed)
    if cansed:
        try:
            with open('./maildata/'+classid+'mail.json', 'r') as f:
                data = json.load(f)
                data.append({'name':name,'openid':openid,'msg':msg,'time':int(round(time.time() * 1000)),'set':0})
                with open('./maildata/'+classid+'mail.json', 'w') as f:
                    json.dump(data,f)
                return HttpResponse('{"status":1,"msg":"发送成功"}')
        except FileNotFoundError:
            data=open('./maildata/'+classid+'mail.json','w')
            data.write('[]')
            data.close()
            return HttpResponse('{"status":0,"msg":"发送失败"}')
    else:
        return HttpResponse('{"status":0,"msg":"你没有权限"}')
        
def getmsg(request):
    if request.method == 'GET':
        openid = request.GET['openid']
        classlist=models.Userclass.objects.filter(openid=openid).values('classid')
        lastTime=int(request.GET['lastTime'])
        returndata=[]
        for i in range(len(classlist)):
            try:
                with open('./maildata/'+classlist[i]['classid']+'msg.json', 'r') as f:
                    data = json.load(f)
                    try:
                        if lastTime==0:
                            returndata.append(data)
                        else:
                            newdata=[]
                            for i in range(len(data)):
                                if int(data[i]['time'])>lastTime:
                                    newdata.append(data[i])
                            
                            returndata.append(newdata)
                    except:
                        returndata.append(data)
            except FileNotFoundError :
                data=open('./maildata/'+classlist[i]['classid']+'msg.json','w')
                data.write('[]')
                data.close()
        data=[{'data':returndata,'code':1}]
        return HttpResponse(json.dumps(data))
        
