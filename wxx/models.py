# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Ask(models.Model):
    asklist = models.TextField(blank=True, null=True)
    classid = models.OneToOneField('Class', models.DO_NOTHING, db_column='classid', primary_key=True)

    class Meta:
        managed = False
        db_table = 'ask'


class Attendclass(models.Model):
    classid = models.OneToOneField('Class', models.DO_NOTHING, db_column='classid', primary_key=True)
    page = models.CharField(max_length=255, blank=True, null=True)
    md5 = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'attendclass'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Class(models.Model):
    classid = models.CharField(primary_key=True, max_length=255)
    openid = models.ForeignKey('UserData', models.DO_NOTHING, db_column='openid')
    creator = models.CharField(max_length=255, blank=True, null=True)
    classname = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'class'
        unique_together = (('classid', 'openid'),)


class Classclass(models.Model):
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    classclassid = models.CharField(max_length=255)
    classclassname = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'classclass'
        unique_together = (('classid', 'classclassid'), ('classid', 'classclassid'),)


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Feedback(models.Model):
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    data = models.CharField(max_length=255, blank=True, null=True)
    dateid = models.CharField(max_length=255)
    openid = models.ForeignKey('UserData', models.DO_NOTHING, db_column='openid')

    class Meta:
        managed = False
        db_table = 'feedback'
        unique_together = (('classid', 'openid', 'dateid'), ('classid', 'openid', 'dateid'),)


class File(models.Model):
    filename = models.CharField(max_length=255)
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    md5 = models.CharField(max_length=255)
    time = models.CharField(max_length=255)
    size = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'file'
        unique_together = (('classid', 'md5', 'time'),)


class Myvote(models.Model):
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    vote = models.CharField(max_length=255, blank=True, null=True)
    voteid = models.ForeignKey('Vote', models.DO_NOTHING, db_column='voteid')

    class Meta:
        managed = False
        db_table = 'myvote'
        unique_together = (('classid', 'voteid'),)


class Notice(models.Model):
    data = models.CharField(max_length=255, blank=True, null=True)
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    openid = models.CharField(max_length=255)
    dateid = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'notice'
        unique_together = (('classid', 'dateid'), ('dateid', 'openid', 'classid'),)


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


class Signin(models.Model):
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    signid = models.CharField(max_length=255)
    signset = models.TextField(blank=True, null=True)
    member = models.TextField(blank=True, null=True)
    time = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'signin'
        unique_together = (('classid', 'signid'), ('classid', 'signid'),)


class Stutest(models.Model):
    testid = models.OneToOneField('Test', models.DO_NOTHING, db_column='testid', primary_key=True)
    openid = models.ForeignKey('Userclass', models.DO_NOTHING, db_column='openid')
    data = models.TextField(blank=True, null=True)
    cj = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stutest'
        unique_together = (('testid', 'openid'),)


class Task(models.Model):
    classid = models.ForeignKey(Class, models.DO_NOTHING, db_column='classid')
    taskid = models.CharField(primary_key=True, max_length=255)
    data = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'task'
        unique_together = (('taskid', 'classid'),)


class Test(models.Model):
    testid = models.CharField(max_length=255)
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    titel = models.CharField(max_length=255, blank=True, null=True)
    set = models.CharField(max_length=255, blank=True, null=True)
    data = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test'
        unique_together = (('classid', 'testid'),)


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
        managed = False
        db_table = 'user_data'


class Userclass(models.Model):
    classid = models.ForeignKey(Class, models.DO_NOTHING, db_column='classid')
    openid = models.OneToOneField(UserData, models.DO_NOTHING, db_column='openid', primary_key=True)
    classlevel = models.CharField(max_length=255, blank=True, null=True)
    classclassid = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'userclass'
        unique_together = (('openid', 'classid'), ('openid', 'classid', 'classclassid'),)


class Vote(models.Model):
    classid = models.OneToOneField(Class, models.DO_NOTHING, db_column='classid', primary_key=True)
    voteid = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    data = models.TextField(blank=True, null=True)
    ps = models.IntegerField(blank=True, null=True)
    set = models.CharField(max_length=255, blank=True, null=True)
    ren = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vote'
        unique_together = (('classid', 'voteid'), ('classid', 'voteid'),)


class Yqm(models.Model):
    classid = models.ForeignKey(Class, models.DO_NOTHING, db_column='classid', blank=True, null=True)
    yqm = models.CharField(primary_key=True, max_length=5)

    class Meta:
        managed = False
        db_table = 'yqm'
