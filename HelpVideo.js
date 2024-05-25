import xapi from 'xapi';
import {deskSeries} from './HelpVideoLibrary';
import {boardSeries} from './HelpVideoLibrary';
import {roomSeries} from './HelpVideoLibrary';

const deskSeriesUrls = deskSeries();
const boardSeriesUrls = boardSeries();
const roomSeriesUrls = roomSeries();

var deviceModel
var displayContent = "OSD"
const deskSeriesModels = ['Desk Pro', 'Desk', 'Desk Mini'];
const boardSeriesModels = ['Board Pro 55', 'Board Pro 75'];
const roomSeriesModels = ['Room Bar', 'Room Bar Pro'];

// Listen for button presses
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.WidgetId == 'helpWebex' && event.Type === 'pressed') {
    var title = "Help on Joining Webex"
    var url = getUrl("0");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }else if (event.WidgetId == 'helpTeams' && event.Type === 'pressed') {
    var title = "Help on Joining Microsoft Teams"
    var url = getUrl("1");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }else if (event.WidgetId == 'helpZoom' && event.Type === 'pressed') {
    var title = "Help on Joining Zoom"
    var url = getUrl("2");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }else if (event.WidgetId == 'helpGoogle' && event.Type === 'pressed') {
    var title = "Help on Joining Google Meet"
    var url = getUrl("3");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }else if (event.WidgetId == 'helpWired' && event.Type === 'pressed') {
    var title = "Help on Sharing via cable"
    var url = getUrl("4");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }else if (event.WidgetId == 'helpWireless' && event.Type === 'pressed') {
    var title = "Help on Sharing wirelessly"
    var url = getUrl("5");
    xapi.command("UserInterface WebView Display", {Target: displayContent, Title: title, Mode: 'Modal', Url: url});
  }
});

// Based on device model, return correct URL
function getUrl(item){
  if(deskSeriesModels.indexOf(deviceModel) !== -1) {
    const url = deskSeriesUrls[item];
    return url;
  }else if(boardSeriesModels.indexOf(deviceModel) !== -1) {
    const url = boardSeriesUrls[item];
    return url;
  }else if(roomSeriesModels.indexOf(deviceModel) !== -1) {
    const url = roomSeriesUrls[item];
    return url;
  }
}

// Check if Navigator attached to device (in which case, display content on Navigator)
async function checkIfNavigatorAttached(){
  const value = await xapi.Status.Peripherals.ConnectedDevice.get()
  
  for (var i = 0; i < value.length; i++){
    var obj = value[i];
    for (var key in obj){
      if (key == "Name"){
        if (obj[key] == "Cisco Room Navigator"){
          console.log("Found: " + obj[key])
          displayContent = "Controller"
        }else{
          displayContent = "OSD"
        }
      }
    }
  }
}

// Check what model this device is
async function checkDeviceModel(){
  deviceModel = await xapi.Status.SystemUnit.ProductPlatform.get();
  console.log("DeviceModel: " + deviceModel)
}

checkDeviceModel();
checkIfNavigatorAttached();
