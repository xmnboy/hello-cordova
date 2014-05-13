/*
 * Copyright (c) 2013-2014, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */

// TODO: get rid of this, don't care for globals...

var isDeviceReady = { browser:false, cordova:false, xdk:false, fnDeviceReady:false } ;


// Where the device ready event ultimately ends up, regardless of environment.
// Runs after underlying device native code and browser is initialized.
// Usually not much needed here, just additional "device init" code.
// See initDeviceReady() below for code that kicks off this function.
// This function works with Cordova, XDK container or just browser.

// NOTE: You need to customize this function to initialize your app.
// TODO: Turn customization of onDeviceReady() into a closure+namespace.
// NOTE: https://github.com/stevekwan/experiments/blob/master/javascript/module-pattern.html

function onDeviceReady() {
    "use strict" ;
    var fName = "onDeviceReady():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

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


    // Primarily for demonstrations.
    // Are we running in a Cordova container or in a browser?
    // update the status on the main screen
    var el = document.getElementById("id_cordova") ;
    if( isDeviceReady.cordova ) {
        el.innerHTML = "Cordova device ready detected!" ;
    }
    else if( isDeviceReady.xdk ) {
        el.innerHTML = "Intel XDK device ready detected!" ;
    }
    else {
        el.innerHTML = "Must be in a browser..." ;
    }


    // for demo only
    // find the "system ready" indicator on our display
    var parentElement = document.getElementById("id_deviceReady") ;
    var listeningElement = parentElement.querySelector('.listening') ;
    var receivedElement = parentElement.querySelector('.received') ;
    var failedElement = parentElement.querySelector('.failed') ;


    // keep this, unless you want to remove splash screen elsewhere
    // perform platform API-specific init functions
    if( window.Cordova && navigator.splashscreen ) {            // Cordova API detected
        navigator.splashscreen.hide() ;
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:block;') ;
        failedElement.setAttribute('style', 'display:none;') ;
    }
    else if( window.intel && intel.xdk && intel.xdk.device ) {  // Intel XDK API detected
        intel.xdk.device.hideSplashScreen() ;
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:block;') ;
        failedElement.setAttribute('style', 'display:none;') ;
    }
    else {                                                      // must be in a browser
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:none;') ;
        failedElement.setAttribute('style', 'display:block;') ;
    }


    // keep this, finish your app initialization in the other init file...
    // all device initialization is done, call the master app init function...
    initApplication() ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
}



/*
 * The following is an excerpt from the 2.9.0 cordova.js file and may be useful for understanding
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

// if this event is called first, we must be in the Cordova container

function onDeviceReadyCordova() {
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
}

// if this event is called first, we must be in the legacy XDK container

function onDeviceReadyXDK() {
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
}

// this is a bogus onDeviceReady for browser scenario, for code symmetry

function onDeviceReadyBrowser() {
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
}



// runs after document is loaded, and sets up wait for native code init to finish
// if we're running in a browser we're ready to go when document is loaded, but
// if we're running on a device we need to wait for native code to finish init

// NOTE: In most cases, you can leave this code alone and just use it as is.

function initDeviceReady() {
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
}



// wait for document ready state before looking for device ready state
// this insures app does not start running until system is completely ready
// and makes it easier to deal with in-browser versus on-device scenarios

// NOTE: In most cases, you can leave this code alone and use it as is.

if( document.onreadystatechange ) {                 // some older devices don't support this
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            initDeviceReady() ;                     // call when document is "ready ready" :)
        }
    } ;
} else {
    window.addEventListener("load", initDeviceReady, false) ;
}
