from django.shortcuts import render
from django.http import HttpResponse
from allmysql import models
import json


def signin(request):
    if request.GET['set'] == 'creat':
        models.Signin.objects.create(
            classid=request.GET['classid'],
            signid=request.GET['signid'],
            signset=request.GET['signset'],
            time=request.GET['time'],
            member='')
        return HttpResponse('success')
    # 3
    elif request.GET['set'] == 'getall':
        singdata = models.Signin.objects.filter(classid=request.GET['classid'])
        data = []
        for i in singdata:
            data.append({
                'classid': i.classid,
                'signid': i.signid,
                'signset': i.signset,
                'time': i.time,
            })
        data = json.dumps(data)
        return HttpResponse(data)
    ###########################
    elif request.GET['set'] == 'get':
        signdata = models.Signin.objects.filter(
            classid=request.GET['classid'], signid=request.GET['signid'])
        member = []
        data=models.Userclass.objects.filter(classid=request.GET['classid'])
        allmember=[]
        for i in data:
            if i.classlevel!='1':
                allmember.append(i.openid)
        if signdata[0].member != '':
            openid = signdata[0].member.split(',')
            for i in allmember:
                name = models.UserData.objects.get(openid=i).user_name
                if i in openid:
                    member.append({
                        'openid': i,
                        'name': name,
                        'sign' : '1'
                    })
                else:
                    member.append({
                        'openid': i,
                        'name': name,
                        'sign' : '0'
                    })
            data = json.dumps(member)
            return HttpResponse(data)
        else:
            for i in allmember:
                name = models.UserData.objects.get(openid=i).user_name
                member.append({
                    'openid': i,
                    'name': name,
                    'sign' : '0'
                })
            data = json.dumps(member)
            return HttpResponse(data)
    ##############################
    elif request.GET['set'] == 'updata':
        data=models.Signin.objects.get(
            classid=request.GET['classid'], signid=request.GET['signid'])
        memberdata = data.member
        signinset=eval(data.signset)
        import time
        nowtime = int(round(time.time() * 1000))
        time=request.GET['time']
        if int(time)==1:
            if nowtime<=int(signinset['starttime']) or nowtime>=int(signinset['endtime']):
                return HttpResponse('timeerror')
        ok = 0
        for i in memberdata.split(','):
            if i == request.GET['member']:
                ok = 1
        if ok == 0:

            if memberdata == '':
                models.Signin.objects.filter(classid=request.GET['classid'], signid=request.GET['signid']).update(
                member=request.GET['member'])
            else:
                models.Signin.objects.filter(classid=request.GET['classid'], signid=request.GET['signid']).update(
                    member=memberdata+','+request.GET['member'])
            return HttpResponse('success')
        else:
            data = memberdata.split(',')
            data.remove(request.GET['member'])
            data = ','.join(data)
            models.Signin.objects.filter(
                classid=request.GET['classid'], signid=request.GET['signid']).update(member=data)
            return HttpResponse('success')
    ##############################
    elif request.GET['set'] == 'del':
        models.Signin.objects.filter(
            classid=request.GET['classid'], signid=request.GET['signid']).delete()
        return HttpResponse('success')
    ##############################
    elif request.GET['set'] == 'end':
        signdata = models.Signin.objects.filter(
            classid=request.GET['classid'], signid=request.GET['signid'])
        data = json.loads(signdata[0].signset)
        data['end'] = 1
        models.Signin.objects.filter(
            classid=request.GET['classid'], signid=request.GET['signid']).update(signset=json.dumps(data))
        return HttpResponse('success')

    else:
        return HttpResponse('error')
