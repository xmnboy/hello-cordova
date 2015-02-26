/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false */
/*global addClass:false, removeClass:false */


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.


// TODO: add use of browser DeviceMotionEvent and DeviceOrientationEvent
// see: http://www.html5rocks.com/en/tutorials/device/orientation/

/* Accelerometer */
var watchIdAccel = null ;

function initAccel() {
    "use strict" ;
    var fName = "initAccel():" ;
    console.log(fName, "entry") ;

    try {
        navigator.accelerometer.clearWatch(watchIdAccel) ;
        console.log(fName, "try succeeded.") ;
    }
    catch(e) {
        console.log(fName, "catch failed.") ;
    }

    console.log(fName, "exit") ;
}

/*
 * the following watch approach updates the accel values continuously
 * until the accel button is pushed a second time to stop the watch
 */

function btnAccel() {
    "use strict" ;
    var fName = "btnAccel():" ;
    console.log(fName, "entry") ;

    function onSuccess(acceleration) {
        document.getElementById('acceleration-x').value = acceleration.x.toFixed(6) ;
        document.getElementById('acceleration-y').value = acceleration.y.toFixed(6) ;
        document.getElementById('acceleration-z').value = acceleration.z.toFixed(6) ;
        document.getElementById('acceleration-t').value = acceleration.timestamp ;
    }

    function onFail() {
        console.log(fName, "Failed to get acceleration data.") ;
    }


    if( watchIdAccel === null ) {
        try {                               // watch and update accelerometer values every 500 msecs
            watchIdAccel = navigator.accelerometer.watchAcceleration(onSuccess, onFail, {frequency:500}) ;
            addClass("cl_btnOn", document.getElementById("id_btnAccel")) ;
            console.log(fName, "btnAccel enabled.") ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
    }
    else {
        navigator.accelerometer.clearWatch(watchIdAccel) ;
        watchIdAccel = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnAccel")) ;
        console.log(fName, "btnAccel disabled.") ;
    }

    console.log(fName, "exit") ;
}




/* Compass */
var watchIdCompass = null ;

function initCompass() {
    "use strict" ;
    var fName = "initCompass():" ;
    console.log(fName, "entry") ;

    try {
        navigator.compass.clearWatch(watchIdCompass) ;
        console.log(fName, "try succeeded.") ;
    }
    catch(e) {
        console.log(fName, "catch failed.") ;
    }

    console.log(fName, "exit") ;
}

/*
 * the following watch approach updates the compass continuously
 * until the compass button is pushed a second time to stop the watch
 */

function btnCompass() {
    "use strict" ;
    var fName = "btnCompass():" ;
    console.log(fName, "entry") ;

    function onSuccess(heading) {
        document.getElementById('compass-dir').value = heading.magneticHeading.toFixed(6) ;
    }

    function onFail(compassError) {
        console.log(fName, "Compass error: " + compassError.code) ;
    }


    if( watchIdCompass === null ) {
        try {                               // watch and update compass value every 500 msecs
            watchIdCompass = navigator.compass.watchHeading(onSuccess, onFail, {frequency:500}) ;
            addClass("cl_btnOn", document.getElementById("id_btnCompass")) ;
            console.log(fName, "btnCompass enabled.") ;
        }
        catch(e) {
            console.log(fName, "try/catch failed - device API not present.") ;
        }
    }
    else {
        navigator.compass.clearWatch(watchIdCompass) ;
        watchIdCompass = null ;
        removeClass("cl_btnOn", document.getElementById("id_btnCompass")) ;
        console.log(fName, "btnCompass disabled.") ;
    }

    console.log(fName, "exit") ;
}
