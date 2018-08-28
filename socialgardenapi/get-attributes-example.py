import socialgardenapi
print('Starting listener')
while True:
    resp = socialgardenapi.getNewData("testStream1")
    print("TimeStamp: " + resp['TimeStamp'])
    print("DeviceName: " + resp['DeviceName'])
