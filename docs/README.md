An Intel® XDK Debugging Tutorial
================================

As the [table on this page][1] illustrates, there are many ways to debug a
hybrid HTML5 app using the Intel XDK. In this article I’m going to go through
just two of these options:

[1]: <https://software.intel.com/en-us/xdk/docs/intel-xdk-debug-and-test-overview>

1.  using the **Emulate** tab

2.  using the **Debug** tab

Preparation
-----------

What you will need to follow this tutorial:

-   Android 4.0 (or higher) phone or tablet + USB cable

-   [Intel App Preview][2] installed on your Android device

-   Workstation running Linux, Windows 7+ or Mac OS X

-   The [Intel XDK][3] installed on your workstation

[2]: <https://play.google.com/store/apps/details?id=com.intel.html5tools.apppreview>
[3]: <http://xdk.intel.com>

Download and unzip a copy of this “hello-cordova” sample app onto your
workstation. Then, from the Intel XDK **Projects** tab (click *PROJECTS* in the
upper-left corner of the Intel XDK window), choose *Open an Intel XDK Project*
from the bottom of the list of projects. Navigate to the directory containing
the unzipped “hello-cordova” project and select the `hello-cordova.xdk` file
inside that directory.

The “hello-cordova” project should now be open in the Intel XDK. You can explore
the source code using the [Brackets code editor][4] that is built into the
**Develop** tab, or you can use your favorite source code editor to view the
files outside of the Intel XDK. Start with the `index.html` file, it is the
entry point into your application.

[4]: <https://github.com/adobe/brackets/wiki/How-to-Use-Brackets>

Using the Emulate Tab
---------------------

The “hello-cordova” application is ready to run. Switching to the **Emulate**
tab will start the app inside a simulated device. The **Emulate** tab does not
simulate real devices, it primarily does the following three things:

-   simulates popular [device viewports][5]

-   simulates [device userAgent strings][6]

-   simulates the [“core” Cordova APIs][7]

[5]: <http://www.quirksmode.org/mobile/viewports.html>
[6]: <http://www.useragentstring.com/>
[7]: <http://cordova.apache.org/docs/en/5.0.0/cordova_plugins_pluginapis.md.html#Plugin%20APIs>

See this doc page for more details about these limitations:
<https://software.intel.com/en-us/xdk/docs/intel-xdk-debug-and-test-overview#EmulateTab>.

What the **Emulate** tab does do, very well, is make it easy to test and debug
your basic application code (HTML, CSS and JavaScript). The fact that it
simulates the “core” Cordova APIs means that it is possible to debug much of
your device code without having to use a real device. You can do this quickly
and easily with the builtin [Chrome DevTools][8] console that is included with
the **Emulate** tab.

[8]: <https://developer.chrome.com/devtools>

Start the **Emulate** tab by selecting it from the tabs at the top of the Intel
XDK window. In its default configuration it will automatically refresh or
restart your app whenever it detects changes to your project source files (i.e.,
whenever one of your project source files are saved to disk). You can change
this behavior by selecting the Emulator settings icon on the toolbar (at the
upper left, next to the “bug” icon) and selecting “Do nothing” in the settings
dialog.

![](<emulate-settings.png>)

### Try the Accelerometer (Motion) Simulator

Using your mouse, touch the “Accelerometer” button in the application’s viewport
or simulated window. Make sure the **Accelerometer** panel to the left of the
simulated device is showing, as in the picture below.

![](<emulate-accelerometer.png>)

You can “grab” the small device in that panel with your mouse and move it up and
down or left and right. As you do this you are simulating tilting the device; as
if you were changing its physical orientation relative to the earth.

Notice that the numbers in the bottom of the **Accelerometer** pane (`xAxis`,
`yAxis`, etc.) change as you tilt the device and will also appear on the
simulated device screen. This is because the application is calling the Cordova
`navigator.accelerometer.*` functions that are part of the [Cordova
device-motion plugin][9] (which is included as part of the project by selecting
`Accelerometer` from the **Plugins** section of the **Projects** tab).

