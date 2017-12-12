from django.db import models


# Create your models here.
class File(models.Model):
    token = models.CharField(max_length=30)
    address = models.CharField(max_length=100)

    def __str__(self):
        return self.token


def add_file_record(token, addr):
    file = File(token=token, address=addr)
    file.full_clean()
    file.save()



def fetch_file_by_token(token):
    global File
    address_list = File.objects.filter(token=token)
    if len(address_list):
        return address_list[0].address
    else:
        return None
