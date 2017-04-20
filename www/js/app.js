/*
 * Copyright (c) 2013-2016, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md and LICENSE.md files for license terms and conditions.
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

        var path = "audio/bark.wav" ;
//        if( z.match(/\/emulator.*\/ripple\/userapp/i) ) {           // if in the Emulate tab
        if( window.tinyHippos ) {                                   // if in the Emulate tab
            path = z + "/" + path ;
        }
        else if( x.match(/(ios)|(iphone)|(ipod)|(ipad)/ig) ) {      // if on a real iOS device
//            path = "audio/bark.mp3" ;
            path = "/" + path ;
//            path = path ;
//            path = y.substring(7) + "/" + path ;
//            path = "cdvfile:" + y.substring(6) + "/" + path ;
        }
        else {                                                      // everything else...
            path = z + "/" + path ;
        }

        var media = new Media(path, mediaSuccess, mediaError, mediaStatus) ;
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

    if(window.cordova && window.device) {
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



// An attempt to help understand what the pixel units of a viewport are and an attempt
// to calculate the physical pixel resolution, which really shouldn't be used or relied
// on in an app, but some developers always want to know what that number is...
// see http://stackoverflow.com/questions/27382331/how-a-css-pixel-size-is-calculated
// and http://www.quirksmode.org/blog/archives/2014/05/html5_dev_conf.html

app.updateViewportInfo = function() {
    "use strict" ;
    var fName = "app.updateViewportInfo():" ;
    app.consoleLog(fName, "entry") ;

    var view = {
        screenWidth: null,          // screen width reported
        screenHeight: null,
        windowWidth: null,          // window width reported
        windowHeight: null,
        documentWidth: null,        // document width reported
        documentHeight: null,
        devicePixelWidth: null,     // device physical pixel width calculated
        devicePixelHeight: null,
        deviceScreenWidth: null,    // device physical screen width calculated
        deviceScreenHeight: null,
        dpr: null,                  // reported device pixel ratio
        ratio: null                 // screen aspect ratio (e.g. 16:9 = 1.777777777)
    } ;

    measureScreen() ;               // update screen measurements
    document.getElementById("id_screenWidth").textContent = view.screenWidth ;
    document.getElementById("id_screenHeight").textContent = view.screenHeight ;

    measureWindow() ;               // ditto
    document.getElementById("id_windowWidth").textContent = view.windowWidth ;
    document.getElementById("id_windowHeight").textContent = view.windowHeight ;

    measureDocument() ;
    document.getElementById("id_documentWidth").textContent = view.documentWidth ;
    document.getElementById("id_documentHeight").textContent = view.documentHeight ;

    measureDevicePixelRatio() ;
    document.getElementById("id_devicePixelRatio").textContent = view.dpr ;

    measureScreenAspectRatio() ;
    document.getElementById("id_screenAspectRatio").textContent = view.ratio ;

    calculatePhysicalPixels() ;
    document.getElementById("id_devicePixelWidth").textContent = view.devicePixelWidth ;
    document.getElementById("id_devicePixelHeight").textContent = view.devicePixelHeight ;

//    calculateScreenSize() ;
//    document.getElementById("id_deviceScreenWidth").textContent = view.deviceScreenWidth ;
//    document.getElementById("id_deviceScreenHeight").textContent = view.deviceScreenHeight ;



// screen.width/height is supposed to report CSS pixels of entire display
// represents the "ideal viewport" if your app consumed the entire display
    function measureScreen() {
        view.screenWidth = screen.width ;
        view.screenHeight = screen.height ;
    }

// reports the "visual viewport" in CSS pixels
// does not work in Android 2.x
    function measureWindow() {
        view.windowWidth = window.innerWidth ;
        view.windowHeight = window.innerHeight ;
        // return( "Viewing window: " + width + " x " + height + " vpx = " + width*window.devicePixelRatio.toFixed(1) + " x " + height*window.devicePixelRatio.toFixed(1) + " ppx" ) ;
    }

// reports the "layout viewport" or "rendering viewport" in CSS pixels
// most interesting if you omit the viewport meta tag or use unusual viewport values
    function measureDocument() {
        view.documentWidth = document.documentElement.clientWidth ;
        view.documentHeight = document.documentElement.clientHeight ;
    }

// pixel ratio represents ratio of device pixels to ideal viewport pixels
// should be able to calculate device pixels --> screen.width * window.devicePixelRatio
    function measureDevicePixelRatio() {
        if( window.devicePixelRatio )
            view.dpr = window.devicePixelRatio ;
        else
            view.dpr = NaN ;
    }

// screen aspect ratio as measured by longest side over shortest
// regardless of device orientation (landscape or portrait)
// see https://software.intel.com/en-us/html5/hub/blogs/how-to-get-the-correct-android-screen-dimensions
    function measureScreenAspectRatio() {
        var screenRatio, width, height ;
        screenRatio = width = height = NaN ;

        width = screen.width ;
        height = screen.height ;

        if( width > height )
            screenRatio = width/height ;
        else
            screenRatio = height/width ;

        if( isNaN(screenRatio) ) {
            width = window.innerWidth ;
            height = window.innerHeight ;

            if( width > height )
                screenRatio = width/height ;
            else
                screenRatio = height/width ;
        }

        view.ratio = screenRatio ;
    }


// estimate physical screen pixel dimensions based on device pixel ratio
    function calculatePhysicalPixels() {
        measureDevicePixelRatio() ;
        measureScreen() ;
        view.devicePixelWidth = view.screenWidth * view.dpr.toFixed(1) ;
        view.devicePixelHeight = view.screenHeight * view.dpr.toFixed(1) ;
    }


// estimate physical screen size based on assumption that there are 96 CSS pixels per inch
// see https://www.w3.org/TR/css3-values/#absolute-lengths
    function calculateScreenSize() {
        measureScreen() ;
        view.deviceScreenWidth = view.screenWidth / 96 ;
        view.deviceScreenHeight = view.screenHeight / 96 ;
    }


    app.consoleLog(fName, "exit") ;
} ;
