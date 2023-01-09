
from django.shortcuts import render
import time
import requests
from django.http import HttpResponse
from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
from allmysql import models
import json


class msgconsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def receive(self, text_data):
        text = text_data
        try:
            a = json.loads(text)

            if a['type'] == 'msg':
                classid = a['classid']
                msg = a['msg']
                sedmsg(classid, msg)
                async_to_sync(self.channel_layer.group_send)(classid,
                                                                {"type": "chat.message", "message": '{"classid":"'+classid+'","data":"'+msg+'"}'}
                                                                )

            elif a['type'] == 'setclass':
                openid = str(a['openid'])
                classlist = models.Userclass.objects.filter(
                    openid=openid).values('classid')
                for i in range(len(classlist)):
                    async_to_sync(self.channel_layer.group_add)(
                        str(classlist[i]['classid']), self.channel_name)
                self.send('{"type":"setclass","msg":"ok"}')

            elif a['type'] == 'closeclass':
                classid = str(a['classid'])
                async_to_sync(self.channel_layer.group_discard)(
                    classid, self.channel_name)

        except Exception as e:
            print(e)
            print('error')
            self.send(text)

    def chat_message(self, event):
        self.send(event['message'])

    def disconnect(self, code):
        raise StopConsumer

def sedmsg(classid, msg):
    whitelist=['notice','sign','ask','vote']
    classname=str(models.AllClass.objects.filter(classid=classid).values('classname').first()['classname'])
    if msg in whitelist:
        
        try:
            with open('./maildata/'+classid+'msg.json', 'r') as f:
                data = json.load(f)
                data.append({'classid': classid,'classname':classname, 'msg': msg, 'time': int(
                    round(time.time() * 1000))})
                with open('./maildata/'+classid+'msg.json', 'w') as f:
                    json.dump(data, f)
        except FileNotFoundError:
            data = open('./maildata/'+classid+'msg.json', 'w')
            data.write('[]')
            data.close()
            with open('./maildata/'+classid+'msg.json', 'r') as f:
                data = json.load(f)
                data.append({'classid': classid,'classname':classname, 'msg': msg, 'time': int(
                    round(time.time() * 1000))})
                with open('./maildata/'+classid+'msg.json', 'w') as f:
                    json.dump(data, f)
