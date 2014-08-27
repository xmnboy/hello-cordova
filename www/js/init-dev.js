/*
 * Please see the included README.md file for license terms and conditions.
 */


/*
 * The functions in this file are designed to reliably detect various "ready" events
 * within a variety of containers (Intel XDK "legacy" container, Cordova 3.x container,
 * standard browser, App Preview, Crosswalk, etc.). It "unifies" the commonly used
 * ready events and is very helpful for moving a "web app" to a "hybrid app" scenario.
 *
 * This file has no dependencies. It will generate a custom "app.Ready" event
 * that you should use once to start your application, rather than waiting on a
 * "device ready" or "document ready" or "window load" or similar events.
 *
 * You should not have to modify anything in this file to use it. See the example
 * index.html file that accompanies this file (in its sample repo location) for
 * recommendations on the best placement of this file relative to other files and
 * for recommendations regarding the loading of other JavaScript files.
 *
 * There are a large number of console.log messages contained within this file.
 * They can be used to debug initialization problems and understand how it works.
 * It is highly recommended that you leave them in your app, they will not unduly
 * slow down or burden your application.
 *
 * There are many comments in this file and the accompanying index.html file.
 * Please read the comments within for details and further documentation.
 *
 * BTW: "dev" means "device" in this context, not "develop," because it grew out
 * of a desire to build a more reliable and flexible "device ready" detector.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, dev:false, performance:false */



window.dev = window.dev || {} ;         // there should only be one of these, but...

// Use performance counter if it is available, otherwise, use milliseconds since 1970

if( window.performance && performance.now ) {
    dev.timeStamp = function() { return performance.now().toFixed(3) ; } ;
}
else {
    dev.timeStart = Date.now() ;        // feeble zero ref for relative time in ms
    dev.timeStamp = function() { return (Date.now() - dev.timeStart) ; } ;
}



// Defines some delays constants used throughout for ready detections.
// Each should be smaller than the next; most cases should work as is.
// Lowering dev.BROWSER will speed up detection of browser scenario...
// ...at expense of possible false detects of browser environment...
// ...probably okay to go as low as 3000ms, depends on external libraries, etc.

dev.INSURANCE = 250 ;                   // ms, insurance on registering ready events detected
dev.WINDOW_LOAD = 500 ;                 // ms, for combating premature window load events
dev.BROWSER = 7000 ;                    // ms, detecting in a browser (probably best at >5 seconds)
dev.FAIL_SAFE = 10000 ;                 // ms, if all else fails, this saves our bacon :-)



// Used to keep track of time when each of these items was triggered.
// Sorry for the weird names in the isDeviceReady structure, it's done for
// easier debugging and comparison of numbers when displayed in console.log messages.

dev.isDeviceReady = {                   // listed in approximate order expected
    a_startTime______:dev.timeStamp(),  // when we started execution of this module
    b_fnDocumentReady:false,            // detected document.readyState == "complete"
    c_cordova_ready__:false,            // detected cordova device ready event
    d_xdk_ready______:false,            // detected xdk device ready event
    e_fnDeviceReady__:false,            // entered onDeviceReady()
    f_browser_ready__:false             // detected browser container
} ;



// Where the device ready event ultimately ends up, regardless of environment.
// Runs after underlying device native code and browser is initialized.
// Usually not much needed here, just additional "device init" code.
// See initDeviceReady() below for code that kicks off this function.
// This function works with Cordova and XDK webview or in a browser.

// NOTE: Customize this function, if necessary, for low-level init of your app.
// NOTE: In most cases, you can leave this code alone and use it as is.

dev.onDeviceReady = function() {
    var fName = "dev.onDeviceReady():" ;
    console.log(fName, "entry") ;

    // Useful for debug and understanding initialization flow.
    if( dev.isDeviceReady.e_fnDeviceReady__ ) {
        console.log(fName, "function terminated") ;
        return ;
    } else {
        dev.isDeviceReady.e_fnDeviceReady__ = dev.timeStamp() ;
    }

    // TODO: change this to use new custom events if I confirm it works in all webviews.
    // All device initialization is done; create and issue custom event named "app.Ready".
    // Using deprecated custom events until I can confirm new method works in all webviews...

    var evt = document.createEvent("Event") ;
    evt.initEvent("app.Ready", false, false) ;
    document.dispatchEvent(evt) ;

    console.log(fName, dev.isDeviceReady) ;
    console.log(fName, "exit") ;
} ;



/*
 * The following is an excerpt from the 3.3.0 cordova.js file and is useful for understanding
 * Cordova events. The order of events during page load and Cordova startup is as follows:
 *
 * onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
 * onNativeReady*              Internal event that indicates the Cordova native side is ready.
 * onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
 * onDeviceReady*              User event fired to indicate that Cordova is ready
 * onResume                    User event fired to indicate a start/resume lifecycle event
 * onPause                     User event fired to indicate a pause lifecycle event
 * onDestroy*                  Internal event fired when app is being destroyed (User should use window.onunload event, not this one).
 *
 * The events marked with an * are sticky. Once they have fired, they will stay in the fired state.
 * All listeners that subscribe after the event is fired will be executed right away.
 *
 * The only Cordova events that user code should register for are:
 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
 *      pause                 App has moved to background
 *      resume                App has returned to foreground
 *
 * Listeners can be registered as:
 *      document.addEventListener("deviceready", myDeviceReadyListener, false);
 *      document.addEventListener("resume", myResumeListener, false);
 *      document.addEventListener("pause", myPauseListener, false);
 *
 * The DOM lifecycle events should be used for saving and restoring state
 *      window.onload
 *      window.onunload
 *
 */

