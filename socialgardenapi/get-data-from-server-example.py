import socialgardenapi
print('Starting listener')

while True:
    print( socialgardenapi.getNewData("testStream1") )
