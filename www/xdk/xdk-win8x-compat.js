/*
 * JavaScript Dynamic Content shim for Windows Store apps and window.alert() supplement.
 * ;paf; 2016-01-11, Only confirmed to work properly on Windows Phone 8.1 devices.
 *
 * Copyright © 2016, Paul Fischer, Intel Corporation. All rights reserved.
 * Licensed under the “BSD-3” license. <http://www.tldrlegal.com/l/bsd3>
 * https://software.intel.com/en-us/xdk/article/intel-html5-samples-license-terms-and-conditions
 */

/*jslint browser:true, devel:true, white:true, vars:true */
/*global MSApp:false, Windows:false */



if( window.MSApp && MSApp.execUnsafeLocalFunction ) {   // only execute if on a Windows webview platform...

/*
 * Copyright (c) 2014-2015, Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0. <https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)>
 * See https://github.com/MSOpenTech/winstore-jscompat for license information.
 */

(function () {

    // Some nodes will have an "attributes" property which shadows the Node.prototype.attributes property
    //  and means we don't actually see the attributes of the Node (interestingly the VS debug console
    //  appears to suffer from the same issue).

    var Element_setAttribute = Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute").value;
    var Element_removeAttribute = Object.getOwnPropertyDescriptor(Element.prototype, "removeAttribute").value;
    var HTMLElement_insertAdjacentHTMLPropertyDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "insertAdjacentHTML");
    var Node_get_attributes = Object.getOwnPropertyDescriptor(Node.prototype, "attributes").get;
    var Node_get_childNodes = Object.getOwnPropertyDescriptor(Node.prototype, "childNodes").get;
    var detectionDiv = document.createElement("div");

    function getAttributes(element) {
        return Node_get_attributes.call(element);
    }

    function setAttribute(element, attribute, value) {
        try {
            Element_setAttribute.call(element, attribute, value);
        } catch (e) {
            // ignore
        }
    }

    function removeAttribute(element, attribute) {
        Element_removeAttribute.call(element, attribute);
    }

    function childNodes(element) {
        return Node_get_childNodes.call(element);
    }

    function empty(element) {
        while (element.childNodes.length) {
            element.removeChild(element.lastChild);
        }
    }

    function insertAdjacentHTML(element, position, html) {
        HTMLElement_insertAdjacentHTMLPropertyDescriptor.value.call(element, position, html);
    }

    function inUnsafeMode() {
        var isUnsafe = true;
        try {
            detectionDiv.innerHTML = "<test/>";
        }
        catch (ex) {
            isUnsafe = false;
        }

        return isUnsafe;
    }

    function cleanse(html, targetElement) {
        var cleaner = document.implementation.createHTMLDocument("cleaner");
        empty(cleaner.documentElement);
        MSApp.execUnsafeLocalFunction(function () {
            insertAdjacentHTML(cleaner.documentElement, "afterbegin", html);
        });

        var scripts = cleaner.documentElement.querySelectorAll("script");
        Array.prototype.forEach.call(scripts, function (script) {
            switch (script.type.toLowerCase()) {
                case "":
                    script.type = "text/inert";
                    break;
                case "text/javascript":
                case "text/ecmascript":
                case "text/x-javascript":
                case "text/jscript":
                case "text/livescript":
                case "text/javascript1.1":
                case "text/javascript1.2":
                case "text/javascript1.3":
                    script.type = "text/inert-" + script.type.slice("text/".length);
                    break;
                case "application/javascript":
                case "application/ecmascript":
                case "application/x-javascript":
                    script.type = "application/inert-" + script.type.slice("application/".length);
                    break;

                default:
                    break;
            }
        });

        function cleanseAttributes(element) {
            var i, len, attribute ;
            var attributes = getAttributes(element);
            if (attributes && attributes.length) {
                // because the attributes collection is live it is simpler to queue up the renames
                var events;
                for (i = 0, len = attributes.length; i < len; i++) {
                    attribute = attributes[i];
                    var name = attribute.name;
                    if ((name[0] === "o" || name[0] === "O") &&
                        (name[1] === "n" || name[1] === "N")) {
                        events = events || [];
                        events.push({ name: attribute.name, value: attribute.value });
                    }
                }
                if (events) {
                    for (i = 0, len = events.length; i < len; i++) {
                        attribute = events[i];
                        removeAttribute(element, attribute.name);
                        setAttribute(element, "x-" + attribute.name, attribute.value);
                    }
                }
            }
            var children = childNodes(element);
            for (i = 0, len = children.length; i < len; i++) {
                cleanseAttributes(children[i]);
            }
        }
        cleanseAttributes(cleaner.documentElement);

        var cleanedNodes = [];

        if (targetElement.tagName === 'HTML') {
            cleanedNodes = Array.prototype.slice.call(document.adoptNode(cleaner.documentElement).childNodes);
        } else {
            if (cleaner.head) {
                cleanedNodes = cleanedNodes.concat(Array.prototype.slice.call(document.adoptNode(cleaner.head).childNodes));
            }
            if (cleaner.body) {
                cleanedNodes = cleanedNodes.concat(Array.prototype.slice.call(document.adoptNode(cleaner.body).childNodes));
            }
        }

        return cleanedNodes;
    }

    function cleansePropertySetter(property, setter) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, property);
        var originalSetter = propertyDescriptor.set;
        Object.defineProperty(HTMLElement.prototype, property, {
            get: propertyDescriptor.get,
            set: function (value) {
                if(window.WinJS && window.WinJS._execUnsafe && inUnsafeMode()) {
                    originalSetter.call(this, value);
                } else {
                    var that = this;
                    var nodes = cleanse(value, that);
                    MSApp.execUnsafeLocalFunction(function () {
                        setter(propertyDescriptor, that, nodes);
                    });
                }
            },
            enumerable: propertyDescriptor.enumerable,
            configurable: propertyDescriptor.configurable,
        });
    }

    cleansePropertySetter("innerHTML", function (propertyDescriptor, target, elements) {
        empty(target);
        for (var i = 0, len = elements.length; i < len; i++) {
            target.appendChild(elements[i]);
        }
    });

    cleansePropertySetter("outerHTML", function (propertyDescriptor, target, elements) {
        for (var i = 0, len = elements.length; i < len; i++) {
            target.insertAdjacentElement("afterend", elements[i]);
        }
        target.parentNode.removeChild(target);
    });

}());

}



