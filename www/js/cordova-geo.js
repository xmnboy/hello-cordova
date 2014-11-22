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
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network, et al)
    timeout : 15000,                // maximum milliseconds to wait to return a result (default is "Infinity")
    maximumAge : 60000              // max age in msecs of an acceptable cached position, zero -> no caching, "Infinity" -> return a cached position
} ;

geo.watchIdGeoLocateXDK = null ;    // holds handle for watchPosition(), pass as null to clearWatch() to terminate the watch

geo.optionsXDK = {
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network, et al)
    timeout : 2000,                 // milliseconds interval to return a result (default is 10,000 msecs)
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
// Also call the function that gets us a single geo position result.
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

    geo.locate(myGeoOptions) ;                  // do a single geo request
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

    geo.locate(myGeoOptions) ;                  // do a single geo request
    console.log(fName, "exit") ;
} ;

geo.btnGeoFineXDK = function() {
    "use strict" ;
    var fName = "geo.btnGeoFineXDK():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geo.optionsXDK) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = true ;    // force use of high accuracy measurement (e.g., GPS)
    geo.optionsXDK.enableHighAccuracy = true ;  // set to high accuracy for next use by watch function

    geo.locateXDK(myGeoOptions) ;               // do a single geo request
    console.log(fName, "exit") ;
} ;

geo.btnGeoCoarseXDK = function() {
    "use strict" ;
    var fName = "geo.btnGeoCoarseXDK():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geo.optionsXDK) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = false ;   // force use of low accuracy measurement (e.g., network location)
    geo.optionsXDK.enableHighAccuracy = false ; // set to low accuracy for next use by watch function

    geo.locateXDK(myGeoOptions) ;               // do a single geo request
    console.log(fName, "exit") ;
} ;



// Perform a single geo request (no watch).
// Print results into watch output cells.
// This function uses the W3C browser geoLocate API.
// The Cordova plugin will polyfill in case the standard API does not exist in the webview.
// Including the Cordova plugin also eliminates an extra confusing geo security request.

geo.locate = function(myGeoOptions) {
    "use strict" ;
    var fName = "geo.locate():" ;
    console.log(fName, "entry") ;

    var accuracy = myGeoOptions.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-info").value = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        document.getElementById("geo-info").value = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = err.code ;
        document.getElementById("geo-longitude").value = err.message ;
        document.getElementById("geo-accuracy").value = "" ;
        document.getElementById("geo-altitude").value = "" ;
        document.getElementById("geo-altAcc").value = "" ;
        document.getElementById("geo-heading").value = "" ;
        document.getElementById("geo-speed").value = "" ;
        document.getElementById("geo-timestamp").value = "" ;
        console.log(fName, 'geoError(' + err.code + '): ' + err.message) ;
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
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

geo.locateXDK = function(myGeoOptions) {
    "use strict" ;
    var fName = "geo.locateXDK():" ;
    console.log(fName, "entry") ;

    var accuracy = myGeoOptions.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-info").value = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        document.getElementById("geo-info").value = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = err ;
        document.getElementById("geo-longitude").value = "" ;
        document.getElementById("geo-accuracy").value = "" ;
        document.getElementById("geo-altitude").value = "" ;
        document.getElementById("geo-altAcc").value = "" ;
        document.getElementById("geo-heading").value = "" ;
        document.getElementById("geo-speed").value = "" ;
        document.getElementById("geo-timestamp").value = "" ;
        console.log(fName, "geoError(" + err + ")") ;
    }

    try {
        intel.xdk.geolocation.getCurrentPosition(onSuccess, onFail, myGeoOptions) ;
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

    var myGeoOptions = copyObject(geo.options) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    var accuracy = myGeoOptions.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-info").value = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        document.getElementById("geo-info").value = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = err.code ;
        document.getElementById("geo-longitude").value = err.message ;
        document.getElementById("geo-accuracy").value = "" ;
        document.getElementById("geo-altitude").value = "" ;
        document.getElementById("geo-altAcc").value = "" ;
        document.getElementById("geo-heading").value = "" ;
        document.getElementById("geo-speed").value = "" ;
        document.getElementById("geo-timestamp").value = "" ;
        console.log(fName, "geoError(" + err.code + "): " + err.message) ;
    }

    if( geo.watchIdGeoLocate === null ) {           // let's start watching geo position
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
        try {
            navigator.geolocation.clearWatch(geo.watchIdGeoLocate) ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
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

    var myGeoOptions = copyObject(geo.optionsXDK) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    var accuracy = myGeoOptions.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById("geo-info").value = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = pos.coords.latitude ;
        document.getElementById("geo-longitude").value = pos.coords.longitude ;
        document.getElementById("geo-accuracy").value = pos.coords.accuracy ;
        document.getElementById("geo-altitude").value = pos.coords.altitude ;
        document.getElementById("geo-altAcc").value = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").value = pos.coords.heading ;
        document.getElementById("geo-speed").value = pos.coords.speed ;
        document.getElementById("geo-timestamp").value = pos.timestamp ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        document.getElementById("geo-info").value = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").value = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").value = accuracy ;
        document.getElementById("geo-latitude").value = err ;
        document.getElementById("geo-longitude").value = "" ;
        document.getElementById("geo-accuracy").value = "" ;
        document.getElementById("geo-altitude").value = "" ;
        document.getElementById("geo-altAcc").value = "" ;
        document.getElementById("geo-heading").value = "" ;
        document.getElementById("geo-speed").value = "" ;
        document.getElementById("geo-timestamp").value = "" ;
        console.log(fName, "geoError(" + err + ")") ;
    }

    if( geo.watchIdGeoLocateXDK === null ) {        // let's start watching geo position
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
        try {
            intel.xdk.geolocation.clearWatch(geo.watchIdGeoLocateXDK) ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
        geo.watchIdGeoLocateXDK = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnGeoXDK")) ;
        console.log(fName, "btnGeoXDK disabled.") ;
    }

    console.log(fName, "exit") ;
} ;
