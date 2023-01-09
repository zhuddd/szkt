from django.shortcuts import render
from django.http import HttpResponse ,Http404, FileResponse
import json
from allmysql import models
import time
import os
import hashlib
# Create your views here.


def uploadfile(request):
    try:
        classid=request.POST['classid']
        filename=request.POST['filename']
        size=request.POST['size']
        print(size)
        file = request.FILES.get('file')    # 获取文件对象，包括文件名文件大小和文件内容
        path='./allfile/'+file.name
        # 将文件写入本地
        f = open(path, 'wb')
        for line in file.chunks():     # 由于文件不是一次性上传的，因此一块一块的写入
            f.write(line)
        f.close()
        f = open(path, 'rb')
        data=f.read()
        f.close()
        data=hashlib.md5(data).hexdigest()
        os.rename(path,'./allfile/'+data)
        obj = models.AllClass.objects.get(classid=classid)
        models.File.objects.create(md5=data,classid=obj,filename=filename,time=int(round(time.time() * 1000)),size=size)
        return HttpResponse(data)
    except Exception:
        return Http404

def uploadmd5(request):
    classid=request.GET['classid']
    obj = models.AllClass.objects.get(classid=classid)
    filename=request.GET['filename']
    filelist=os.listdir('./allfile/')
    md5=request.GET['md5']
    for i in filelist:
        if i.startswith(md5):
            models.File.objects.create(md5=md5,filename=filename,classid=obj,time=int(round(time.time() * 1000)),size=os.path.getsize('./allfile/'+i))
            return HttpResponse(0)
    return HttpResponse(1)

def getfilelist(request):
    classid=request.GET['classid']
    obj = models.AllClass.objects.get(classid=classid)
    filelist=models.File.objects.filter(classid=obj)
    data=[]
    for i in filelist:
        data.append({'filename':i.filename,'md5':i.md5,'time':i.time,'size':i.size,'isdown':'0'})
    # 根据time排序
    data.sort(key=lambda x:x['time'],reverse=True)
    return HttpResponse(json.dumps(data))


def download(request):
    md5=request.GET['md5']
    try:
        response = FileResponse(open('./allfile/'+md5, 'rb'))
        return response
    except Exception:
        raise Http404

def deletefile(request):
    md5=request.GET['md5']
    classid=request.GET['classid']
    obj = models.AllClass.objects.get(classid=classid)
    time=request.GET['time']
    
    try:
        models.File.objects.filter(md5=md5,classid=obj,time=time).delete()
        return HttpResponse(1)
    except Exception:
        return HttpResponse(0)

def bigfile(request):
    md5=request.GET['md5']
    filename=request.GET['filename']
    try:
        response = FileResponse(open('./allfile/'+md5, 'rb'))
        response['content_type'] = "application/octet-stream"
        response['Content-Disposition'] = 'attachment;filename="{0}"'.format(filename).encode('utf-8', 'ISO-8859-1')
        return response
    except :
        raise Http404


from django.shortcuts import render
def updata(request):
    if request.method == "POST":
        file = request.FILES.get("file", None)
        try:
            classid=request.GET['classid']
        except:
            classid=None
        if file is None or classid is None:
            return render(request,'updata/updata.html')
        else:
            path='./allfile/tmp/'+file.name
            with open(path, 'wb') as  f:
                for chunk in file.chunks():
                    f.write(chunk)
            with open(path, 'rb') as f:
                data=f.read()
            data=hashlib.md5(data).hexdigest()
            filelist=os.listdir('./allfile/')
            if data in filelist:
                size=os.path.getsize('./allfile/'+data)
                name=file.name
                obj=models.AllClass.objects.get(classid=classid)
                models.File.objects.create(md5=data,filename=name,classid=obj,time=int(round(time.time() * 1000)),size=size)
                os.remove(path)
                return render(request,'updata/updata.html')
            else:
                size=os.path.getsize(path)
                name=file.name
                obj=models.AllClass.objects.get(classid=classid)
                models.File.objects.create(md5=data,filename=name,classid=obj,time=int(round(time.time() * 1000)),size=size)
                os.rename(path,'./allfile/'+data)
                return render(request,'updata/updata.html')
    else:
        return render(request,'updata/updata.html',{'classid':request.GET['classid']})