if( window.MSApp ) {    // only define in a Windows webview...

/*
 * Stack Exchange Inc User Contribution licensed under cc by-sa 3.0 with attribution required
 * Licensed under CC-SA 3.0 <https://tldrlegal.com/license/creative-commons-attribution-share-alike-(cc-sa)>
 * Stack Exchange post > http://stackoverflow.com/a/13655351/2914328
 * Stack Exchange user > http://stackoverflow.com/users/9475/dominic-hopton
 *
 * Needed to supplement for lack of window.alert() on Windows using Windows.UI.Popups.MessageDialog():
 *
 * (new Windows.UI.Popups.MessageDialog("Content", "Title")).showAsync().done() ;
 *
 * You should be aware that:
 *  - This is not blocking like the familiar window.alert() function.
 *  - Because it's not blocking you may not show multiple messages boxes; this isn't allowed.
 *  - Implementation queues up multiple messages to try to simulate alert() blocking behavior.
 */

(function () {
    var alertsToShow = [];
    var dialogVisible = false;

    function showPendingAlerts() {
        if (dialogVisible || !alertsToShow.length) {
            return;
        }

        dialogVisible = true;
        (new Windows.UI.Popups.MessageDialog(alertsToShow.shift())).showAsync().done(function () {
            dialogVisible = false;
            showPendingAlerts();
        }) ;
    }

    window.alert = function (message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }

        alertsToShow.push(message);
        showPendingAlerts();
    } ;
})();

}
