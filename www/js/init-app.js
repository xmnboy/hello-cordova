/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, device:false, cordova:false */
/*global app:false, dev:false, acc:false, geo:false */
/*global UAParser:false */



window.app = window.app || {} ;         // don't clobber existing app object
app.init = app.init || {} ;             // don't clobber existing app.init object


app.uaParser = {} ;                     // for holding the user agent object


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.
// Set to "true" if you want the console.log messages to appear.

app.init.LOG = true ;
app.init.consoleLog = function() {      // only emits console.log messages if app.init.LOG != false
    "use strict" ;
    if( app.init.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;



// App init point (runs on custom app.Ready event from init-dev.js).
// Runs after underlying device native code and webview/browser is ready.
// Where you should "kick off" your application by initializing app events, etc.

app.init.events = function() {
    "use strict" ;
    var fName = "app.init.events():" ;
    app.init.consoleLog(fName, "entry") ;

// Main app starting point (dev.onDeviceReady kicks off with "app.Ready" event).
// Runs after underlying device native code and webview/browser is initialized.
// Where you should "kick off" your application by initializing app events, etc.

    // NOTE: initialize third-party libraries and event handlers

    app.uaParser = new UAParser() ;
    app.init.consoleLog(fName, app.uaParser.getResult()) ;

    // NOTE: initialize your application code

    acc.initAccel() ;
    acc.initCompass() ;
    geo.initGeoLocate() ;
    app.updateDeviceInfo() ;

    // NOTE: initialize your app event handlers
    // See main.js, cordova-acc.js and cordova-geo.js for event handlers.

    // TODO: configure following to work with both touch and click events (mouse + touch)
    // see http://msopentech.com/blog/2013/09/16/add-pinch-pointer-events-apache-cordova-phonegap-app/

    var el, evt ;

    if( navigator.msPointerEnabled || !('ontouchend' in window))    // if on Win 8 machine or no touch
        evt = "click" ;                                             // let touch become a click event
    else                                                            // else, assume touch events available
        evt = "touchend" ;                                          // not optimum, but works

    el = document.getElementById("id_btnBeep") ;
    el.addEventListener(evt, app.btnBeep, false) ;
    el = document.getElementById("id_btnVibrate") ;
    el.addEventListener(evt, app.btnVibrate, false) ;
    el = document.getElementById("id_btnBarkCordova") ;
    el.addEventListener(evt, app.btnBarkCordova, false) ;
    el = document.getElementById("id_btnBarkXDK") ;
    el.addEventListener(evt, app.btnBarkXDK, false) ;
    el = document.getElementById("id_btnBarkHTML5") ;
    el.addEventListener(evt, app.btnBarkHTML5, false) ;

    el = document.getElementById("id_btnAccel") ;
    el.addEventListener(evt, acc.btnAccel, false) ;
    el = document.getElementById("id_btnCompass") ;
    el.addEventListener(evt, acc.btnCompass, false) ;

    el = document.getElementById("id_btnGeoFine") ;
    el.addEventListener(evt, geo.btnGeoFine, false) ;
    el = document.getElementById("id_btnGeoCoarse") ;
    el.addEventListener(evt, geo.btnGeoCoarse, false) ;
    el = document.getElementById("id_btnGeo") ;
    el.addEventListener(evt, geo.btnGeo, false) ;

    el = document.getElementById("id_btnGeoFineXDK") ;
    el.addEventListener(evt, geo.btnGeoFineXDK, false) ;
    el = document.getElementById("id_btnGeoCoarseXDK") ;
    el.addEventListener(evt, geo.btnGeoCoarseXDK, false) ;
    el = document.getElementById("id_btnGeoXDK") ;
    el.addEventListener(evt, geo.btnGeoXDK, false) ;

    // NOTE: ...you can put other miscellaneous init stuff in this function...
    // NOTE: ...and add whatever else you want to do now that the app has started...

    app.init.debug() ;              // just for debug, not required; keep it if you want it or get rid of it
    app.init.hideSplashScreen() ;   // after init is good time to remove splash screen; using a splash screen is optional

    // app initialization is done
    // app event handlers are ready
    // exit to idle state and just wait for events...

    app.init.consoleLog(fName, "exit") ;
} ;
document.addEventListener("app.Ready", app.init.events, false) ;



// Primarily for debug and demonstration.
// Update our status in the main view. Are we running in a Cordova container or in a browser?

app.init.debug = function() {
    "use strict" ;
    var fName = "app.init.debug():" ;
    app.init.consoleLog(fName, "entry") ;

    if( window.device && device.cordova ) {                             // old Cordova 2.x version detection
        app.init.consoleLog("device.cordova: "  + device.cordova) ;     // print the cordova version string...
        app.init.consoleLog("device.model: "    + device.model) ;       // on Cordova 3.0+ these require that
        app.init.consoleLog("device.platform: " + device.platform) ;    // the Cordova Device plugin is installed
        app.init.consoleLog("device.version: "  + device.version) ;     // if not, they will not exist
    }

    if( window.Cordova )                                                // Cordova webview detection test...
            app.init.consoleLog("window.Cordova typeof: " + typeof window.Cordova ) ;

// Most useful property (below) is cordova.platformId, which can help you determine the precise platform
// on which your Cordova app is running. As of June, 2015 the values you could encounter are:
// amazon-fireos, android, blackberry10, browser, firefoxos, ios, osx, ubuntu, webos, windows, windowsphone, windows8
// See cordova.platformId definition here: https://github.com/apache/cordova-js/blob/master/src/cordova.js
// Example "id" definition: https://github.com/apache/cordova-android/blob/master/cordova-js-src/platform.js
// To detect Crosswalk, detect "android" and look for the word "Crosswalk" in the navigator.userAgent string.

    if( window.cordova && cordova.version ) {                           // only present in Cordova 3.0+
        if( cordova.version )                                           // Cordova 3.0+ framework version string
            app.init.consoleLog("cordova.version: " + cordova.version) ;
        if( cordova.platformId )                                        // Cordova 3.1+ platform ID (see above)
            app.init.consoleLog("cordova.platformId: " + cordova.platformId) ;

        if( cordova.require ) {                                         // print included cordova plugins
            app.init.consoleLog(JSON.stringify(cordova.require('cordova/plugin_list').metadata, null, 1)) ;
        }
    }


// Following is for demonstration and debug.
// Update the "system ready" and "cordova present" indicators on our display.

    var el, text, node ;

    el = document.getElementById("id_windowCordova") ;
    text = "window.cordova is NOT present" ;
    if( window.cordova )
        text = "window.cordova IS present" ;
    if( el ) {
        node = document.createTextNode(text) ;
        el.replaceChild(node,el.childNodes[0]) ;
    }

    el = document.getElementById("id_cordova") ;
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

    app.init.consoleLog(fName, "exit") ;
} ;



// Using a splash screen is optional. This function will not fail if none is present.
// This is also a simple study in the art of multi-platform device API detection.

app.init.hideSplashScreen = function() {
    "use strict" ;
    var fName = "app.init.hideSplashScreen():" ;
    app.init.consoleLog(fName, "entry") ;

    // see https://github.com/01org/appframework/blob/master/documentation/detail/%24.ui.launch.md
    // Do the following if you disabled App Framework autolaunch (in index.html, for example)
    // $.ui.launch() ;

    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    if( window.intel && intel.xdk && intel.xdk.device ) {           // Intel XDK device API detected, but...
        if( intel.xdk.device.hideSplashScreen )                     // ...hideSplashScreen() is inside the base plugin
            intel.xdk.device.hideSplashScreen() ;
    }

    app.init.consoleLog(fName, "exit") ;
} ;
