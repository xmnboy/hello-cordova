/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */



var init = init || {} ;
init.dev = function() {
    "use strict" ;

var isDeviceReady = { browser:false, cordova:false, xdk:false, fnDeviceReady:false } ;


// Where the device ready event ultimately ends up, regardless of environment.
// Runs after underlying device native code and browser is initialized.
// Usually not much needed here, just additional "device init" code.
// See initDeviceReady() below for code that kicks off this function.
// This function works with Cordova, XDK container or just a browser.

// NOTE: Customize this function to initialize your app.
// NOTE: In most cases, you can leave this code alone and use it as is.

var onDeviceReady = function() {
    "use strict" ;
    var fName = "onDeviceReady():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    // Useful for debug and understanding initialization flow.
    if( isDeviceReady.fnDeviceReady ) {
        console.log(moment().format("HH:mm:ss.SSS"), fName, "function terminated") ;
        return ;
    }
    else if( window.performance && performance.now ) {
        isDeviceReady.fnDeviceReady = performance.now() ;
    }
    else {
        isDeviceReady.fnDeviceReady = moment().valueOf() ;
    }

    // All device initialization is done, call the main app init function...
    init.app.initApplication() ;

    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
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

// NOTE: In most cases, you can leave these functions alone and use it as is.

// If this event is called first, we should be in the Cordova container.

var onDeviceReadyCordova = function() {
    if( window.performance && performance.now ) {
        isDeviceReady.cordova = performance.now() ;
    }
    else {
        isDeviceReady.cordova = moment().valueOf() ;
    }
    var fName = "onDeviceReadyCordova():" ;
    // console.log(moment().toISOString(), fName, isDeviceReady.cordova) ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, isDeviceReady.cordova) ;
    window.setTimeout(onDeviceReady, 250) ;     // a little insurance on the readiness
} ;

// If this event is called first, we should be in the legacy XDK container.

var onDeviceReadyXDK = function() {
    if( window.performance && performance.now ) {
        isDeviceReady.xdk = performance.now() ;
    }
    else {
        isDeviceReady.xdk = moment().valueOf() ;
    }
    var fName = "onDeviceReadyXDK():" ;
    // console.log(moment().toISOString(), fName, isDeviceReady.xdk) ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, isDeviceReady.xdk) ;
    window.setTimeout(onDeviceReady, 250) ;     // a little insurance on the readiness
} ;

// This is a bogus onDeviceReady for browser scenario, mostly for code symmetry.

var onDeviceReadyBrowser = function() {
    if( window.performance && performance.now ) {
        isDeviceReady.browser = performance.now() ;
    }
    else {
        isDeviceReady.browser = moment().valueOf() ;
    }
    var fName = "onDeviceReadyBrowser():" ;
    // console.log(moment().toISOString(), fName, isDeviceReady.browser) ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, isDeviceReady.browser) ;
    window.setTimeout(onDeviceReady, 250) ;     // a little insurance on the readiness
} ;



// Runs after document is loaded, and sets up wait for native init to finish.
// If we're running in a browser we're ready to go when document is loaded, but
// if we're running on a device we need to wait for native code to finish its init.

// NOTE: In most cases, you can leave this code alone and use it as is.

var initDeviceReady = function() {
    var fName = "initDeviceReady():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    document.addEventListener("intel.xdk.device.ready", onDeviceReadyXDK, false) ;
    document.addEventListener("deviceready", onDeviceReadyCordova, false) ;
    if( !window.intel && !window.Cordova ) {               // we might be "in a browser" or a webapp
        window.setTimeout(onDeviceReadyBrowser, 3000) ;    // give real device ready events a chance first, just in case
    }

    console.log(moment().format("HH:mm:ss.SSS"), fName, "navigator.vendor:", navigator.vendor) ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "navigator.platform:", navigator.platform) ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "navigator.userAgent:", navigator.userAgent) ;

    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
} ;


var objPublic = {                               // module public interface
    isDeviceReady: isDeviceReady,               // works because it is an object, passes by reference
    onDeviceReady: onDeviceReady,               // public for debug (run manually)
    initDeviceReady: initDeviceReady
} ;
return objPublic ;
}() ;



// Wait for document ready state before looking for device ready state.
// This insures the app does not start running until system is completely ready
// and makes it easier to deal with either in-browser or on-device scenarios.

// NOTE: In most cases, you can leave this code alone and use it as is.

if( document.onreadystatechange ) {                 // some older devices don't support this
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            init.dev.initDeviceReady() ;            // call when document is "ready ready" :)
        }
    } ;
} else {
    window.addEventListener("load", init.dev.initDeviceReady, false) ;
}
