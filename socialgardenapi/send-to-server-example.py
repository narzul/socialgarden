import socialgardenapi
import time
for x in range(0, 100):
    socialgardenapi.insertStream("testStream1", "Test stream 1. try run TEST-API.sh from the python folder",'[{"Name":"water","Value":'+str(x)+'}]')
    print("testStream1", "Test stream 1. try run TEST-API.sh from the python folder",'[{"Name":"water","Value":'+str(x)+'}]')
    time.sleep(2)
