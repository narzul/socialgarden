import requests
import time
import json
import datetime
import geocoder
import requests
import json
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
    response = requests.get(address+StreamName.lower()+'', headers=headers)
    return response.json()

def getLastData(StreamName):
    headers = {
        'Accept': 'application/json',
    }
    response = requests.get(address+StreamName.lower()+'/one', headers=headers)
    return response.json()


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
    data = '{"DeviceName": "'+StreamName.lower()+'","TimeStamp" :"'+str(datetime.datetime.utcnow())+'","Description":"'+Description+'","Location":{ "Latitude":'+str(g.lat)+', "Longitude":'+str(g.lng)+' }, "Sensor" : '+Sensor+' } '
    response = requests.post(address, headers=headers, data=data)

def insertStreamManualCoordinates(StreamName, Description, Sensor, Lat,Lng):
    headers = {
        'Content-Type': 'application/json',
    }
    g = geocoder.ip('me')
    data = '{"DeviceName": "'+StreamName.lower()+'","TimeStamp" :"'+str(datetime.datetime.utcnow())+'","Description":"'+Description+'","Location":{ "Latitude":'+Lat+', "Longitude":'+Lng+' }, "Sensor" : '+Sensor+' } '
    response = requests.post(address, headers=headers, data=data)
    print("Data inserted into " + str(address))
    print(data)

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
