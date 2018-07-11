import socialgardenapi
print('Starting listener')

while True:
    print( socialgardenapi.getNewData("myStream4") )
