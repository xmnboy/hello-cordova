/*
 * Copyright (c) 2013-2016, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md and LICENSE.md files for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false, geo:false */
/*global copyObject:false, addClass:false, removeClass:false, tinyHippos:false */


window.geo = window.geo || {} ;     // don't clobber existing geo object


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.
// Set to "true" if you want the console.log messages to appear.

geo.LOG = true ;
geo.consoleLog = function() {       // only emits console.log messages if geo.LOG != false
    "use strict" ;
    if( geo.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;


geo.opts = {
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network, et al)
    timeout : 15000,                // maximum milliseconds to wait to return a result (default is "Infinity")
    maximumAge : 60000,             // max age in msecs of an acceptable cached position, zero -> no caching, "Infinity" -> return a cached position
    watchId : null                  // holds handle for watchPosition(), pass as null to clearWatch() to terminate the watch
} ;

geo.demoOffset = {                  // a simple mock offset from the current location, to protect privacy during recorded demos
    latitude : 0,                   // info: latitude values are bounded by ±90°, +latitudes are north of the equator
    longitude : 0,                  // info: longitude values are bounded by ±180°, +longitudes are east of the Prime Meridian
    applyOffsetLat : function(lat) {
        if( window.tinyHippos )     // if running in Emulate tab, no offsets applied
            return (lat) ;

        if( this.latitude ) {
            if( this.latitude > 90 )    // just to simplify the math
                this.latitude = 90 ;
            if( this.latitude < -90 )   // ditto
                this.latitude = -90 ;

            lat += this.latitude ;

            if( lat > 90 )              // correct for any overflow
                lat = 180 - lat ;
            if( lat < -90 )             // ditto
                lat = -180 - lat ;
        }
        return (lat) ;
    },
    applyOffsetLong : function(long) {
        if( window.tinyHippos )         // if running in Emulate tab, no offsets applied
            return (long) ;

        if( this.longitude ) {
            if( this.longitude > 180 )  // just to simplify the math
                this.longitude = 180 ;
            if( this.longitude < -180 ) // ditto
                this.longitude = -180 ;

            long += this.longitude ;

            if( long > 180 )            // correct for any overflow
                long = 360 - long ;
            if( long < -180 )           // ditto
                long = -360 - long ;
        }
        return (long) ;
    }
} ;


// Called by init-app.js
// Just sets everything to a known state.

geo.initGeoLocate = function() {
    "use strict" ;
    var fName = "geo.initGeoLocate():" ;
    geo.consoleLog(fName, "entry") ;

    try {
        navigator.geolocation.clearWatch(geo.opts.watchId = null) ;
        geo.consoleLog(fName, "navigator try succeeded.") ;
    }
    catch(e) {
        geo.consoleLog(fName, "navigator try failed:", e) ;
    }

    geo.consoleLog(fName, "exit") ;
} ;



// Two functions to reconfigure geo.opts for use by the geo watch functions.
// Just makes it easier to switch between fine/coarse settings for demo and test.
// Also call the function that gets us a single geo position result.
// Based on code from: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation.getCurrentPosition

geo.btnGeoFine = function() {
    "use strict" ;
    var fName = "geo.btnGeoFine():" ;
    geo.consoleLog(fName, "entry") ;

    var geoOpts = copyObject(geo.opts) ;
    if( geoOpts.maximumAge < 0 )
        geoOpts.maximumAge = Infinity ;         // force use of cached geo values if "cachAge" is negative
    geoOpts.enableHighAccuracy = true ;         // force use of high accuracy measurement (e.g., GPS)
    geo.opts.enableHighAccuracy = true ;        // set to high accuracy for next use by watch function

    geo.locate(geoOpts) ;                       // do a single geo request
    geo.consoleLog(fName, "exit") ;
} ;

geo.btnGeoCoarse = function() {
    "use strict" ;
    var fName = "geo.btnGeoCoarse():" ;
    geo.consoleLog(fName, "entry") ;

    var geoOpts = copyObject(geo.opts) ;
    if( geoOpts.maximumAge < 0 )
        geoOpts.maximumAge = Infinity ;         // force use of cached geo values if "cachAge" is negative
    geoOpts.enableHighAccuracy = false ;        // force use of low accuracy measurement (e.g., network location)
    geo.opts.enableHighAccuracy = false ;       // set to low accuracy for next use by watch function

    geo.locate(geoOpts) ;                       // do a single geo request
    geo.consoleLog(fName, "exit") ;
} ;



// Perform a single geo request (no watch).
// Print results into watch output cells.
// This function uses the W3C browser geoLocate API.
// The Cordova plugin will polyfill in case the standard API does not exist in the webview.
// Including the Cordova plugin eliminates an extra confusing geo security request.

geo.locate = function(geoOpts) {
    "use strict" ;
    var fName = "geo.locate():" ;
    geo.consoleLog(fName, "entry") ;

    var accuracy = geoOpts.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        geo.consoleLog(fName, "onSuccess") ;
        document.getElementById("geo-info").textContent = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").textContent = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").textContent = accuracy ;

        document.getElementById("geo-latitude").textContent = geo.demoOffset.applyOffsetLat(pos.coords.latitude) ;
        document.getElementById("geo-longitude").textContent = geo.demoOffset.applyOffsetLong(pos.coords.longitude) ;
        document.getElementById("geo-accuracy").textContent = pos.coords.accuracy ;
        document.getElementById("geo-altitude").textContent = pos.coords.altitude ;
        document.getElementById("geo-altAcc").textContent = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").textContent = pos.coords.heading ;
        document.getElementById("geo-speed").textContent = pos.coords.speed ;
        document.getElementById("geo-timestamp").textContent = pos.timestamp ;
    }

    function onFail(err) {
        geo.consoleLog(fName, "onFail") ;
        document.getElementById("geo-info").textContent = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").textContent = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").textContent = accuracy ;
        document.getElementById("geo-latitude").textContent = err.code ;
        document.getElementById("geo-longitude").textContent = err.message ;
        document.getElementById("geo-accuracy").textContent = "" ;
        document.getElementById("geo-altitude").textContent = "" ;
        document.getElementById("geo-altAcc").textContent = "" ;
        document.getElementById("geo-heading").textContent = "" ;
        document.getElementById("geo-speed").textContent = "" ;
        document.getElementById("geo-timestamp").textContent = "" ;
        geo.consoleLog(fName, 'geoError(' + err.code + '): ' + err.message) ;
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
    }

    try {
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, geoOpts) ;
    }
    catch(e) {
        geo.consoleLog(fName, "try failed - device API not present?", e) ;
    }

    geo.consoleLog(fName, "exit") ;
} ;



