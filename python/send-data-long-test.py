import socialgardenapi
import time
x = 1
while True:
    x += 1
    if x > 50:
        x=1
    socialgardenapi.insertStream("myStream4", "myStream4 is used to stress test the system, by running continually for a long time.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"air","Value":'+str(x/2)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    print("myStream4", "myStream4 is used to stress test the system, by running continually for a long time.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    #Sleep for 5 min
    time.sleep(300)
