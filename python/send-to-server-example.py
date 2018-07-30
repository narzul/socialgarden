import socialgardenapi
import time
for x in range(0, 10):
    socialgardenapi.insertStream("myStream1", "Beskrivelse",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'},{"Name":"juice","Value":'+str(x+10)+'},{"Name":"mint","Value":'+str(10-x)+'}]')
    print("myStream1, Description: Beskrivelse [{Name:water,Value:"+str(1+x)+"},{Name:earth,Value:"+str(2+x)+"}]")
    time.sleep(0.2)
    socialgardenapi.insertStream("myStream2", "Beskrivelse",'[{"Name":"dirt","Value":'+str(1+x)+'},{"Name":"sunlight","Value":'+str(2+x)+'}]')
    print("myStream2, Description: Beskrivelse [{Name:dirt,Value:"+str(1+x)+"},{Name:sunlight,Value:"+str(2+x)+"}]")
    time.sleep(0.2)
    socialgardenapi.insertStreamManualCoordinates("myStream3", "Beskrivelse",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'}]','55','12')
    print("myStream3, Description: Beskrivelse [{Name:water,Value:"+str(1+x)+"},{Name:earth,Value:"+str(2+x)+"}]")
    time.sleep(0.2)
