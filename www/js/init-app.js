/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */



var init = init || {} ;
init.app = function() {
    "use strict" ;

// For demo and debug, potentially useful for device/feature detection.
var uaParser = new UAParser() ;


// Main app starting point (what initDeviceReady calls after system is ready).
// Runs after all underlying device native code and webview is initialized.
// Where you should "kick off" your application by initializing app events, etc.

// NOTE: Customize this function to initialize your application.

var initApplication = function() {
    "use strict" ;
    var fName = "initApplication():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    // initialize application code

    initAccel() ;
    initCompass() ;
    initGeoLocate() ;
    updateDeviceInfo() ;

    // initialize third-party libraries and event handlers

    // FastClick.attach(document.body) ;               // Fastclick setup

    showDeviceReady() ;                             // this is optional
    hideSplashScreen() ;                            // this is optional

    // Add app event handlers now.
    // TODO: if( test for respective components before attaching event handlers )
    // TODO: configure to work with both touch and click events (mouse + touch)

    var el ;
    el = document.getElementById("id_btnBeep") ;
    el.addEventListener("touchend", btnBeep, false) ;
    el = document.getElementById("id_btnVibrate") ;
    el.addEventListener("touchend", btnVibrate, false) ;
    el = document.getElementById("id_btnBark") ;
    el.addEventListener("touchend", btnBark, false) ;
    el = document.getElementById("id_btnAccel") ;
    el.addEventListener("touchend", btnAccel, false) ;
    el = document.getElementById("id_btnCompass") ;
    el.addEventListener("touchend", btnCompass, false) ;
    el = document.getElementById("id_btnGeo") ;
    el.addEventListener("touchend", btnGeo, false) ;


    // app initialization is done
    // event handlers are ready
    // exit to idle state and wait for events...

    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
} ;



// Primarily for debug and demonstration.
// Update our status in the main view.
// Are we running in a Cordova container or in a browser?

var showDeviceReady = function() {
    "use strict" ;
    var fName = "showDeviceReady():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    var el = document.getElementById("id_cordova") ;
    if( init.dev.isDeviceReady.cordova ) {
        el.innerHTML = "Cordova device ready detected!" ;
    }
    else if( init.dev.isDeviceReady.xdk ) {
        el.innerHTML = "Intel XDK device ready detected!" ;
    }
    else {
        el.innerHTML = "Must be in a browser..." ;
    }

    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
} ;


// This may or may not be required, depends on your app and plugin configuration.
// Simple study in the art of multi-platform webview API detection.

var hideSplashScreen = function() {
    "use strict" ;
    var fName = "hideSplashScreen():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    // Following is for demonstration.
    // find the "system ready" indicator on our display
    var parentElement = document.getElementById("id_deviceReady") ;
    var listeningElement = parentElement.querySelector('.listening') ;
    var receivedElement = parentElement.querySelector('.received') ;
    var failedElement = parentElement.querySelector('.failed') ;

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

    console.log(moment().format("HH:mm:ss.SSS"), fName, "exit") ;
} ;


var objPublic = {                               // module public interface
    uaParser: uaParser,                         // for demo and debug, works because it is an object, pass by reference
    initApplication: initApplication
} ;
return objPublic ;
}() ;
