/*
 * Copyright (c) 2014, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false */
/*global copyObject:false, addClass:false, removeClass:false */


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.



/* Geolocation */
var watchIdGeoLocate = null ;

var geoOptions = {                  // global is a dirty technique, done this way for demo and debug
    enableHighAccuracy : true,      // true for "fine" position (GPS), false for "coarse" position (network)
    timeout : 60000,                // maximum milliseconds to return a result (default is "Infinity")
    maximumAge : 60000              // max age in msecs of cached position, zero -> no caching, "Infinity" -> return a cached position
} ;



function initGeoLocate() {
    "use strict" ;
    var fName = "initGeoLocate():" ;
    console.log(fName, "entry") ;

    try {
        navigator.geolocation.clearWatch(watchIdGeoLocate) ;
        console.log(fName, "try succeeded.") ;
    }
    catch(e) {
        console.log(fName, "catch failed.") ;
    }

    console.log(fName, "exit") ;
}


// the following watch approach updates the geo location continuously
// until the geo button is pushed a second time to stop the watch

function btnGeo() {
    "use strict" ;
    var fName = "btnGeo():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        document.getElementById('geo-latitude').value = pos.coords.latitude ;
        document.getElementById('geo-longitude').value = pos.coords.longitude ;
        document.getElementById('geo-accuracy').value = pos.coords.accuracy ;
        document.getElementById('geo-altitude').value = pos.coords.altitude ;
        document.getElementById('geo-altAcc').value = pos.coords.altitudeAccuracy ;
        document.getElementById('geo-heading').value = pos.coords.heading ;
        document.getElementById('geo-speed').value = pos.coords.speed ;
        document.getElementById('geo-timestamp').value = pos.coords.timestamp ;
    }

    function onFail(err) {
        console.log('geoError(' + err.code + '): ' + err.message) ;
    }

    if( watchIdGeoLocate === null ) {
        var myGeoOptions = copyObject(geoOptions) ;
        if( myGeoOptions.maximumAge < 0 )
            myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
        try {                                       // watch and update geo at timeout or on change
            watchIdGeoLocate = navigator.geolocation.watchPosition(onSuccess, onFail, myGeoOptions) ;
            addClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
            console.log(fName, "btnGeo enabled.") ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
    }
    else {
        navigator.geolocation.clearWatch(watchIdGeoLocate) ;
        watchIdGeoLocate = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnGeo")) ;
        console.log(fName, "btnGeo disabled.") ;
    }

    console.log(fName, "exit") ;
}



// based on code from: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation.getCurrentPosition
// each fn will reconfig geoOptions for use by Geo (above) to make it easier to switch between settings

function btnGeoFine() {
    "use strict" ;
    var fName = "btnGeoFine():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geoOptions) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = true ;    // force use of high accuracy measurement (e.g., GPS)
    geoOptions.enableHighAccuracy = true ;      // set to high accuracy for next use by btnGeo()

    geoLocateXDK() ;
    geoLocateCordova(myGeoOptions) ;
    geoLocateBrowser(myGeoOptions) ;

    console.log(fName, "exit") ;
}

function btnGeoCoarse() {
    "use strict" ;
    var fName = "btnGeoCoarse():" ;
    console.log(fName, "entry") ;

    var myGeoOptions = copyObject(geoOptions) ;
    if( myGeoOptions.maximumAge < 0 )
        myGeoOptions.maximumAge = Infinity ;    // force use of cached geo values if "cachAge" is negative
    myGeoOptions.enableHighAccuracy = false ;   // force use of low accuracy measurement (e.g., network location)
    geoOptions.enableHighAccuracy = false ;     // set to low accuracy for next use by btnGeo()

    geoLocateXDK() ;
    geoLocateCordova(myGeoOptions) ;
    geoLocateBrowser(myGeoOptions) ;

    console.log(fName, "exit") ;
}

// does the actual work of finding our position
// called by one of the above, which setup the desired options
// This function is based on the built-in browser geoLocate API.

function geoLocateBrowser(myGeoOptions) {
    "use strict" ;
    var fName = "geoLocateBrowser():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        console.log('Latitude : ' + pos.coords.latitude) ;
        console.log('Longitude: ' + pos.coords.longitude) ;
        console.log('Accuracy : ' + pos.coords.accuracy + ' meters') ;
        console.log('Altitude : ' + pos.coords.altitude + ' meters') ;
        console.log('Alt Acc  : ' + pos.coords.altitudeAccuracy + ' meters') ;
        console.log('Heading  : ' + pos.coords.heading) ;
        console.log('Speed    : ' + pos.coords.speed) ;
        console.log('Timestamp: ' + pos.coords.timestamp) ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
        console.log('geoError(' + err.code + '): ' + err.message) ;
    }

    try {
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, myGeoOptions) ;
    }
    catch(e) {
        console.log(fName, "try/catch failed - device API not present.") ;
    }

    console.log(fName, "exit") ;
}


// does the actual work of finding our position
// called by one of the above, which setup the desired options
// This function is based on the Cordova geoLocate API.
// The Cordova API will use the browser API if it exists.

function geoLocateCordova(myGeoOptions) {
    "use strict" ;
    var fName = "geoLocateCordova():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        console.log('Latitude : ' + pos.coords.latitude) ;
        console.log('Longitude: ' + pos.coords.longitude) ;
        console.log('Accuracy : ' + pos.coords.accuracy + ' meters') ;
        console.log('Altitude : ' + pos.coords.altitude + ' meters') ;
        console.log('Alt Acc  : ' + pos.coords.altitudeAccuracy + ' meters') ;
        console.log('Heading  : ' + pos.coords.heading) ;
        console.log('Speed    : ' + pos.coords.speed) ;
        console.log('Timestamp: ' + pos.coords.timestamp) ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
        console.log('geoError(' + err.code + '): ' + err.message) ;
    }

    try {
        navigator.geolocation.getCurrentPosition(onSuccess, onFail, myGeoOptions) ;
    }
    catch(e) {
        console.log(fName, "try/catch failed - device API not present.") ;
    }

    console.log(fName, "exit") ;
}


// does the actual work of finding our position
// called by one of the above, which setup the desired options
// This function is based on the XDK geoLocate API.

function geoLocateXDK() {
    "use strict" ;
    var fName = "geoLocateXDK():" ;
    console.log(fName, "entry") ;

    function onSuccess(pos) {
        console.log(fName, "onSuccess") ;
        console.log('Latitude : ' + pos.coords.latitude) ;
        console.log('Longitude: ' + pos.coords.longitude) ;
        console.log('Accuracy : ' + pos.coords.accuracy + ' meters') ;
        console.log('Altitude : ' + pos.coords.altitude + ' meters') ;
        console.log('Alt Acc  : ' + pos.coords.altitudeAccuracy + ' meters') ;
        console.log('Heading  : ' + pos.coords.heading) ;
        console.log('Speed    : ' + pos.coords.speed) ;
        console.log('Timestamp: ' + pos.coords.timestamp) ;
    }

    function onFail(err) {
        console.log(fName, "onFail") ;
        console.log('geoError(' + err.code + '): ' + err.message) ;
    }

    try {
        intel.xdk.geolocation.getCurrentPosition(onSuccess, onFail) ;
    }
    catch(e) {
        console.log(fName, "try/catch failed - device API not present.") ;
    }

    console.log(fName, "exit") ;
}
