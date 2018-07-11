import socialgardenapi
print('Starting listener')
while True:
    resp = socialgardenapi.getNewData("myStream3")
    print("TimeStamp: " + resp['TimeStamp'])
    print("StreamName: " + resp['DeviceName'])
