### How to run your App
$ ionic serve

### How to run your App on Android Devices
$ ionic cordova run android --device
$ ionic cordova run android --device --livereload--address

### How to run your App on Android Devices Production Mode
$ ionic cordova run android --device --prod

### How to Production Builds
$ ionic cordova build android --prod --release

### Page
ionic g page myPage

### Provider
ionic g provider MyData

### Directive
ionic g directive <name>

### run-install-debug-android-applications-over-wi-fi
1. Connect the device via USB and make sure debugging is working.
2. adb tcpip 5555
3. find the IP address with 
   adb shell netcfg
4. adb connect <DEVICE_IP_ADDRESS>:5555
5. Disconnect USB and proceed with wireless debugging.
   adb -s <DEVICE_IP_ADDRESS>:5555 usb to switch back when done.
   
### Android Log
adb logcat -s "Name"

### Test Ping
ping -t <DEVICE_IP_ADDRESS>

### Ionic Cordova Reset
rm -rf plugins/ && rm -rf platforms/ && ionic cordova prepare


### Ionic Cordova Add Platform
ionic cordova platform add ios
ionic cordova platform add android
