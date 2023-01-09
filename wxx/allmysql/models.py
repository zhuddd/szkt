from django.db import models

from django.db import models


class AllClass(models.Model):
    classid = models.CharField(primary_key=True, max_length=255)
    openid = models.CharField(max_length=255, blank=True, null=True)
    creator = models.CharField(max_length=255, blank=True, null=True)
    classname = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'class'


class Classclass(models.Model):
    classid = models.CharField(primary_key=True, max_length=255)
    classclassid = models.CharField(max_length=255)
    classclassname = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'classclass'
        unique_together = (('classid', 'classclassid'),)




class Notice(models.Model):
    data = models.CharField(max_length=255, blank=True, null=True)
    classid = models.CharField(max_length=255)
    openid = models.CharField(max_length=255)
    dateid = models.CharField(primary_key=True, max_length=255)

    class Meta:
        managed = True
        db_table = 'notice'
        unique_together = (('dateid', 'openid', 'classid'),)


class UserData(models.Model):
    openid = models.CharField(primary_key=True, max_length=255)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    sex = models.CharField(max_length=255, blank=True, null=True)
    userid = models.IntegerField(blank=True, null=True)
    is_teacher = models.CharField(max_length=255, blank=True, null=True)
    school_1 = models.CharField(max_length=255, blank=True, null=True)
    school_2 = models.CharField(max_length=255, blank=True, null=True)
    teacher_name = models.CharField(max_length=255, blank=True, null=True)
    teach = models.CharField(max_length=255, blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    exp = models.IntegerField(blank=True, null=True)
    exp_2 = models.IntegerField(blank=True, null=True)
    older = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'user_data'


class Userclass(models.Model):
    classid = models.CharField(max_length=255)
    openid = models.CharField(primary_key=True, max_length=255)
    classlevel = models.CharField(max_length=255, blank=True, null=True)
    classclassid = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'userclass'
        unique_together = (('openid', 'classid', 'classclassid'),)


class Yqm(models.Model):
    classid = models.CharField(max_length=255, blank=True, null=True)
    yqm = models.CharField(primary_key=True, max_length=5)

    class Meta:
        managed = True
        db_table = 'yqm'

class Signin(models.Model):
    classid = models.CharField(primary_key=True, max_length=255)
    signid = models.CharField(max_length=255)
    signset = models.TextField(blank=True, null=True)
    member = models.TextField(blank=True, null=True)
    time = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'signin'
        unique_together = (('classid', 'signid'),)

class Feedback(models.Model):
    classid = models.ForeignKey(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    openid = models.ForeignKey('UserData', models.DO_NOTHING, db_column='openid')
    data = models.CharField(max_length=255, blank=True, null=True)
    dateid = models.CharField(max_length=255)

    class Meta:
        managed = True
        db_table = 'feedback'
        unique_together = (('classid', 'openid', 'dateid'),)

class Vote(models.Model):
    classid = models.ForeignKey(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    voteid = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    data = models.TextField(blank=True, null=True)
    ps = models.IntegerField(blank=True, null=True)
    set = models.CharField(max_length=255, blank=True, null=True)
    ren = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'vote'
        unique_together = (('classid', 'voteid'),)

class Myvote(models.Model):
    voteid = models.ForeignKey('Vote', models.DO_NOTHING, db_column='voteid')
    classid = models.ForeignKey(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    vote = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'myvote'
        unique_together = (('classid', 'voteid'),)

class Task(models.Model):
    classid = models.ForeignKey(AllClass, models.DO_NOTHING, db_column='classid')
    taskid = models.CharField(primary_key=True, max_length=255)
    data = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'task'
        unique_together = (('taskid', 'classid'),)

class Onetask(models.Model):
    classid = models.CharField(primary_key=True, max_length=255)
    data = models.TextField(blank=True, null=True)
    lv = models.CharField(max_length=255, blank=True, null=True)
    openid = models.CharField(max_length=255)
    taskid = models.ForeignKey('Task', models.DO_NOTHING, db_column='taskid')

    class Meta:
        managed = False
        db_table = 'onetask'
        unique_together = (('classid', 'taskid', 'openid'),)

class File(models.Model):
    filename = models.CharField(max_length=255)
    classid = models.ForeignKey(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    md5 = models.CharField(max_length=255)
    time = models.CharField(max_length=255)
    size = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'file'
        unique_together = (('classid', 'md5', 'time'),)

class Ask(models.Model):
    asklist = models.TextField(blank=True, null=True)
    classid = models.OneToOneField(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)

    class Meta:
        managed = False
        db_table = 'ask'

class Attendclass(models.Model):
    classid = models.OneToOneField(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    page = models.CharField(max_length=255, blank=True, null=True)
    md5 = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'attendclass'

class Test(models.Model):
    testid = models.CharField(max_length=255, blank=True, null=True)
    classid = models.OneToOneField(AllClass, models.DO_NOTHING, db_column='classid', primary_key=True)
    titel = models.CharField(max_length=255, blank=True, null=True)
    set = models.CharField(max_length=255, blank=True, null=True)
    data = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test'
        unique_together = (('classid', 'testid'),)

class Stutest(models.Model):
    testid = models.OneToOneField(Test, models.DO_NOTHING, db_column='testid', primary_key=True)
    openid = models.ForeignKey('Userclass', models.DO_NOTHING, db_column='openid')
    data = models.TextField(blank=True, null=True)
    cj = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stutest'
        unique_together = (('testid', 'openid'),)