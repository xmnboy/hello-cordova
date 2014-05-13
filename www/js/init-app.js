/*
 * Copyright (c) 2013-2014, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */


// Main app starting point (where the DeviceReady begins after system ready).
// Runs after all underlying device native code and browser is initialized.
// Where you should "kick off" your DeviceReady by initializing app events.
// See initDeviceReady() below for code that kicks off this function.
// This function works with Cordova contain, XDK container or just browser.

// NOTE: You need to customize this function to initialize your app.
// TODO: Turn customization of onDeviceReady() into a closure+namespace.
// see: https://github.com/stevekwan/experiments/blob/master/javascript/module-pattern.html

function initApplication() {
    "use strict" ;
    var fName = "initApplication():" ;
    console.log(moment().format("HH:mm:ss.SSS"), fName, "entry") ;

    // initialize application code

    initAccel() ;
    initCompass() ;
    initGeoLocate() ;
    updateDeviceInfo() ;

    // initialize third-party libraries and event handlers here

//    FastClick.attach(document.body) ;               // Fastclick setup
    uaParser = new UAParser() ;                     // TODO: don't care for globals...


    // add app event handlers
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
}
