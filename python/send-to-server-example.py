import socialgardenapi
import time
for x in range(0, 100):
    socialgardenapi.insertStream("myStream4", "Beskrivelse",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'},{"Name":"juice","Value":'+str(x+10)+'},{"Name":"mint","Value":'+str(10-x)+'}]')
    time.sleep(2)
    socialgardenapi.insertStream("myStream5", "Beskrivelse",'[{"Name":"dirt","Value":'+str(1+x)+'},{"Name":"sunlight","Value":'+str(8+x)+'}]')
    time.sleep(2)
    socialgardenapi.insertStreamManualCoordinates("myStream6", "Beskrivelse",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'}]','55','12')
    time.sleep(2)
