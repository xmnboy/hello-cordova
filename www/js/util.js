/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false, cordova:false, device:false */
/*global utl:false */


window.utl = window.utl || {} ;         // don't clobber existing utl object


// The console.log() messages sprinkled in this file are for instruction and debug.
// If you reuse this code you do not need to include them as part of your app.
// Set to "true" if you want the console.log messages to appear.

utl.LOG = true ;
utl.consoleLog = function() {           // only emits console.log messages if utl.LOG != false
    "use strict" ;
    if( utl.LOG ) {
        var args = Array.prototype.slice.call(arguments, 0) ;
        console.log.apply(console, args) ;
    }
} ;



// addClass() and removeClass() are alternatives to using jQuery
// NOTE: this function has flaws, see comments below...
// Beware: if( cn.indexOf( classname ) != -1 ) { return ; }
// Beware: fails if you add class “btn” and class “btn-info” is already there

function addClass( classname, element ) {
    "use strict" ;
    var cn = element.className ;
    if( cn.indexOf( classname ) !== -1 ) {  // test for existence, see "Beware" note above
        return ;
    }
    if( cn !== '' ) {                       // add a space if the element already has a class
        classname = ' ' + classname ;
    }
    element.className = cn + classname ;
}

function removeClass( classname, element ) {
    "use strict" ;
    var cn = element.className ;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" ) ;
    cn = cn.replace( rxp, '' ) ;
    element.className = cn ;
}



// getWebPath() returns the location of index.html
// getWebRoot() returns URI pointing to index.html

function getWebPath() {
    "use strict" ;
    var path = window.location.pathname ;
    path = path.substring( 0, path.lastIndexOf('/') ) ;
    return 'file://' + path ;
}

function getWebRoot() {
    "use strict" ;
    var path = window.location.href ;
    path = path.substring( 0, path.lastIndexOf('/') ) ;
    return path ;
}



// To identify precise Cordova platform. As of June, 2015, values of cordova.platformId are:
// amazon-fireos, android, blackberry10, browser, firefoxos, ios, osx, ubuntu, webos, windows, windowsphone, windows8
// See cordova.platformId definition here: https://github.com/apache/cordova-js/blob/master/src/cordova.js
// Example "id" definition: https://github.com/apache/cordova-android/blob/master/cordova-js-src/platform.js
// To detect Crosswalk, detect "android" and look for the word "Crosswalk" in the navigator.userAgent string.

// TODO: userAgent string detection, etc...

utl.getPlatformInfo = function(info) {
    "use strict" ;

    info.cordova = false ;          // true if running in Cordova webview, false if not, null if indeterminate
    if( window.Cordova )            // present in Cordova 2.9 and 3+
        info.cordova = (typeof window.Cordova === "object") ? true : null ;

    info.cordovaVersion = null ;    // Cordova version string, null if indeterminate or unavailable
    if( window.cordova && cordova.version )                 // Cordova 3.0+ version string
        info.cordovaVersion = cordova.version ;
    else if( window.device && device.cordova )              // old Cordova 2.x version detection
        info.cordovaVersion = device.cordova ;

    info.platform = null ;          // see list in comment header above (android, ios, etc.), null if indeterminate
    if( window.cordova && cordova.platformId )              // Cordova 3.1+ platform ID (see above)
        info.platform = cordova.platformId.toLowerCase() ;
    else if( window.device && device.platform )             // old Cordova 2.x platform detection
        info.platform = device.platform.toLowerCase() ;
//    else
//        platformInfo.cordovaVersion = navigator.userAgent.toLowerCase() ;       // backup plan :)
//    if( cordovaPlatform.indexOf("window") !== -1 ) // reminder...

    info.platformVersion = null ;   // platform version string, null if indeterminate or unavailable
    if( window.device && device.version )                   // old Cordova 2.x device version detection
        info.platformVersion = device.model ;               // requires device plugin in Cordova 3+

    info.platformModel = null ;     // platform model (Nexus, iPad, etc.), null if indeterminate or unavailable
    if( window.device && device.model )                     // old Cordova 2.x device model detection
        info.platformVersion = device.model ;               // requires device plugin in Cordova 3+

    info.browser = null ;           // true if running in browser, false if not, null if indeterminate

    info.simulator = null ;         // "[emulator|previewer|debugger|null]", null if indeterminate
    if( window.tinyHippos )         // must be in the Emulate tab (Ripple Emulator)
        info.simulator = "emulator" ;
//    else if( ...check for app preview... )
//    else if( ...check for APX... )
//    TODO: detect App Preview, Debug, Cordova app, Legacy container, etc.
//    TODO: detect navigator.platform, navigator.maxTouchPoints, navigator.language, navigator.hardwareConcurrency

    return info ;
} ;



