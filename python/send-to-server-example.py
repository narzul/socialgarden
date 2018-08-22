import socialgardenapi
import time
for x in range(0, 100):
    socialgardenapi.insertStream("myStream1", "This is the presentation layer for the socialgardenapi. Here the date collected can be visualized on a timeline. You can swich between datasets. But more importantly how do you use the api? look in mystream2 for more details.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    print("myStream1", "This is the presentation layer for the socialgardenapi. Here the date collected can be visualized on a timeline. You can swich between datasets. But more importantly how do you use the api? look in mystream2 for more details.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
    time.sleep(2)
    socialgardenapi.insertStream("myStream2", "Data can be send to the server via python or RESTapi Details on the API can be found via the socialgardenapi repository, link is in the bottom of the page",'[{"Name":"dirt","Value":'+str(1+x)+'},{"Name":"sunlight","Value":'+str(8+x)+'}]')
    print("myStream2", "Data can be send to the server via python or RESTapi Details on the API can be found via the socialgardenapi repository, link is in the bottom of the page",'[{"Name":"dirt","Value":'+str(1+x)+'},{"Name":"sunlight","Value":'+str(8+x)+'}]')
    time.sleep(1)
    socialgardenapi.insertStreamManualCoordinates("myStream3", "Change interval by modifying the selected date and times, or click the colored labels in the graph to hide / show data.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'}]','55','12')
    print("myStream3", "Change interval by modifying the selected date and times, or click the colored labels in the graph to hide / show data.",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x)+'}]','55','12')
    time.sleep(4)
