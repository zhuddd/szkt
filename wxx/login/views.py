from django.http import HttpResponse
import requests
from allmysql import models
import json


def login(request):
    if request.method == 'GET':
        s = request.GET['code']
        url = 'https://api.weixin.qq.com/sns/jscode2session' + "?appid=" + 'wxaecb9f07933e3462' + "&secret=" + '47ede2a978be64c7c47835ca1b53bd3c' + \
            "&js_code=" + s + "&grant_type=authorization_code"
        res = requests.get(url)
        try:
            openid = res.json()['openid']
        except KeyError:
            return HttpResponse('登录失败')
        else:
            try:
                user = models.UserData.objects.get(openid=openid)
            except models.UserData.DoesNotExist:
                user = models.UserData.objects.create(
                    openid=openid, older=False)
                user.save()
                data = {
                    'openid': openid,
                    'older': "False"
                }
                data = json.dumps(data)
                return HttpResponse(data)
            else:
                user = models.UserData.objects.filter(openid=openid).first()
                data = {
                    'older': user.older,
                    'openid': user.openid,
                    'userid': user.userid,
                    'user_name': user.user_name,
                    'sex': user.sex,
                    'school_1': user.school_1,
                    'school_2': user.school_2,
                    'teacher_name': user.teacher_name,
                    'teach': user.teach,
                }
                data = json.dumps(data)
                return HttpResponse(data)


def setdata(request):
    try:
        openid = request.GET['openid']
        models.UserData.objects.filter(openid=openid).update(
            user_name=request.GET['user_name'],
            userid=request.GET['userid'],
            sex=request.GET['sex'],
            school_1=request.GET['school_1'],
            school_2=request.GET['school_2'],
            teacher_name=request.GET['teacher_name'],
            teach=request.GET['teach'],
            is_teacher=request.GET['is_teacher'],
            older="True",
            level=1,
            exp=0,
            exp_2=100
        )
        user = models.UserData.objects.filter(openid=openid).first()
        data = {
            'older': user.older,
            'openid': user.openid
        }
        data = json.dumps(data)
        return HttpResponse(data)
    except ValueError:
        return HttpResponse('error')


def getdata(request):
    try:
        openid = request.GET['openid']
        user = models.UserData.objects.filter(openid=openid).first()
        data = {
            'openid': user.openid,
            'user_name': user.user_name,
            'phone': user.phone,
            'sex': user.sex,
            'userid': user.userid,
            'is_teacher': user.is_teacher,
            'school_1': user.school_1,
            'school_2': user.school_2,
            'teacher_name': user.teacher_name,
            'teach': user.teach,
            'level': user.level,
            'exp': user.exp,
            'coin': user.exp_2,
            'older': user.older
        }
        data = json.dumps(data)
        return HttpResponse(data)
    except:
        return HttpResponse('error')
