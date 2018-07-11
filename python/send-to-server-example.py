import socialgardenapi
import time
for x in range(0, 10):
    socialgardenapi.insertStreamManualCoordinates("myStream2", "Beskrivelse",'[{"Name":"dirt","Value":'+str(1+x)+'},{"Name":"sunlight","Value":'+str(2+x)+'}]','55','12')
    time.sleep(0.2)
    socialgardenapi.insertStreamManualCoordinates("myStream3", "Beskrivelse",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'}]','55','12')
    time.sleep(0.2)