// Watch function that updates geo location continuously.
// Stops when the geo button is pushed a second time.
// This function uses the W3C browser geoLocate API.
// The Cordova plugin will polyfill in case the standard API does not exist in the webview.
// Including the Cordova plugin also eliminates a confusing geo security request.

geo.btnGeo = function() {
    "use strict" ;
    var fName = "geo.btnGeo():" ;
    geo.consoleLog(fName, "entry") ;

    var geoOpts = copyObject(geo.opts) ;
    if( geoOpts.maximumAge < 0 )
        geoOpts.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    var accuracy = geoOpts.enableHighAccuracy ? "fine" : "coarse" ;

    function onSuccess(pos) {
        geo.consoleLog(fName, "onSuccess") ;
        document.getElementById("geo-info").textContent = fName + " onSuccess " ;
        if( window.moment )
            document.getElementById("geo-mode").textContent = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").textContent = accuracy ;
        document.getElementById("geo-latitude").textContent = geo.demoOffset.applyOffsetLat(pos.coords.latitude) ;
        document.getElementById("geo-longitude").textContent = geo.demoOffset.applyOffsetLong(pos.coords.longitude) ;
        document.getElementById("geo-accuracy").textContent = pos.coords.accuracy ;
        document.getElementById("geo-altitude").textContent = pos.coords.altitude ;
        document.getElementById("geo-altAcc").textContent = pos.coords.altitudeAccuracy ;
        document.getElementById("geo-heading").textContent = pos.coords.heading ;
        document.getElementById("geo-speed").textContent = pos.coords.speed ;
        document.getElementById("geo-timestamp").textContent = pos.timestamp ;
    }

    function onFail(err) {
        geo.consoleLog(fName, "onFail") ;
        document.getElementById("geo-info").textContent = fName + " onFail " ;
        if( window.moment )
            document.getElementById("geo-mode").textContent = accuracy + " " + moment().format("HH:mm:ss.SSS") ;
        else
            document.getElementById("geo-mode").textContent = accuracy ;
        document.getElementById("geo-latitude").textContent = err.code ;
        document.getElementById("geo-longitude").textContent = err.message ;
        document.getElementById("geo-accuracy").textContent = "" ;
        document.getElementById("geo-altitude").textContent = "" ;
        document.getElementById("geo-altAcc").textContent = "" ;
        document.getElementById("geo-heading").textContent = "" ;
        document.getElementById("geo-speed").textContent = "" ;
        document.getElementById("geo-timestamp").textContent = "" ;
        geo.consoleLog(fName, "geoError(" + err.code + "): " + err.message) ;
    }

    if( geo.opts.watchId === null ) {               // let's start watching geo position
        try {                                       // watch and update geo at timeout or on change
            geo.opts.watchId = navigator.geolocation.watchPosition(onSuccess, onFail, geoOpts) ;
            addClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
            geo.consoleLog(fName, "btnGeo enabled.") ;
        }
        catch(e) {
            geo.consoleLog(fName, "try failed - device API not present?", e) ;
        }
    }
    else {
        try {
            navigator.geolocation.clearWatch(geo.opts.watchId) ;
        }
        catch(e) {
            geo.consoleLog(fName, "try failed - device API not present?", e) ;
        }
        geo.opts.watchId = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
        geo.consoleLog(fName, "btnGeo disabled.") ;
    }

    geo.consoleLog(fName, "exit") ;
} ;