[9]: <https://github.com/apache/cordova-plugin-device-motion/>

If you want to inspect the accelerometer code, find the `cordova-acc.js` file
inside the “hello-cordova” project.

### Try the GeoLocation Simulator

For this step make sure you have selected one of the iOS devices (such as an
Apple iPhone) from the **Devices** panel on the left side of the **Emulate** tab
window. We are going to use an iOS device because its geolocation functions are
easier to use in this simulation. The Android geolocation functions behave in a
way that is more difficult to demonstrate.

Make sure the **GeoLocation** panel is showing to the right of the simulated
device. Now select the “GeoFine” button, you should see some numbers appear in
the geo fields on the display (you may have to scroll the device screen down to
see all of the geo fields). If that is successful, push the “GeoWatch” button.
Your simulated device screen should look something like the following:

![](<emulate-geo.png>)

While the “GeoWatch” function is active (signified by the green button), you can
grab the map inside the **GeoLocation** panel to the right of the simulated
device and move it around. As you do you will see the geo fields in the
simulated device screen update to reflect the new location on the map. Likewise,
as with the accelerometer exercise, the numbers below the map change to reflect
your location on the map. You can also type numbers directly into those fields
to effect the simulated geolocation.

If you want to inspect the code associated with the geolocation part of this
app, find the `cordova-geo.js` file in the “hello-cordova” application’s project
directory.

### Try the Compass Simulator

Push the “Compass” button to enable monitoring the compass feature of the
“hello-cordova” app in the simulated device. The “Compass” button will turn
green to indicate that the app is now watching the device’s compass data.

To effect the compass data returned by the Cordova Compass API, move the slider
labeled **Heading** below the geolocation map, in the right-side panel. As you
move the slider left and right you will see the yellow pointer in the center of
the **GeoLocation** map rotate to indicate the relative direction of the
compass, as specified by the **Heading** slider. Likewise, the compass field on
the device’s simulated display will update to reflect the returned compass data.

The code that is reading the compass data is located inside the `cordova-acc.js`
file in the “hello-cordova” project directory.

### Try to Debug some JavaScript, CSS and HTML

If you push the “Beep” button it will cause the simulated device to issue a
short audio alert. You might have to turn up the volume of your workstation to
hear the short beep. Notice that the button does not turn green, like the
“Compass” or “GeoWatch” buttons did. This is because the Cordova API that is
being used to issue this audio alert has no “watch” feature, it is a simple
call to a function that generates the audio alert.

This is an easy function to test out your JavaScript debugging skills. You’ll
find the function associated with that button inside the `main.js` file in the
“hello-cordova” project. The specific function you are looking for is called,
appropriately, `btnBeep()`. It is a very simple function, so there’s not much
debugging that can be done, but it will help you get started.

From the **Emulate** tab, push the “debug” icon in the toolbar (at the upper
left of the **Emulate** tab window, see the image above). Pushing the “debug”
icon will cause an instance of [Chrome DevTools][10] (CDT) to open on your
screen.

[10]: <https://developer.chrome.com/devtools>

![](<emulate-launch-cdt.png>)

See this image for an example of what a CDT window looks like:

![](<emulate-cdt.png>)

If you have selected the **Elements** tab in the CDT window, and move your mouse
over the HTML elements in the **Elements** panel, you will see the corresponding
rendered elements highlighted on the simulated device display, just as if you
were debugging a web page in Chrome and CDT. For example, similar to this image:

![](<emulate-plus-cdt.png>)

From here you can use CDT to monitor the many `console.log()` messages that have
been included in the “hello-cordova” application. You can also select a specific
HTML element and fine-tune the CSS associated with the application. Try a few
things to see what happens. Don’t worry about breaking the app, changes you
make in the CDT window are temporary and do not impact your actual source code
files, so you can always get back to where you started by simply restarting the
session with the “refresh” icon on the toolbar (the “refresh” icon is located to
the left of the “debug” icon).

