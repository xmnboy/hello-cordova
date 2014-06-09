/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, app:false */
/*global moment:false, performance:false */



var dev = dev || {} ;



// Used to keep track of time when each of these items was triggered.
// Might be useful as an indicator of the platform we're running on.
// Sorry for the weird names in the isDeviceReady structure, it's done for
// easier debugging and comparison of numbers when displayed in console.
var x = Date.now() ;
if( window.performance && performance.now ) {
    x = performance.now() ;
}
dev.isDeviceReady = {           // listed in approximate order expected
    a_startTime______:x,        // when we entered this module
    b_fnDocumentReady:false,    // detected document.readyState == "complete"
    c_cordova________:false,    // detected cordova device ready event
    d_xdk____________:false,    // detected xdk device ready event
    e_fnDeviceReady__:false,    // entered onDeviceReady()
    f_browser________:false     // detected browser container
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
    }
    else if( window.performance && performance.now ) {
        dev.isDeviceReady.e_fnDeviceReady__ = performance.now() ;
    }
    else {
        dev.isDeviceReady.e_fnDeviceReady__ = Date.now() ;
    }

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
    if( window.performance && performance.now ) {
        dev.isDeviceReady.c_cordova________ = performance.now() ;
    }
    else {
        dev.isDeviceReady.c_cordova________ = Date.now() ;
    }
    var fName = "dev.onDeviceReadyCordova():" ;
    console.log(fName, dev.isDeviceReady.c_cordova________) ;
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
} ;

// If this event is called first, we should be in the legacy XDK container.

dev.onDeviceReadyXDK = function() {
    if( window.performance && performance.now ) {
        dev.isDeviceReady.d_xdk____________ = performance.now() ;
    }
    else {
        dev.isDeviceReady.d_xdk____________ = Date.now() ;
    }
    var fName = "dev.onDeviceReadyXDK():" ;
    console.log(fName, dev.isDeviceReady.d_xdk____________) ;
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
} ;

// This is a bogus onDeviceReady for browser scenario, mostly for code symmetry.

dev.onDeviceReadyBrowser = function() {
    if( window.performance && performance.now ) {
        dev.isDeviceReady.f_browser________ = performance.now() ;
    }
    else {
        dev.isDeviceReady.f_browser________ = Date.now() ;
    }
    var fName = "dev.onDeviceReadyBrowser():" ;
    console.log(fName, dev.isDeviceReady.f_browser________) ;
    window.setTimeout(dev.onDeviceReady, 250) ; // a little insurance on the readiness
} ;



// Runs after document is loaded, and sets up wait for native init to finish.
// If we're running in a browser we're ready to go when document is loaded, but
// if we're running on a device we need to wait for native code to finish its init.

// NOTE: In most cases, you can leave this code alone and use it as is.

dev.initDeviceReady = function() {
    var fName = "dev.initDeviceReady():" ;
    console.log(fName, "entry") ;

    // Useful for debug and understanding initialization flow.
    if( dev.isDeviceReady.b_fnDocumentReady ) {
        console.log(fName, "function terminated") ;
        return ;
    }
    else if( window.performance && performance.now ) {
        dev.isDeviceReady.b_fnDocumentReady = performance.now() ;
    }
    else {
        dev.isDeviceReady.b_fnDocumentReady = Date.now() ;
    }

    document.addEventListener("intel.xdk.device.ready", dev.onDeviceReadyXDK, false) ;
    document.addEventListener("deviceready", dev.onDeviceReadyCordova, false) ;
    window.setTimeout(function() {
        if( !window.intel && !window.Cordova )                  // we might be "in a browser" or a webapp
            window.setTimeout(dev.onDeviceReadyBrowser, 250) ;  // this delay is superfluous, but doesn't hurt
        },
        3000                                    // give real device ready events a chance first, just in case
    ) ;

    console.log(fName, "navigator.vendor:", navigator.vendor) ;
    console.log(fName, "navigator.platform:", navigator.platform) ;
    console.log(fName, "navigator.userAgent:", navigator.userAgent) ;

    console.log(fName, "exit") ;
} ;



// Wait for document ready state before looking for device ready state.
// This insures the app does not start running until DOM is completely ready
// and makes it easier to deal with both in-browser and on-device scenarios.

// NOTE: In most cases, you can leave this code alone and use it as is.
// NOTE: document.readyState seems to be more reliable, but is not omnipresent.
// NOTE: Delay after "load" event is added because some webviews trigger prematurely.

if( document.readyState ) {                     // some devices don't support this
    console.log("document.readyState:", document.readyState) ;
    document.onreadystatechange = function () {
        console.log("document.readyState:", document.readyState) ;
        if (document.readyState === "complete") {
            dev.initDeviceReady() ;             // call when document is "ready ready" :)
        }
    } ;
}
console.log("addEventListener:", Date.now()) ;
window.addEventListener("load", window.setTimeout(dev.initDeviceReady,500), false) ;
