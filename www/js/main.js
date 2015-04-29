/*
 * Copyright (c) 2013-2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, Media:false, moment:false */
/*global getWebPath:false, getWebRoot:false */


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.



function btnBeep() {
    "use strict" ;
    var fName = "btnBeep():" ;
    console.log(fName, "entry") ;

    try {
        navigator.notification.beep(1) ;
        console.log(fName, "try, success") ;
    }
    catch(e) {
        console.log(fName, "catch, failure") ;
    }

    console.log(fName, "exit") ;
}



function btnVibrate() {
    "use strict" ;
    var fName = "btnVibrate():" ;
    console.log(fName, "entry") ;

    try {
        navigator.notification.vibrate(250) ;
        console.log(fName, "try, success") ;
    }
    catch(e) {
        console.log(fName, "catch, failure") ;
    }

    console.log(fName, "exit") ;
}



function btnBarkCordova() {
    "use strict" ;
    var fName = "btnBarkCordova():" ;
    console.log(fName, "entry") ;

    try {
        var w = window.device && window.device.platform ;
        var x = navigator.userAgent ;
        var y = getWebPath() ;
        var z = getWebRoot() ;
        console.log(fName, "platform = ", w) ;
        console.log(fName, "userAgent = ", x) ;
        console.log(fName, "getWebPath() => ", y) ;
        console.log(fName, "getWebRoot() => ", z) ;

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
        console.log(fName, "media.src = ", media.src) ;
        media.play() ;
        console.log(fName, "try, success") ;
    }
    catch(e) {
        console.log(fName, "catch, failure") ;
    }

// private functions for our media object

    function mediaSuccess() {
        media.stop() ;
        media.release() ;
        console.log(fName, "mediaSuccess") ;
    }
    function mediaError(err) {
        media.stop() ;
        media.release() ;
        console.log(fName, "mediaError:err.code: " + err.code + " ; " + "mediaError:err.message: " + err.message) ;
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
        console.log(fName, "mediaStatus: " + status + " = " + msg) ;
    }

    console.log(fName, "exit") ;
}



function btnBarkXDK() {
    "use strict" ;
    var fName = "btnBarkXDK():" ;
    console.log(fName, "entry") ;

    try {
        var w = window.device && window.device.platform ;
        var x = navigator.userAgent ;
        var y = getWebPath() ;
        var z = getWebRoot() ;
        console.log(fName, "platform = ", w) ;
        console.log(fName, "userAgent = ", x) ;
        console.log(fName, "getWebPath() => ", y) ;
        console.log(fName, "getWebRoot() => ", z) ;

        var media = "audio/bark.wav" ;
//        if( z.match(/\/emulator.*\/ripple\/userapp/i) ) {           // if in the Ripple emulator
        if( window.tinyHippos ) {                                   // if in the Ripple emulator
            media = z + "/" + media ;                               // bug in the emulator...
        }
        intel.xdk.player.playSound(media) ;
        console.log(fName, "try, success") ;
    }
    catch(e) {
        console.log(fName, "catch, failure") ;
    }

    console.log(fName, "exit") ;
}



function btnBarkHTML5() {
    "use strict" ;
    var fName = "btnBarkHTML5():" ;
    console.log(fName, "entry") ;

    var a = document.getElementsByTagName("audio")[0] ;
    a.play() ;

    console.log(fName, "exit") ;
}



function updateDeviceInfo() {
    "use strict" ;
    var fName = "updateDeviceReady():" ;
    console.log(fName, "entry") ;

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

    console.log(fName, "exit") ;
}
