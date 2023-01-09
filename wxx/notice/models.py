from django.db import models

# Create your models here.
class Notice(models.Model):
    data = models.CharField(max_length=255, blank=True, null=True)
    classid = models.CharField(max_length=255)
    openid = models.CharField(max_length=255)
    dateid = models.CharField(primary_key=True,max_length=255)

    class Meta:
        managed = False
        db_table = 'notice'
        unique_together = (('dateid', 'openid', 'classid'),)



