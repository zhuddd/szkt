from django.shortcuts import render
from django.http import HttpResponse, Http404, FileResponse
from attendclass import tests
import json
from allmysql import models
import time
import os
import hashlib
import ppt2gif
import pathlib2
import pythoncom


def updata(request):
    if request.method == "POST":
        file = request.FILES.get("file", None)
        try:
            classid = request.GET['classid']
        except:
            classid = None
        if file is None or classid is None:
            return render(request, 'updata/attendclass.html')
        else:
            path = './allfile/tmp/'+file.name
            with open(path, 'wb') as f:
                for chunk in file.chunks():
                    f.write(chunk)
                f.close()
            with open(path, 'rb') as f:
                md5 = hashlib.md5(f.read()).hexdigest()
                f.close()
            filelist=os.listdir('./allfile/attendclass/')
            print(filelist)
            if (md5) in filelist:
                pass
            else:
                os.rename(path, './allfile/attendclass/'+md5+'.pptx')
                pythoncom.CoInitialize()
                pptobj = ppt2gif.PPT(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'\\allfile\\attendclass\\'+md5+'.pptx')
                pptobj.convert2png()
                pptobj.close()
                pythoncom.CoUninitialize()
                os.remove('./allfile/attendclass/'+md5+'.pptx')
            obj=models.AllClass.objects.get(classid=classid)
            data=models.Attendclass.objects.filter(classid=obj).first()
            if data:
                models.Attendclass.objects.filter(classid=obj).update(md5=md5,page=None)
            else:
                models.Attendclass.objects.create(classid=obj,md5=md5,page=None)
            
            return render(request, 'updata/attendclass.html')
    else:
        return render(request, 'updata/attendclass.html', {'classid': request.GET['classid']})

def getpagelist(request):
    if request.method == "GET":
        try:
            classid = request.GET['classid']
        except:
            classid = None
        if classid is None:
            return HttpResponse('classid is None')
        else:
            obj=models.AllClass.objects.get(classid=classid)
            data=models.Attendclass.objects.filter(classid=obj).first()
            if data:
                md5=data.md5
                pagelist=os.listdir(u'./allfile/attendclass/'+md5)
                return HttpResponse(json.dumps(pagelist,ensure_ascii=False))
            else:
                return HttpResponse('not updata')
    else:
        return HttpResponse('not get')

def getpage(request):
    if request.method == "GET":
        try:
            classid = request.GET['classid']
        except:
            classid = None
        if classid is None:
            return HttpResponse('classid is None')
        else:
            obj=models.AllClass.objects.get(classid=classid)
            data=models.Attendclass.objects.filter(classid=obj).first()
            if data:
                md5=data.md5
                page=data.page
                data={'md5':md5,'page':str(page)}
                return HttpResponse(json.dumps(data))
            else:
                return HttpResponse('not updata')
    else:
        return HttpResponse('not get')

def setpage(request):
    if request.method == "GET":
        try:
            classid = request.GET['classid']
            page = request.GET['page']
        except:
            classid = None
        if classid is None :
            return HttpResponse('classid is None')
        else:
            obj=models.AllClass.objects.get(classid=classid)
            data=models.Attendclass.objects.filter(classid=obj).first()
            if data:
                models.Attendclass.objects.filter(classid=obj).update(page=page)
                return HttpResponse('ok')
            else:
                return HttpResponse('not updata')
    else:
        return HttpResponse('not get')