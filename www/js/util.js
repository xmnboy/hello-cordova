/*
 * Copyright (c) 2013-2015, Paul Fischer, Intel Corporation. All rights reserved.
 * Please see http://software.intel.com/html5/license/samples
 * and the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, moment:false */



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



// copy simple objects

function copyObject(objIn) {
    "use strict" ;
    var objOut = JSON.parse(JSON.stringify(objIn)) ;
    return objOut ;
}



// for printing console.log messages into HTML page directly as well as normal console
// TODO: need to handle other console methods, just console.log() for now...
// TODO: remove excess lines, https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
// NOTE: this implementation hides file:ln on log message, which really sucks...
// TODO: http://stackoverflow.com/questions/11308239/console-log-wrapper-that-keeps-line-numbers-and-supports-most-methods

var orgConsoleLog = console.log ;
var orgTime = Date.now() ;
console.log = function() {
    "use strict" ;

    var args = Array.prototype.slice.call(arguments, 0) ;

    if( window.moment ) {
        args.unshift(moment().format("HH:mm:ss.SSS")) ;
    }
    else {
        args.unshift(((Date.now()-orgTime)/1000).toFixed(3)) ;
    }
    orgConsoleLog.apply(this,args) ;

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



// use to print error messages to console.log() or alert()
// uncomment appropriate lines to get what you need...
// TODO: not yet debugged and tested

// window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
//     "use strict" ;
// //    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj) ;
// //    console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj) ;
// } ;