// The following is not fool-proof, we're mostly interested in detecting one
// or both events to insure device init is finished, detecting either will do.
// Even though the timing should indicate which container, it does not always work.

// NOTE: In most cases, you can leave these functions alone and use them as is.

// If this event is called first, we should be in the Cordova container.

dev.onDeviceReadyCordova = function() {
    dev.isDeviceReady.c_cordova_ready__ = dev.timeStamp() ;
    var fName = "dev.onDeviceReadyCordova():" ;
    console.log(fName, dev.isDeviceReady.c_cordova_ready__) ;
    window.setTimeout(dev.onDeviceReady, dev.INSURANCE) ;
} ;

// If this event is called first, we should be in the legacy XDK container.

dev.onDeviceReadyXDK = function() {
    dev.isDeviceReady.d_xdk_ready______ = dev.timeStamp() ;
    var fName = "dev.onDeviceReadyXDK():" ;
    console.log(fName, dev.isDeviceReady.d_xdk_ready______) ;
    window.setTimeout(dev.onDeviceReady, dev.INSURANCE) ;
} ;

// This is a faux onDeviceReady for browser scenario, mostly for code symmetry and fail-safe.

dev.onDeviceReadyBrowser = function() {
    dev.isDeviceReady.f_browser_ready__ = dev.timeStamp() ;
    var fName = "dev.onDeviceReadyBrowser():" ;
    console.log(fName, dev.isDeviceReady.f_browser_ready__) ;
    window.setTimeout(dev.onDeviceReady, dev.INSURANCE) ;
} ;



// Runs after document is loaded, and sets up wait for native (device) init to finish.
// If we're running in a browser we're ready to go when document is loaded, but...
// if we're running on a device we need to wait for native code to finish its init.

// NOTE: In most cases, you can leave this code alone and use it as is.

dev.initDeviceReady = function() {
    var fName = "dev.initDeviceReady():" ;
    console.log(fName, "entry") ;

    // Useful for debug and understanding initialization flow.
    if( dev.isDeviceReady.b_fnDocumentReady ) {
        console.log(fName, "function terminated") ;
        return ;
    } else {
        dev.isDeviceReady.b_fnDocumentReady = dev.timeStamp() ;
    }

    document.addEventListener("intel.xdk.device.ready", dev.onDeviceReadyXDK, false) ;
    document.addEventListener("deviceready", dev.onDeviceReadyCordova, false) ;
    window.setTimeout(dev.onDeviceReadyBrowser, dev.BROWSER) ;

    // Last one, above, is fail-safe, in case we got no device ready event from Cordova or XDK.
    // Cordova will timeout after five seconds, so we use a longer timeout to be conservative.
    // Very end of this file includes a "fail-safe, fail-safe" in case all else fails!

    // TODO: might want to double-check for Cordova deviceready, shouldn't be required...
    // "if" logic (below) needs further investigation in Cordova, legacy and debug containers
    // 0 = Non-sticky, 1 = Sticky non-fired, 2 = Sticky fired.
    // if( window.channel && channel.onCordovaReady && (channel.onCordovaReady.state === 2) )
    //     dev.onDeviceReadyCordova() ;

    console.log(fName, "navigator.vendor:", navigator.vendor) ;
    console.log(fName, "navigator.platform:", navigator.platform) ;
    console.log(fName, "navigator.userAgent:", navigator.userAgent) ;

    console.log(fName, "exit") ;
} ;



// Wait for document ready before looking for device ready.
// This insures the app does not start running until DOM is ready and...
// ...makes it easier to deal with both in-browser and on-device scenarios and...
// ...makes it easier to init device-dependent and device-independent code in one place.

// NOTE: In most cases, you can leave this code alone and use it as is.
// NOTE: document.readyState seems to be more reliable, but seems not to be omnipresent.
// NOTE: Delay after "load" event is added because some webviews appear to trigger prematurely.

if( document.readyState ) {                     // some devices don't support this, why???
    console.log("document.readyState:", document.readyState) ;
    document.onreadystatechange = function () {
        console.log("document.readyState:", document.readyState) ;
        if (document.readyState === "complete") {
            dev.initDeviceReady() ;             // call when document is "ready ready" :)
        }
    } ;
}
console.log("addEventListener:", dev.timeStamp()) ;
window.addEventListener("load", function(){window.setTimeout(dev.initDeviceReady,dev.WINDOW_LOAD);}.bind(dev), false) ;
window.setTimeout(dev.initDeviceReady, dev.FAIL_SAFE) ;     // fail-safe fail-safe, just in case we miss all events!
