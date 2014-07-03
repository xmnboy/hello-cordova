/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*jshint -W079 */
/*global $:false, intel:false, app:false, dev:false */
/*global dev:false, performance:false */



var dev = dev || {} ;

// Use performance counter if it is available, otherwise, use milliseconds since 1970

if( window.performance && performance.now ) {
    dev.timeStamp = function() { return performance.now().toFixed(3) ; } ;
} else {
    dev.timeStart = Date.now() ;        // feeble zero point for relative time in ms
    dev.timeStamp = function() { return (Date.now() - dev.timeStart) ; } ;
}



// Used to keep track of time when each of these items was triggered.
// Might be useful as an indicator of the platform we're running on.
// Sorry for the weird names in the isDeviceReady structure, it's done for
// easier debugging and comparison of numbers when displayed in console.

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

// NOTE: Customize this function to initialize your app.
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

    // TODO: change this to initiate a custom event called AppReady
    // All device initialization is done, call the main app init function...
    app.initApplication() ;

    console.log(fName, dev.isDeviceReady) ;     // NOTE: tests debug console.log redirector object formatting
    console.log(fName, "exit") ;
} ;



/*
 * The following is an excerpt from the 2.9.0 cordova.js file and is useful for understanding
 * Cordova events. The order of events during page load and Cordova startup is as follows:
 *
 * onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
 * onNativeReady*              Internal event that indicates the Cordova native side is ready.
 * onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
 * onCordovaInfoReady*         Internal event fired when device properties are available.
 * onCordovaConnectionReady*   Internal event fired when the connection property has been set.
 * onDeviceReady*              User event fired to indicate that Cordova is ready
 * onResume                    User event fired to indicate a start/resume lifecycle event
 * onPause                     User event fired to indicate a pause lifecycle event
 * onDestroy*                  Internal event fired when app is being destroyed (User should use window.onunload event, not this one).
 *
 * The events marked with an * are sticky. Once they have fired, they will stay in the fired state.
 * Listeners that subscribe to a sticky (*) event, after the event is fired, will execute right away.
 *
 * The only Cordova events that user code should register for are:
 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
 *      pause                 App has moved to background
 *      resume                App has returned to foreground
 *
 * Listeners can be registered as follows:
 *      document.addEventListener("deviceready", myDeviceReadyListener, false);
 *      document.addEventListener("resume", myResumeListener, false);
 *      document.addEventListener("pause", myPauseListener, false);
 *
 * The following DOM lifecycle events should be used for saving and restoring state:
 *      window.onload
 *      window.onunload
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
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
} ;

// If this event is called first, we should be in the legacy XDK container.

dev.onDeviceReadyXDK = function() {
    dev.isDeviceReady.d_xdk_ready______ = dev.timeStamp() ;
    var fName = "dev.onDeviceReadyXDK():" ;
    console.log(fName, dev.isDeviceReady.d_xdk_ready______) ;
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
} ;

// This is a false onDeviceReady for browser scenario, mostly for code symmetry and fail-safe.

dev.onDeviceReadyBrowser = function() {
    dev.isDeviceReady.f_browser_ready__ = dev.timeStamp() ;
    var fName = "dev.onDeviceReadyBrowser():" ;
    console.log(fName, dev.isDeviceReady.f_browser_ready__) ;
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
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
    window.setTimeout(dev.onDeviceReadyBrowser, 7000) ;

    // last one, above, is fail-safe, in case we got no device ready event from Cordova or XDK
    // Cordova will timeout after five seconds, so we choose a longer timeout to be conservative
    // very end of this file is the fail-safe, fail-safe in case all else fails!

    // TODO: might want to double-check for Cordova deviceready, shouldn't be required...
    // "if" logic (below) needs further investigation in Cordova, legacy and debug containers
    // 0 = Non-sticky, 1 = Sticky non-fired, 2 = Sticky fired.
    // if( window.channel && channel.onCordovaReady && (channel.onCordovaReady.state === 2) )
        // dev.onDeviceReadyCordova() ;

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
// NOTE: Delay after "load" event is added because some webviews trigger prematurely.

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
window.addEventListener("load", window.setTimeout(dev.initDeviceReady,500), false) ;
window.setTimeout(dev.initDeviceReady,10000) ;  // fail-safe fail-safe, just in case we miss all events!