In order to debug JavaScript you need to select the **Sources** tab of CDT and
find the source file of interest. In this case, we are going to set a breakpoint
on the `btnBeep()` function, which is located in the `main.js` file. Once we
locate that file in CDT we can set a breakpoint on the entry line of the
`btnBeep()` function by double-clicking that line in the source code display. A
breakpoints panel on the right side of the CDT window contains any breakpoints
that have been set in our test application.

See the image below for an example:

![](<emulate-set-breakpoint.png>)

Now push the “Beep” button on the simulated device. As soon as we enter the
`btnBeep()` function we will encounter our breakpoint. This pauses the
JavaScript execution, at the breakpoint.

This image shows the application just as we have encountered the JavaScript
breakpoint:

![](<emulate-hit-breakpoint.png>)

Notice the “Paused in debugger” alert at the top of the **Emulate** tab and the
highlighted line of JavaScript code, where our breakpoint was placed.

From here you can inspect variables by hovering over them in the source
panel (as shown below) and by using the JavaScript console.

![](<emulate-var-inspect.png>)

To control execution following a break use the panel to the right of the of the
source panel. The blue arrow (see image below) causes execution of the
application to resume. Pushing the curved arrow that is jumping over a dot (to
the right of the blue "resume" icon) causes your code to single-step. Try
single-stepping through the function.

![](<emulate-debug-controls.png>)

See the of [Chrome DevTools][11] pages on the Google Chrome developer site to
learn more about debugging with CDT.

[11]: <https://developer.chrome.com/devtools>

Using the Debug Tab
-------------------

For a quick overview of the **Debug** tab requirements and features, see this
article:
<https://software.intel.com/en-us/xdk/docs/intel-xdk-debug-and-test-overview#DebugTab>.
A more detailed explanation of the **Debug** tab can be found here:
<https://software.intel.com/en-us/xdk/docs/using-the-debug-tab>.

### Getting Started with the Debug Tab

Switch to the **Debug** tab to start debugging this same app on a real Android
device attached to your workstation via a USB cable. If your device is ready for
debugging the **Debug** tab will indicate that it can see a device in the upper
left of the **Debug** tab’s toolbar, at the upper left of the window.

![](<debug-device-present.png>)

If your device does not appear, as shown above, [follow the steps in this
article][12] to configure your device and workstation for Android USB debugging.

[12]: <https://software.intel.com/en-us/xdk/docs/configuring-your-windows-usb-android-debug-connection-for-the-intel-xdk>

### Running Your App on the Device

Once your device is recognized, you can load the “hello-cordova” application
onto it by pushing either the “debug” or “run” icon on the toolbar, just to the
right of the device selection pulldown. Pushing the “run” icon will load and run
your app on the attached device. Pushing the “debug” icon will load and run your
app and then start a copy of Chrome DevTools inside the **Debug** tab, similar
to what you saw when using the **Emulate** tab.

In order to run your app on the device a special version of App Preview must be
present on your Android device. The Intel XDK will prompt you about this
requirement and will automatically install that special version of App Preview
(aka App Preview Crosswalk or APX) onto your device, if it is not already
present, before it loads and starts your app.

### Debugging Your App on the Device

After the **Debug** tab has started running your app on your device, and the CDT
window is present, you can go through the same sequence of steps described in
the **Emulate** tab in the first part of this article. Unlike the **Emulate**
tab exercise, there are no simulation panels to effect the accelerometer,
compass or geolocation data. Instead, you must interact with the attached device
to see the data displayed by the app change. In other words, you must rotate and
move the device to see any results, because your app is now running on a real
device!

Note that not all devices are guaranteed to include the hardware necessary to
use all the features of this simple "hello-cordova" application. For example, it
is quite common to encounter devices that do not include compass or GPS hardware.
In that case the "Compass" button will not read any data and the precision of
the GPS data may be quite low or non-existent. The precise capabilities of
geolocation hardware in Android devices can vary widely. In addition, the
ability to read geolocation data on a real device can also be restricted by the
Android "Location" settings, or mode. For example, if a device includes GPS
hardware but that GPS hardware has been disabled in the Android settings, it may
result in no "fine" geolocation data being returned from the device, or the data
may be identical to the "coarse" geolocation data results.