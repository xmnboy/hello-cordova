/*
 * Copyright (c) 2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false, geo:false */
/*global copyObject:false, addClass:false, removeClass:false */


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.



window.geo = window.geo || {} ;         // there should only be one of these, but...


// Set to "true" if you want the console.log messages to appear.

geo.LOG = true ;

geo.consoleLog = function() {           // only emits console.log messages if geo.LOG != false
    if( geo.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;


geo.watchIdGeoLocate = null ;       // holds handle for watchPosition(), pass as null to clearWatch() to terminate the watch

geo.options = {
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network)
    timeout : 5000,                 // maximum milliseconds to return a result (default is "Infinity")
    maximumAge : 60000              // max age in msecs of cached position, zero -> no caching, "Infinity" -> return a cached position
} ;

geo.watchIdGeoLocateXDK = null ;    // holds handle for watchPosition(), pass as null to clearWatch() to terminate the watch

geo.optionsXDK = {
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network)
    timeout : 2000,                 // milliseconds interval to return a result (default is "Infinity")
    maximumAge : 60000              // max age in milliseconds to wait for position before returning error
} ;



// Called by init-app.js
// Just sets everything to a known state.

geo.initGeoLocate = function() {
    "use strict" ;
    var fName = "geo.initGeoLocate():" ;
    console.log(fName, "entry") ;

    try {
        navigator.geolocation.clearWatch(geo.watchIdGeoLocate = null) ;
        console.log(fName, "navigator try succeeded.") ;
    }
    catch(e) {
        console.log(fName, "navigator catch failed.") ;
    }

    try {
        intel.xdk.geolocation.clearWatch(geo.watchIdGeoLocateXDK = null) ;
        console.log(fName, "intel.xdk try succeeded.") ;
    }
    catch(e) {
        console.log(fName, "intel.xdk catch failed.") ;
    }

    console.log(fName, "exit") ;
} ;



// Two functions to reconfigure geo.options for use by the geo watch functions.
// Just makes it easier to switch between fine/coarse settings for demo and test.
// Based on code from: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation.getCurrentPosition

geo.btnGeoFine = function() {
    "use strict" ;
    var fName = "geo.btnGeoFine():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geo.options) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = true ;    // force use of high accuracy measurement (e.g., GPS)
    geo.options.enableHighAccuracy = true ;     // set to high accuracy for next use by watch function

//    geo.locateXDK() ;                           // just for fun, do a single geo request, watch console.log()
    geo.locate(myGeoOptions) ;                  // just for fun, do a single geo request, watch console.log()

    console.log(fName, "exit") ;
} ;

geo.btnGeoCoarse = function() {
    "use strict" ;
    var fName = "geo.btnGeoCoarse():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geo.options) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = false ;   // force use of low accuracy measurement (e.g., network location)
    geo.options.enableHighAccuracy = false ;    // set to low accuracy for next use by watch function

//    geo.locateXDK() ;                           // just for fun, do a single geo request, watch console.log()
    geo.locate(myGeoOptions) ;                  // just for fun, do a single geo request, watch console.log()

    console.log(fName, "exit") ;
} ;



// Perform a single geo request (no watch).
// This function uses the W3C browser geoLocate API.
// The Cordova plugin will polyfill in case the standard API does not exist in the webview.
// Including the Cordova plugin also eliminates an extra confusing geo security request.

geo.locate = function(myGeoOptions) {
    "use strict" ;
    var fName = "geo.locate():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        console.log(fName, 'Latitude : ' + pos.coords.latitude) ;
        console.log(fName, 'Longitude: ' + pos.coords.longitude) ;
        console.log(fName, 'Accuracy : ' + pos.coords.accuracy + ' meters') ;
        console.log(fName, 'Altitude : ' + pos.coords.altitude + ' meters') ;
        console.log(fName, 'Alt Acc  : ' + pos.coords.altitudeAccuracy + ' meters') ;
        console.log(fName, 'Heading  : ' + pos.coords.heading) ;
        console.log(fName, 'Speed    : ' + pos.coords.speed) ;
        console.log(fName, 'Timestamp: ' + pos.coords.timestamp) ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
        console.log(fName, 'geoError(' + err.code + '): ' + err.message) ;
    }

    try {
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, myGeoOptions) ;
    }
    catch(e) {
        console.log(fName, "try/catch failed - device API not present.") ;
    }

    console.log(fName, "exit") ;
} ;

