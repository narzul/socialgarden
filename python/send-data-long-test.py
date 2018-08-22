import socialgardenapi
import time
x = 0
while True:
    socialgardenapi.insertStream("myStream4", "myStream4 is used to stress test the system, by running continually for a long time.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    print("myStream4", "myStream4 is used to stress test the system, by running continually for a long time.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    time.sleep(2)
    if x > 50:
        x=0
