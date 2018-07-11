import socialgardenapi
print('Starting listener')
while True:
    resp = socialgardenapi.getNewData("myStream4")
    print("TimeStamp: " + resp['TimeStamp'])
    print("StreamName: " + resp['DeviceName'])