// copy simple objects

function copyObject(objIn) {
    "use strict" ;
    var objOut = JSON.parse(JSON.stringify(objIn)) ;
    return objOut ;
}



// for printing console.log messages into HTML page directly as well as normal console
// TODO: need to handle other console methods, just console.log() for now...
// TODO: remove excess lines, https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
// TODO: http://stackoverflow.com/questions/11308239/console-log-wrapper-that-keeps-line-numbers-and-supports-most-methods
// NOTE: investigate above because this implementation hides file:ln on log message, which really sucks...

utl.orgConsoleLog = console.log ;
utl.orgTime = Date.now() ;

console.log = function() {
    "use strict" ;

    var args = Array.prototype.slice.call(arguments, 0) ;

    if( window.moment ) {
        args.unshift(moment().format("HH:mm:ss.SSS")) ;
    }
    else {
        args.unshift(((Date.now()-utl.orgTime)/1000).toFixed(3)) ;
    }
    utl.orgConsoleLog.apply(this,args) ;

    var text = args.join(" ") ;
    var node ;
    var el ;

    el = document.getElementById("id_textArea") ;
    if( el ) {
        node = document.createTextNode(text + "\n") ;
        el.appendChild(node) ;
    }

    el = document.getElementById("id_msgBar") ;
    if( el ) {
        node = document.createTextNode(text) ;
        el.replaceChild(node,el.childNodes[0]) ;
    }
} ;



// Function to disable "pull-to-refresh" effect present in some webviews.
// Especially Crosswalk 12 and above (Chromium 41+) runtimes.

// Adapted from this example: https://code.google.com/p/chromium/issues/detail?id=456515#c8
// Source: Copyright (c) 2015 by jdduke (http://jsbin.com/qofuwa/2/edit)
// Source: Released under the MIT license: http://jsbin.mit-license.org

// <input id="preventPullToRefresh"  type="checkbox">Prevent pull-to-refresh?</input>
// <input id="preventOverscrollGlow" type="checkbox">Prevent overscroll glow?</input>
// <input id="preventScroll"         type="checkbox">Prevent scroll?</input>

window.addEventListener('load', function() {
    "use strict" ;

//  var preventPullToRefreshCheckbox  = document.getElementById('preventPullToRefresh') ;
//  var preventOverscrollGlowCheckbox = document.getElementById("preventOverscrollGlow") ;
//  var preventScrollCheckbox         = document.getElementById("preventScroll") ;

    var lastTouchY = 0 ;
    var maybePreventPullToRefresh = false ;

    // Pull-to-refresh will only trigger if the scroll begins when the
    // document's Y offset is zero.

    var touchstartHandler = function(e) {
        if( e.touches.length != 1 ) {
            return ;
        }
        lastTouchY = e.touches[0].clientY ;
        // maybePreventPullToRefresh = (preventPullToRefreshCheckbox.checked) && (window.pageYOffset == 0) ;
        maybePreventPullToRefresh = (window.pageYOffset === 0) ;
    } ;

    // To suppress pull-to-refresh it is sufficient to preventDefault the
    // first overscrolling touchmove.

    var touchmoveHandler = function(e) {
        var touchY = e.touches[0].clientY ;
        var touchYDelta = touchY - lastTouchY ;
        lastTouchY = touchY ;

        if (maybePreventPullToRefresh) {
            maybePreventPullToRefresh = false ;
            if (touchYDelta > 0) {
                e.preventDefault() ;
                // console.log("pull-to-refresh event detected") ;
                return ;
            }
        }

        // if (preventScrollCheckbox.checked) {
        //     e.preventDefault() ;
        //     return ;
        // }

        // if (preventOverscrollGlowCheckbox.checked) {
        //     if (window.pageYOffset == 0 && touchYDelta > 0) {
        //         e.preventDefault() ;
        //         return ;
        //     }
        // }
    } ;

    document.addEventListener('touchstart', touchstartHandler, false) ;
    document.addEventListener('touchmove', touchmoveHandler, false) ;
}) ;



// use to print error messages to console.log() or alert()
// uncomment appropriate lines to get what you need...
// TODO: not yet debugged and tested

// window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
//     "use strict" ;
// //    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj) ;
// //    console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj) ;
// } ;
