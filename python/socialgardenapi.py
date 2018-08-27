import requests
import time
import json
import datetime
import geocoder
import requests
import json
from requests.exceptions import ConnectionError


address = 'http://159.65.116.139:3000/devices/'
#address = 'http://localhost:3000/devices/'

#Check it stream exists in the database.
def streamExists(StreamName):
    if getAllData(StreamName) == []:
        print('Stream does not exists, try another')
        return False
    return True


def getAllData(StreamName):
    headers = {
        'Accept': 'application/json',
    }
    try:
        response = requests.get(address+StreamName.lower()+'', headers=headers)
        return response.json()
    except ConnectionError as e:    # This is the correct syntax
        print e
        response = "No response"

def getLastData(StreamName):
    headers = {
        'Accept': 'application/json',
    }
    try:
        response = requests.get(address+StreamName.lower()+'/one', headers=headers)
        return response.json()
    except ConnectionError as e:    # This is the correct syntax
        print e
        response = "No response"

def getNewData(StreamName):
    lastTimeStamp = 'null'
    while streamExists(StreamName):
        data = getLastData(StreamName)
        if lastTimeStamp == 'null':
            print('init watcher')
            lastTimeStamp = data['TimeStamp']
        elif lastTimeStamp != 'null' and lastTimeStamp != data['TimeStamp']:
            lastTimeStamp = data['TimeStamp']
            return data
        time.sleep(0.5)



def insertStream(StreamName,  Description, Sensor):
    headers = {
        'Content-Type': 'application/json',
    }
    g = geocoder.ip('me')
    lat = str(g.lat)
    lng = str(g.lng)
    try:
        data = '{"DeviceName": "'+StreamName.lower()+'","TimeStamp" :"'+str(datetime.datetime.utcnow())+'","Description":"'+Description+'","Location":{ "Latitude":'+lat+', "Longitude":'+lng+',"ManuallyCoords":false }, "Sensor" : '+Sensor+' } '
        response = requests.post(address, headers=headers, data=data)
    except ConnectionError as e:    # This is the correct syntax
        print e
        response = "No response"

def insertStreamManualCoordinates(StreamName, Description, Sensor, Lat,Lng):
    headers = {
        'Content-Type': 'application/json',
    }
    try:
        data = '{"DeviceName": "'+StreamName.lower()+'","TimeStamp" :"'+str(datetime.datetime.utcnow())+'","Description":"'+Description+'","Location":{ "Latitude":'+Lat+', "Longitude":'+Lng+',"ManuallyCoords":true}, "Sensor" : '+Sensor+' } '
        response = requests.post(address, headers=headers, data=data)
    except ConnectionError as e:    # This is the correct syntax
        print e
        response = "No response"

def deleteStream(StreamName):
    #response = requests.delete(address+StreamName)
    headers = {
        'Accept': 'application/json',
    }
    ## TODO - FIX delete, app gets stuck after deleting, perhaps change from get to actual delete or post (o.0)
    print('Deleting '+ StreamName)
    response = requests.get(address+StreamName.lower()+'/delete', headers=headers)
    print('Deleted '+ StreamName)

    return
