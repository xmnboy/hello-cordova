/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, Media:false, moment:false */
/*global app:false, getWebPath:false, getWebRoot:false */


window.app = window.app || {} ;         // don't clobber existing app object


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.
// Set to "true" if you want the console.log messages to appear.

app.LOG = true ;
app.consoleLog = function() {           // only emits console.log messages if app.LOG != false
    "use strict" ;
    if( app.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;



app.btnBeep = function() {
    "use strict" ;
    var fName = "app.btnBeep():" ;
    app.consoleLog(fName, "entry") ;

    try {
        navigator.notification.beep(1) ;
        app.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        app.consoleLog(fName, "try failed", e) ;
    }

    app.consoleLog(fName, "exit") ;
} ;



app.btnVibrate = function() {
    "use strict" ;
    var fName = "app.btnVibrate():" ;
    app.consoleLog(fName, "entry") ;

    try {
        navigator.notification.vibrate(250) ;
        app.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        app.consoleLog(fName, "try failed:", e) ;
    }

    app.consoleLog(fName, "exit") ;
} ;



app.btnBarkCordova = function() {
    "use strict" ;
    var fName = "app.btnBarkCordova():" ;
    app.consoleLog(fName, "entry") ;

    try {
        var w = window.device && window.device.platform ;
        var x = navigator.userAgent ;
        var y = getWebPath() ;
        var z = getWebRoot() ;
        app.consoleLog(fName, "platform = ", w) ;
        app.consoleLog(fName, "userAgent = ", x) ;
        app.consoleLog(fName, "getWebPath() => ", y) ;
        app.consoleLog(fName, "getWebRoot() => ", z) ;

        var media = "audio/bark.wav" ;
//        if( z.match(/\/emulator.*\/ripple\/userapp/i) ) {           // if in the Emulate tab
        if( window.tinyHippos ) {                                   // if in the Emulate tab
            media = z + "/" + media ;
        }
        else if( x.match(/(ios)|(iphone)|(ipod)|(ipad)/ig) ) {      // if on a real iOS device
            media = "/" + media ;
        }
        else {                                                      // everything else...
            media = z + "/" + media ;
        }

        media = new Media(media, mediaSuccess, mediaError, mediaStatus) ;
        app.consoleLog(fName, "media.src = ", media.src) ;
        media.play() ;
        app.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        app.consoleLog(fName, "try failed:", e) ;
    }

// private functions for our media object

    function mediaSuccess() {
        media.stop() ;
        media.release() ;
        app.consoleLog(fName, "mediaSuccess") ;
    }
    function mediaError(err) {
        media.stop() ;
        media.release() ;
        app.consoleLog(fName, "mediaError:err.code: " + err.code + " ; " + "mediaError:err.message: " + err.message) ;
    }
    function mediaStatus(status) {
        var msg = "undefined" ;
        switch(status) {
            case 0:     msg = "MEDIA_NONE" ;        break ;
            case 1:     msg = "MEDIA_STARTING" ;    break ;
            case 2:     msg = "MEDIA_RUNNING" ;     break ;
            case 3:     msg = "MEDIA_PAUSED" ;      break ;
            case 4:     msg = "MEDIA_STOPPED" ;     break ;
            default:    msg = "MEDIA_undefined" ;
        }
        app.consoleLog(fName, "mediaStatus: " + status + " = " + msg) ;
    }

    app.consoleLog(fName, "exit") ;
} ;



app.btnBarkXDK = function() {
    "use strict" ;
    var fName = "app.btnBarkXDK():" ;
    app.consoleLog(fName, "entry") ;

    try {
        var w = window.device && window.device.platform ;
        var x = navigator.userAgent ;
        var y = getWebPath() ;
        var z = getWebRoot() ;
        app.consoleLog(fName, "platform = ", w) ;
        app.consoleLog(fName, "userAgent = ", x) ;
        app.consoleLog(fName, "getWebPath() => ", y) ;
        app.consoleLog(fName, "getWebRoot() => ", z) ;

        var media = "audio/bark.wav" ;
//        if( z.match(/\/emulator.*\/ripple\/userapp/i) ) {           // if in the Ripple emulator
        if( window.tinyHippos ) {                                   // if in the Ripple emulator
            media = z + "/" + media ;                               // bug in the emulator...
        }
        intel.xdk.player.playSound(media) ;
        app.consoleLog(fName, "try succeeded.") ;
    }
    catch(e) {
        app.consoleLog(fName, "try failed:", e) ;
    }

    app.consoleLog(fName, "exit") ;
} ;



app.btnBarkHTML5 = function() {
    "use strict" ;
    var fName = "app.btnBarkHTML5():" ;
    app.consoleLog(fName, "entry") ;

    var a = document.getElementsByTagName("audio")[0] ;
    a.play() ;

    app.consoleLog(fName, "exit") ;
} ;



app.updateDeviceInfo = function() {
    "use strict" ;
    var fName = "app.updateDeviceInfo():" ;
    app.consoleLog(fName, "entry") ;

    // "device" global object contains device capabilities (device.name, device.platform, device.uuid, etc.)
    // and is only present when we are running under Cordova (or an appropriate emulator)
    // AND have installed the device plugin if running under Cordova 3.0 or higher

    if(window.Cordova && window.device) {
        if(window.device.name) {
            document.getElementById("id_deviceName").textContent = window.device.name ;
        }
        else {
            document.getElementById("id_deviceName").textContent = window.device.model ;
        }

        if(window.device.phonegap) {
            document.getElementById("id_deviceCordova").textContent = window.device.phonegap ;
        }
        else {
            document.getElementById("id_deviceCordova").textContent = window.device.cordova ;
        }

        document.getElementById("id_deviceUUID").textContent = window.device.uuid ;
        document.getElementById("id_devicePlatform").textContent = window.device.platform ;
        document.getElementById("id_deviceVersion").textContent = window.device.version ;
    }
    document.getElementById("id_navigatorVendor").textContent = navigator.vendor ;
    document.getElementById("id_navigatorPlatform").textContent = navigator.platform ;
    document.getElementById("id_navigatorUserAgent").textContent = navigator.userAgent ;

    app.consoleLog(fName, "exit") ;
} ;
