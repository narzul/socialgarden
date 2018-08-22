import socialgardenapi
print("Testing DeleteStream method")
socialgardenapi.insertStream("myStream4", "This stream will be deleted immediately",'[{"Name":"water","Value":'+str(x)+'},{"Name":"earth","Value":'+str(x+2)+'},{"Name":"juice","Value":'+str((x+10)/2)+'},{"Name":"mint","Value":'+str(5-x)+'}]')
print("Created myStream4")
socialgardenapi.deleteStream('myStream4');
print("Deleted myStream4")
