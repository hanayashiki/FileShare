from django.shortcuts import render, render_to_response
from django.http import StreamingHttpResponse
from django.shortcuts import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os
import fsserver.preference as pf

import files.models as md
import files.utils as utils

# Create your views here.
@csrf_exempt
def upload_file(request):
    if request.method == "POST":
        myFile = request.FILES.get("myfile", None)
        address = os.path.join(pf.FILE_LOCATION, myFile.name)
        if not myFile:
            return HttpResponse("Could not get your file. ")
        try:
            destination = open(address, 'wb+')
        except:
            os.mkdir(pf.FILE_LOCATION)
            destination = open(address, 'wb+')

        token = request.POST.get("token", None)
        print("token: ", end='')
        print(token)
        if token:
            try:
                md.add_file_record(token, address)
            except:
                return HttpResponse("Adding file record failed. Your token might be too long. ")
            print("file recorded. ")
        else:
            return HttpResponse("Invalid token. ")

        for chunk in myFile.chunks():
            destination.write(chunk)
        destination.close()
        return HttpResponse("Success. ")
    return HttpResponse("Need a POST request. ")

@csrf_exempt
def upload_test(request):
    return render_to_response("upload.html")

@csrf_exempt
def download_file(request):
    if request.method == "GET":
        token = request.GET.get("token")
        if token:
            address = md.fetch_file_by_token(token)
            if address:
                if not os.path.exists(address):
                    return HttpResponse("Token is found, but the file might be swept away. ")
                file_stream = utils.file_iterator(address)
                response = StreamingHttpResponse(file_stream)
                response['Content-Type'] = 'application/octet-stream'
                response['Content-Disposition'] = 'attachment;filename="{0}"'.format(address)
            else:
                return HttpResponse("Token not found. ")
            return response
        else:
            return HttpResponse("Token not found. ")
    return HttpResponse("Need a GET request. ")

@csrf_exempt
def download_test(request):
    return render_to_response("download.html")