// Perform a single geo request (no watch).
// This function is based on the XDK geoLocate API.

geo.locateXDK = function() {
    "use strict" ;
    var fName = "geo.locateXDK():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        console.log(fName, "Latitude : " + pos.coords.latitude) ;
        console.log(fName, "Longitude: " + pos.coords.longitude) ;
        console.log(fName, "Accuracy : " + pos.coords.accuracy + " meters") ;
        console.log(fName, "Altitude : " + pos.coords.altitude + " meters") ;
        console.log(fName, "Alt Acc  : " + pos.coords.altitudeAccuracy + " meters") ;
        console.log(fName, "Heading  : " + pos.coords.heading) ;
        console.log(fName, "Speed    : " + pos.coords.speed) ;
        console.log(fName, "Timestamp: " + pos.coords.timestamp) ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        console.log(fName, "geoError(" + err.code + "): " + err.message) ;
        console.log(fName, "geoError(" + err + ")") ;
    }

    try {
        intel.xdk.geolocation.getCurrentPosition(onSuccess, onFail) ;
    }
    catch(e) {
        console.log(fName, "try/catch failed - device API not present.") ;
    }

    console.log(fName, "exit") ;
} ;



// Watch function that updates geo location continuously.
// Stops when the geo button is pushed a second time.
// This function uses the W3C browser geoLocate API.
// The Cordova plugin will polyfill in case the standard API does not exist in the webview.
// Including the Cordova plugin also eliminates an extra confusing geo security request.

geo.btnGeo = function() {
    "use strict" ;
    var fName = "geo.btnGeo():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.coords.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "geoError(" + err.code + "): " + err.message) ;
    }

    if( geo.watchIdGeoLocate === null ) {           // let's start watching geo position
        var myGeoOptions = copyObject(geo.options) ;
        if( myGeoOptions.maximumAge < 0 )
            myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
        try {                                       // watch and update geo at timeout or on change
            geo.watchIdGeoLocate = navigator.geolocation.watchPosition(onSuccess, onFail, myGeoOptions) ;
            addClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
            console.log(fName, "btnGeo enabled.") ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
    }
    else {
        navigator.geolocation.clearWatch(geo.watchIdGeoLocate) ;
        geo.watchIdGeoLocate = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
        console.log(fName, "btnGeo disabled.") ;
    }

    console.log(fName, "exit") ;
} ;

// Watch function that updates geo location continuously.
// Stops when the geo button is pushed a second time.
// This function uses the XDK browser geoLocate API.

geo.btnGeoXDK = function() {
    "use strict" ;
    var fName = "geo.btnGeoXDK():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.coords.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "geoError(" + err.code + "): " + err.message) ;
        console.log(fName, "geoError(" + err + ")") ;
    }

    if( geo.watchIdGeoLocateXDK === null ) {        // let's start watching geo position
        var myGeoOptions = copyObject(geo.optionsXDK) ;
        if( myGeoOptions.maximumAge < 0 )
            myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
        try {                                       // watch and update geo at timeout or on change
            geo.watchIdGeoLocateXDK = intel.xdk.geolocation.watchPosition(onSuccess, onFail, myGeoOptions) ;
            addClass("cl_btnOn", document.getElementById("id_btnGeoXDK")) ;
            console.log(fName, "btnGeoXDK enabled.") ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
    }
    else {
        intel.xdk.geolocation.clearWatch(geo.watchIdGeoLocateXDK) ;
        geo.watchIdGeoLocateXDK = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnGeoXDK")) ;
        console.log(fName, "btnGeoXDK disabled.") ;
    }

    console.log(fName, "exit") ;
} ;
