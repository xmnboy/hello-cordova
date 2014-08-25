/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, app:false, dev:false */
/*global moment:false, performance:false, UAParser:false */
/*global initAccel:false, initCompass:false, initGeoLocate:false, updateDeviceInfo:false */
/*global btnBeep:false, btnBark:false, btnAccel:false, btnVibrate:false, btnCompass:false */
/*global btnBarkCordova:false, btnBarkXDK:false, btnBarkHTML5:false, btnGeoFine:false, btnGeoCoarse:false, btnGeo:false */



window.app = window.app || {} ;         // there should only be one of these, but...


app.uaParser = {} ;                     // for holding the user agent object


app.initEvents = function() {
    "use strict" ;
    var fName = "app.initEvents():" ;
    console.log(fName, "entry") ;

// Main app starting point (what dev.onDeviceReady calls after system is ready).
// Runs after underlying device native code and webview/browser is initialized.
// Where you should "kick off" your application by initializing app events, etc.

// NOTE: Customize this function to initialize your application.

    // initialize third-party libraries and event handlers

    app.uaParser = new UAParser() ;

    // initialize application code

    initAccel() ;
    initCompass() ;
    initGeoLocate() ;
    updateDeviceInfo() ;

    // Initialize app event handlers.
    // TODO: if( test for respective components before attaching event handlers )
    // TODO: configure to work with both touch and click events (mouse + touch)
    // See main.js, cordova-acc.js and cordova-geo.js for event handlers.

    var el, evt ;

    if( navigator.msPointerEnabled )                            // if on a Windows 8 machine
        evt = "click" ;                                         // let touch become a click event
    else                                                        // else, assume touch events available
        evt = "touchend" ;                                      // not optimum, but works

    el = document.getElementById("id_btnBeep") ;
    el.addEventListener(evt, btnBeep, false) ;
    el = document.getElementById("id_btnVibrate") ;
    el.addEventListener(evt, btnVibrate, false) ;
    el = document.getElementById("id_btnBarkCordova") ;
    el.addEventListener(evt, btnBarkCordova, false) ;
    el = document.getElementById("id_btnBarkXDK") ;
    el.addEventListener(evt, btnBarkXDK, false) ;
    el = document.getElementById("id_btnBarkHTML5") ;
    el.addEventListener(evt, btnBarkHTML5, false) ;

    el = document.getElementById("id_btnAccel") ;
    el.addEventListener(evt, btnAccel, false) ;
    el = document.getElementById("id_btnCompass") ;
    el.addEventListener(evt, btnCompass, false) ;

    el = document.getElementById("id_btnGeo") ;
    el.addEventListener(evt, btnGeo, false) ;
    el = document.getElementById("id_btnGeoFine") ;
    el.addEventListener(evt, btnGeoFine, false) ;
    el = document.getElementById("id_btnGeoCoarse") ;
    el.addEventListener(evt, btnGeoCoarse, false) ;

    // after init is all done is a good time to remove our splash screen

    app.hideSplashScreen() ;                // this is optional for your app

    // app initialization is done
    // app event handlers are ready
    // exit to idle state and just wait for events...

    console.log(fName, "exit") ;
} ;
document.addEventListener("app.Ready", app.initEvents, false) ;



// Primarily for debug and demonstration.
// Update our status in the main view. Are we running in a Cordova container or in a browser?

app.initDebug = function() {
    "use strict" ;
    var fName = "app.initDebug():" ;
    console.log(fName, "entry") ;

    // Following is for demonstration.
    // find the "system ready" indicator on our display

    var el = document.getElementById("id_cordova") ;
    var parentElement = document.getElementById("id_deviceReady") ;
    var listeningElement = parentElement.querySelector('.listening') ;
    var receivedElement = parentElement.querySelector('.received') ;
    var failedElement = parentElement.querySelector('.failed') ;

    // set the "system ready" indicator on our display
    if( window.Cordova && dev.isDeviceReady.c_cordova_ready__) {
        el.innerHTML = "Cordova device ready detected!" ;
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:block;') ;
        failedElement.setAttribute('style', 'display:none;') ;
    }
    else if( window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______ ) {
        el.innerHTML = "Intel XDK device ready detected!" ;
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:block;') ;
        failedElement.setAttribute('style', 'display:none;') ;
    }
    else {
        el.innerHTML = "Must be in a browser..." ;
        listeningElement.setAttribute('style', 'display:none;') ;
        receivedElement.setAttribute('style', 'display:none;') ;
        failedElement.setAttribute('style', 'display:block;') ;
    }

    console.log(fName, "exit") ;
} ;
document.addEventListener("app.Ready", app.initDebug, false) ;



// This may or may not be required, depends on your app and plugin configuration.
// This is also a simple study in the art of multi-platform device API detection.

app.hideSplashScreen = function() {
    var fName = "app.hideSplashScreen():" ;
    console.log(fName, "entry") ;

    if( navigator.splashscreen ) {                              // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    if( window.intel && intel.xdk && intel.xdk.device ) {       // Intel XDK API detected
        intel.xdk.device.hideSplashScreen() ;
    }

    console.log(fName, "exit") ;
} ;
