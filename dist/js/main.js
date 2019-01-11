(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "general": {
        "language": "english",
        "loader": {
            "text": "Getting data..."
        },
        "carousel": {
            "visible": true,
            "animate": true,
            "time": 10000
        },
        "search": {
            "tags": {
                "visible": false
            },
            "filters": {
                "visible": false
            },
            "visible": true
        },
        "halfway_menu": {
            "visible": true
        },
        "footer": {
            "logo": "crop_ontology_white.png",
            "background": "footer-background_399395-PCOQ5H-624.png",
            "description": "A tool for Breeders and Agronomists to harmonize the capture of field data, ease fieldbook creation, and facilitate data modeling",
            "visible": true
        },
        "license": {
            "text": "Crop Ontology by Integrated Breeding Platform is licensed under a <a href=\"https://creativecommons.org/licenses/by/4.0/\" target=\"_blank\">Creative Commons Attribution 4.0 International License</a>"
        }
    },
    "404": {
        "title": "Page not found",
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "home": {
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        },
        "sections": {
            "help": {
                "title": "Instructions to develop a new ontology",
                "items_per_page": null,
                "read_more_button": {
                    "visible": false,
                    "label": ""
                },
                "visible": true
            },
            "news": {
                "title": "Latest news",
                "items_per_page": 3,
                "read_more_button": {
                    "visible": true,
                    "label": "Read more..."
                },
                "visible": true
            },
            "ontologies": {
                "title": "Ontologies",
                "items_per_page": 10,
                "read_more_button": {
                    "visible": true,
                    "label": "All ontologies ›"
                },
                "visible": true
            }
        }
    },
    "latest": {
        "title": "Latest Ontologies and Terms",
        "visible": true,
        "carousel": {
            "visible": false,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "about": {
        "title": "About the Project",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "privacy-policy": {
        "title": "Privacy policy",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "credit_Bioversity International_J.van de Gevel.jpg"
            }]
        }
    },
    "API": {
        "title": "API",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "contact-us": {
        "title": "Contact us",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "feedback": {
        "title": "Feedback",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "add-ontology": {
        "title": "Add new terms",
        "visible": true,
        "carousel": {
            "visible": true,
            "items": [{
                "message": "",
                "image": "cowpea.jpg"
            }]
        }
    },
    "ontology": {
        "title": "",
        "visible": true,
        "carousel": {
            "visible": false,
            "items": [{
                "message": "",
                "image": ""
            }]
        }
    },
    "terms": {
        "title": "",
        "visible": true,
        "carousel": {
            "visible": false,
            "items": [{
                "message": "",
                "image": ""
            }]
        }
    },
    "register": {
        "title": "Register",
        "visible": true,
        "carousel": {
            "visible": false,
            "items": [{
                "message": "",
                "image": ""
            }]
        }
    },
    "forgot-password": {
        "title": "Forgot password",
        "visible": true,
        "carousel": {
            "visible": false,
            "items": [{
                "message": "",
                "image": ""
            }]
        }
    }
}

},{}],2:[function(require,module,exports){
module.exports={
	"default": "english",
	"all": [
		"english",
		"french",
		"spanish",
		"chinese",
		"portugese"
	],
	"iso": {
		"EN": "english",
		"FR": "french",
		"ES": "spanish",
		"CN": "chinese",
		"PT": "portugese"
	},
	"getIso": {
		"english":"EN",
		"undefined":"EN",
		"french":  "FR",
		"spanish": "ES",
		"chinese": "CN",
		"portugese":"PT"
	}
}

},{}],3:[function(require,module,exports){
module.exports={
    "menu": {
        "sidenav": {
            "position": "right",
            "items": [
                {
                    "label": "Home",
                    "link": "./",
                    "display": true
                },
                {
                    "label": "About",
                    "link": "./about",
                    "display": true
                },
                {
                    "label": "Add new terms",
                    "link": "./add-ontology",
                    "display": true
                },
                {
                    "label": "API",
                    "link": "./api",
                    "display": false
                },
                {
                    "label": "Agtrials",
                    "link": "./agtrials",
                    "display": false
                },
                {
                    "label": "Annotation Tool",
                    "link": "./annotation-tool",
                    "display": false
                },
                { "separator": true },
                {
                    "label": "Login",
                    "link": "#user_modal",
                    "class": "modal-trigger",
                    "display": true
                },
                {
                    "label": "Register",
                    "link": "./register",
                    "display": true
                }
            ]
        },
        "top_menu": {
            "position": "right",
            "class": "",
            "items": [
                {
                    "label": "Home",
                    "link": "./",
                    "display": true,
                    "is_sidenav_link": false
                },
                {
                    "label": "About",
                    "link": "./about",
                    "display": true,
                    "is_sidenav_link": false
                },
                {
                    "label": "Add new terms",
                    "link": "./add-ontology",
                    "display": true,
                    "is_sidenav_link": false
                },
                {
                    "label": "API",
                    "link": "./api",
                    "display": false,
                    "is_sidenav_link": false
                },
                {
                    "label": "Agtrials",
                    "link": "./agtrials",
                    "display": false,
                    "is_sidenav_link": false
                },
                {
                    "label": "Annotation Tool",
                    "link": "./annotation-tool",
                    "display": false,
                    "is_sidenav_link": false
                },
                { "separator": true },
                {
                    "label": "Login",
                    "link": "#user_modal",
                    "class": "modal-trigger",
                    "display": true,
                    "is_sidenav_link": false
                },
                { "separator": "or" },
                {
                    "label": "Register",
                    "link": "./register",
                    "display": true,
                    "is_sidenav_link": false
                },
                {
                    "link": "javascript:;",
                    "data": {
                        "activates": "sidenav"
                    },
                    "class": "button-collapse black-text",
                    "display": true,
                    "is_sidenav_link": true
                }
            ]
        },
        "halfway_menu": {
            "position": "center",
            "class": "",
            "items": [
                {
                    "label": "Contact us",
                    "link": "./contact-us",
                    "display": true
                },
                {
                    "label": "API",
                    "link": "./API",
                    "display": true
                },
                {
                    "label": "Feedback",
                    "link": "./feedback",
                    "display": true
                }
            ]
        },
        "footer_menu": {
            "items": [
                {
                    "title": "&nbsp;",
                    "position": "left_menu",
                    "class": "",
                    "items": [
                        {
                            "label": "Home",
                            "link": "./",
                            "display": true
                        },
                        { "separator": "" },
                        {
                            "label": "About",
                            "link": "./about",
                            "display": true
                        },
                        {
                            "label": "Blog",
                            "link": "./blog",
                            "display": true
                        },
                        {
                            "label": "API",
                            "link": "./api",
                            "display": false
                        },
                        {
                            "label": "Agtrials",
                            "link": "./agtrials",
                            "display": false
                        },
                        {
                            "label": "Annotation Tool",
                            "link": "./annotation-tool",
                            "display": false
                        },
                        {
                            "label": "All ontologies",
                            "link": "./all-ontologies",
                            "display": false
                        },
                        {
                            "label": "Contact us",
                            "link": "./contact-us",
                            "display": true
                        },
                        {
                            "label": "Feedback",
                            "link": "./feedback",
                            "display": true
                        },
                        {
                            "label": "Privacy policy",
                            "link": "./privacy-policy",
                            "display": true
                        }
                    ]
                },
                {
                    "title": "Related sites",
                    "position": "center_menu",
                    "class": "",
                    "items": [
                        {
                            "label": "Integrated Breeding Platform",
                            "link": "https://www.integratedbreeding.net",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Bioversity International",
                            "link": "http://www.bioversityinternational.org",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "NSF (National Science Foundation) -  cROP: Common Reference Ontologies and Applications for Plant Biology",
                            "link": "https://www.nsf.gov/awardsearch/showAward?AWD_ID=1340112",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Planteome",
                            "link": "http://www.planteome.org",
                            "display": true,
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "title": "Follow us",
                    "position": "right_menu",
                    "class": "horizontal",
                    "items": [
                        {
                            "label": "Github",
                            "link": "https://github.com/bioversity/Crop-Ontology/",
                            "display": true,
                            "target": "_blank",
                            "icon": "fab fa-github fa-2x"
                        },
                        {
                            "label": "Youtube",
                            "link": "https://www.youtube.com/channel/UC1HBPf5qzcR6YGaAh-3TzNg",
                            "display": true,
                            "target": "_blank",
                            "icon": "fab fa-youtube fa-2x"
                        },
                        {
                            "label": "Crop Ontology Community Website",
                            "link": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/",
                            "display": true,
                            "target": "_blank",
                            "icon": "fas fa-newspaper fa-2x"
                        }
                    ]
                }
            ]
        },
        "bottom_links": {
            "items": [
                {
                    "title": "",
                    "position": "left",
                    "class": "",
                    "items": [
                        {
                            "label": "Integrated Breeding Platform",
                            "link": "https://www.integratedbreeding.net",
                            "image": "ibp.png",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Bioversity International",
                            "link": "http://www.bioversityinternational.org",
                            "image": "bioversity_small.png",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "NSF (National Science Foundation) -  cROP: Common Reference Ontologies and Applications for Plant Biology",
                            "link": "https://www.nsf.gov/awardsearch/showAward?AWD_ID=1340112",
                            "image": "nsf.jpg",
                            "display": true,
                            "target": "_blank"
                        },
                        {
                            "label": "Planteome",
                            "link": "http://www.planteome.org",
                            "image": "planteome.png",
                            "display": true,
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "title": "Bottom Heading",
                    "position": "right",
                    "class": "",
                    "items": [
                        {
                            "label": "Platform for Big Data in Agricolture",
                            "link": "https://www.cgiar.org/research/program-platform/platform-for-big-data-in-agriculture/",
                            "image": "big-data_platform_logo.png",
                            "display": true,
                            "target": "_blank"
                        }
                    ]
                }
            ]
        }
    }
}

},{}],4:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

var _actions = require("../../src/es6/_actions.es6");

var _actions2 = _interopRequireDefault(_actions);

var _layout = require("../../src/es6/layout.es6");

var _layout2 = _interopRequireDefault(_layout);

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

// // import ColorCanvas from "../../src/es6/ColorCanvas.es6";
// import ColorPicker from "../../src/es6/ColorPicker.es6";
// import Pantone from "../../src/es6/PANTONE.es6";

require("../../src/es6/_obj.es6");

var LAYOUT = new _layout2.default(),
    ACTIONS = new _actions2.default(),
    NAV = new _navigation2.default(),
    page = NAV.get_page(),
    settings = require("../../common/settings/contents.json");

// $.noConflict();
$(document).ready(function () {
	// Build the <header> object
	LAYOUT.build_header();
	// Build the top carousel
	LAYOUT.build_carousel();
	// Build the search bar
	LAYOUT.build_searchbar();
	if (page == "home") {
		// Build the halfway menu
		LAYOUT.build_halfway_menu();
		// Build the contents section
		LAYOUT.build_contents_section();
	} else {
		// Build the contents section
		LAYOUT.build_contents_section();
		// Build the halfway menu
		LAYOUT.build_halfway_menu();
	}
	// Build the footer
	LAYOUT.build_footer();

	// Load scripts
	LAYOUT.load_scripts();

	LAYOUT.activate();
});

},{"../../common/settings/contents.json":1,"../../src/es6/_actions.es6":8,"../../src/es6/_navigation.es6":9,"../../src/es6/_obj.es6":10,"../../src/es6/layout.es6":15}],5:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.5+7f2b526d
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":7}],6:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date = new Date(y, m, d, h, M, s, ms);

        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return isArray(this._weekdays) ? this._weekdays :
                this._weekdays['standalone'];
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.22.2';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'YYYY-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));

},{}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAV = new _navigation2.default(),
    page = NAV.get_page();

var actions = function actions() {
    _classCallCheck(this, actions);
};

exports.default = actions;

},{"../../src/es6/_navigation.es6":9}],9:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var navigation = function () {
	function navigation() {
		_classCallCheck(this, navigation);
	}

	_createClass(navigation, [{
		key: "get_url_path",

		/**
  * Get the path of the current URL
  * @return array															The page path
  */
		value: function get_url_path() {
			var url = window.location.pathname.split(/(?:\/|\:)+/).splice(1),
			    path = [];

			$.each(url, function (k, v) {
				path.push(decodeURIComponent(v));
			});
			return path;
		}

		/**
   * Get the current page from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_page",
		value: function get_page() {
			var page = this.get_url_path()[0];
			return page == "" ? "home" : page;
		}

		/**
   * ONTOLOGY
   * -------------------------------------------------------------------------
   */

		/**
   * The Ontology URL performed by regex
   * @see https://regex101.com/r/S4gNgj/4
   *
   * @param string						separator							The string separator
   */

	}, {
		key: "get_ontology_url_regex",
		value: function get_ontology_url_regex(separator) {
			var id = "([\\w]+\\_[\\w\\d]+)",
			    label = "(.*)";
			return new RegExp(id + "\\" + separator + label, "g");
		}

		/**
   * The Ontology Term URL performed by regex
   * @see https://regex101.com/r/S4gNgj/5
   *
   * @param string						separator							The string separator
   */

	}, {
		key: "get_terms_url_regex",
		value: function get_terms_url_regex(separator) {
			var id = "([\\w]+\\_[\\w\\d]+)",
			    label = "(.*)";
			return new RegExp(id + "\\" + separator + label + separator + label, "g");
		}

		/**
   * Get the Ontology ID from the current URL
   * @uses get_url_path()
   *
   * @return string															The Ontology ID
   */

	}, {
		key: "get_ontology_id",
		value: function get_ontology_id() {
			return this.get_url_path()[1] !== undefined ? this.get_url_path()[1] : "";
		}

		/**
   * Get the Ontology Term ID from the current URL
   * @uses get_url_path()
   *
   * @return string															The Term ID
   */

	}, {
		key: "get_term_id",
		value: function get_term_id() {
			return this.get_url_path()[2] !== undefined ? this.get_url_path()[2] : "";
		}

		/**
   * Get the Ontology and the Ontology Term ID from the current URL
   *
   * @return string															The Ontology and the Ontology Term ID
   */

	}, {
		key: "get_full_id",
		value: function get_full_id() {
			return this.get_page() == "terms" ? this.get_url_path()[1] + ":" + this.get_url_path()[2] : this.get_url_path()[1];
		}

		/**
   * Get the Ontology label from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_ontology_label",
		value: function get_ontology_label() {
			return this.get_url_path()[2] !== undefined ? this.get_url_path()[2] : "...";
		}

		/**
   * Get the Ontology Term label from the current URL
   * @uses get_url_path()
   *
   * @return string															The current page
   */

	}, {
		key: "get_term_label",
		value: function get_term_label() {
			return this.get_url_path()[3] !== undefined ? this.get_url_path()[3] : "";
		}
	}]);

	return navigation;
}();

exports.default = navigation;

},{}],10:[function(require,module,exports){
'use strict';
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$.fn.serializeObject = function () {
    var o = {},
        a = this.serializeArray();

    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};

var obj = function obj() {
    _classCallCheck(this, obj);
};

exports.default = obj;

},{}],11:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var settings = require("../../common/settings/contents.json");

var str = function () {
	function str() {
		_classCallCheck(this, str);
	}

	_createClass(str, [{
		key: "ucfirst",

		/**
   * Make a string's first character uppercase
   * This function is very similar to PHP ucfirst()
   * @see http://php.net/manual/en/function.ucfirst.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */
		value: function ucfirst(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		/**
   * Make a string's first character lowercase
   * This function is very similar to PHP lcfirst()
   * @see http://php.net/manual/en/function.lcfirst.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "lcfirst",
		value: function lcfirst(string) {
			return string.charAt(0).toLowerCase() + string.slice(1);
		}

		/**
   * Uppercase the first character of each word in a string
   * This function is very similar to PHP ucwords()
   * @see http://php.net/manual/en/function.ucwords.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "ucwords",
		value: function ucwords(string) {
			return (string + "").replace(/^(.)|\s+(.)/g, function ($1) {
				return $1.toUpperCase();
			});
		}

		/**
   * Quote string with slashes
   * This function is very similar to PHP addslashes()
   * @see http://php.net/manual/en/function.addslashes.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "addslashes",
		value: function addslashes(string) {
			return string.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0');
		}

		/**
   * Un-quotes a quoted string
   * This function is very similar to PHP stripslashes()
   * @see http://php.net/manual/en/function.stripslashes.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "stripslashes",
		value: function stripslashes(string) {
			return string.replace(/\\'/g, '\'').replace(/\\"/g, '"').replace(/\\:/g, ':').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
		}

		/**
   * Inserts HTML line breaks before all newlines in a string
   * This function is very similar to PHP nl2br()
   * @see http://php.net/manual/en/function.nl2br.php
   *
   * @param  string 							string							The input string
   * @return string															The converted string
   */

	}, {
		key: "nl2br",
		value: function nl2br(string) {
			return string.replace(/(\r\n|\n\r|\r|\n)/g, "<br />");
		}

		/**
   * Pluralize a string
   * @param  integer 							items							The amount of items
   * @param  string 							string							The string to pluralize
   * @return The pluralized string
   */

	}, {
		key: "pluralize",
		value: function pluralize(items, string) {
			return items !== 1 ? string + "s" : string;
		}

		/**
   * Check wheter a given string is a JSON
   * @param  string 							string							The string to analyze
   * @return boolean
   */

	}, {
		key: "is_json",
		value: function is_json(string) {
			try {
				JSON.parse(string);
			} catch (e) {
				return false;
			}
			return true;
		}
	}, {
		key: "is_url",
		value: function is_url(string) {
			return string.startsWith("http");
		}
	}, {
		key: "camel_case_2_text",
		value: function camel_case_2_text(string) {
			return string.replace(/([a-z])([A-Z])/g, "$1 $2");
		}
	}, {
		key: "readable_data",
		value: function readable_data(string) {
			return this.camel_case_2_text(string.replace("_", " "));
		}

		/**
   * 								ONTOLOGIES
   * -------------------------------------------------------------------------
   */

		/**
   * Split a multiline string by a given separator, then get the first line
   * NOTE: If not provided the separator is a comma ","
   * @param  string 							string							The string to split
   * @param  string 							split_by						The separator to split
   * @return string															The extracted string
   */

	}, {
		key: "extract_text",
		value: function extract_text(string, split_by) {
			if (split_by == undefined) {
				split_by = ",";
			}
			var string_part = $.trim($(string).text()).split(split_by)[0] + ".";
			return string_part.split("\n")[0];
		}

		/**
   * Get all languages in a JSON string
   * @param  string 							string							The string to analyze
   * @return array|string														All collected languages
   */

	}, {
		key: "get_ontologies_languages",
		value: function get_ontologies_languages(string) {
			var _this = this;

			var langs = [];
			if (this.is_json(string)) {
				$.each(JSON.parse(string), function (lang, name) {
					langs.push(_this.ucfirst(lang));
				});
			} else {
				langs.push("English");
			}
			return langs.length == 1 ? langs[0] : langs;
		}

		/**
   * Extract a string from a JSON string
   * The Crop Onlogy API often provide a JSON language string.
   * This method extract the string value from that JSON string
   * @example `{"english": "Text in english"}`
   *
   * @param  string 							string							The string to analyze
   * @param  string 							language						The preferred language
   * @return string															The extracted string
   */

	}, {
		key: "get_ontology_term",
		value: function get_ontology_term(string, language) {
			var _this2 = this;

			language = language == undefined || language == "undefined" ? settings.general.language : language;

			var strings = {};
			if (this.is_json(string)) {
				$.each(JSON.parse(string), function (lang, term) {
					lang = lang == undefined || lang == "undefined" ? settings.general.language : lang;
					strings[lang] = _this2.ucfirst(term);
				});
			} else {
				strings[language] = string;
			}
			return strings[language];
		}

		/**
   * Extract the language from a JSON string
   * The Crop Onlogy API often provide a JSON language string.
   * This method extract the string value from that JSON string
   * @example `{"english": "Text in english"}`
   *
   * @param  string 							string							The string to analyze
   * @return string															The language string
   */

	}, {
		key: "get_ontology_term_language",
		value: function get_ontology_term_language(string) {
			var langs = [],
			    language = settings.general.language;

			var strings = {};
			if (this.is_json(string)) {
				$.each(JSON.parse(string), function (lang, term) {
					langs.push(lang == undefined || lang == "undefined" ? language : lang);
				});
			} else {
				langs.push(language);
			}
			return langs[0];
		}
	}]);

	return str;
}();

exports.default = str;

},{"../../common/settings/contents.json":1}],12:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _loader = require("../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
    LOADER = new _loader2.default(),
    STR = new _str2.default(),
    page = NAV.get_page(),
    moment = require("moment"),
    settings = require("../../common/settings/contents.json"),
    languages = require("../../common/settings/languages.json");

var treeview = function () {
	function treeview() {
		_classCallCheck(this, treeview);
	}

	_createClass(treeview, [{
		key: "tree_icon",
		value: function tree_icon(is_subroot, id) {
			var _this = this;

			var icon_class = is_subroot ? "expandable-hitarea lastExpandable-hitarea" : "",
			    build_tree = function build_tree($li, id, callback) {
				$li.append($('<ul>'));

				DATA.get_children(id).then(function (child) {
					$.each(child, function (k, v) {
						var li_class = "",
						    div_class = "";

						if (v.has_children) {
							if (k == child.length - 1) {
								li_class = "last expandable lastExpandable";
								div_class = "hitarea lastExpandable-hitarea";
							} else {
								li_class = "";
								div_class = "hitarea expandable-hitarea";
							}
						} else {
							if (k == child.length - 1) {
								li_class = "last";
								div_class = "";
							} else {
								li_class = "";
								div_class = "";
							}
						}
						var $tree_icon = $('<div>', { "class": div_class }).click(function (e) {
							action(e, v.id);
						});

						$li.find("ul").append($('<li>', {
							"class": li_class
						}).append($tree_icon).append(_this.button({
							id: v.id,
							term: STR.ucfirst(DATA.extract_name(v.name)),
							source: v,
							is_root: false
						})).append($('<span>', { "class": "relationship " + v.relationship, "title": "Relationship: `" + v.relationship + "`" }).text(v.relationship)));
					});

					if (typeof callback == "function") {
						callback(child);
					}
				});
			},


			/**
    * Toggle icon status
    * @param  object 					e								The fired button object
    */
			toggleIcon = function toggleIcon(e) {
				var $li = $(e.currentTarget).closest("li"),
				    $li_ul = $li.find("ul");
				if ($li_ul.length == 0 || !$li_ul.is(":visible")) {
					// "expandable" to "collapsible"
					// -------------------------------------------------------------
					// LI
					if ($li.hasClass("expandable")) {
						$li.removeClass("expandable").addClass("collapsable");
					}
					if ($li.hasClass("lastExpandable")) {
						$li.removeClass("lastExpandable").addClass("lastCollapsable");
					}
					// DIV
					if ($(e.currentTarget).hasClass("expandable-hitarea")) {
						$(e.currentTarget).removeClass("expandable-hitarea").addClass("collapsable-hitarea");
					}
					if ($(e.currentTarget).hasClass("lastExpandable-hitarea")) {
						$(e.currentTarget).removeClass("lastExpandable-hitarea").addClass("lastCollapsable-hitarea");
					}
				} else {
					// "collapsible" to "expandable"
					// -------------------------------------------------------------
					// LI
					if ($li.hasClass("collapsable")) {
						$li.removeClass("collapsable").addClass("expandable");
					}
					if ($li.hasClass("lastCollapsable")) {
						$li.removeClass("lastCollapsable").addClass("lastExpandable");
					}
					// DIV
					if ($(e.currentTarget).hasClass("collapsable-hitarea")) {
						$(e.currentTarget).removeClass("collapsable-hitarea").addClass("expandable-hitarea");
					}
					if ($(e.currentTarget).hasClass("lastCollapsable-hitarea")) {
						$(e.currentTarget).removeClass("lastCollapsable-hitarea").addClass("lastExpandable-hitarea");
					}
				}
			},
			    get_obj_ids = function get_obj_ids(obj) {
				var ids = [];
				$.each(obj, function (kk, vv) {
					ids.push(vv.id);
				});
				return ids;
			},


			/**
    * Buttons action
    * @param  object 					e								The fired button object
    * @param  string 					id								The ontology or term ID
    */
			action = function action(e, id) {
				var $li = $(e.currentTarget).closest("li"),
				    $li_ul = $li.find("ul");

				if ($li_ul.length == 0 || !$li_ul.is(":visible")) {
					/**
      * Expanded tree
      * ---------------------------------------------------------
      */

					toggleIcon(e);

					// If is the first page loading
					if ($li_ul.length == 0) {
						// Display loader
						$("#treeview_container").prepend(LOADER.create({ target: "#treeview_container", type: "progress" }));

						// If this is a Ontology Term page
						if (page == "terms" && NAV.get_term_id() !== undefined) {
							/**
       * Highlight the label on the right
       */
							$(".treeview a.selected").removeClass("selected");
							DATA.get_term_parents(NAV.get_full_id()).then(function (data) {
								$.each(data[0], function (kk, vv) {
									var selected_ids = get_obj_ids(data[0]),
									    first_item = data[0][kk],
									    $item_li = $("." + first_item.id.replace(":", "-")).closest("li").last();
									// let $button = $("." + first_item.id.replace(":", "-")),
									// 	$prev_tree_icon = $button.prev();
									if ($item_li.length > 0) {
										build_tree($item_li, first_item.id, function (child_data) {
											$.each(child_data, function (child_key, child) {
												// console.warn(child.id, $.inArray(child.id, selected_ids));
												if ($.inArray(child.id, selected_ids) > -1) {
													var $child_li = $("." + child.id.replace(":", "-")).closest("li").last();

													console.warn(selected_ids[selected_ids.length - 1], child.id);
													if (selected_ids[selected_ids.length - 1] == child.id) {
														var $button = $("." + child.id.replace(":", "-"));

														$button.click();

														// Hide the loader
														LOADER.hide("#treeview_container .progress");
														return false;
													} else {
														console.info(selected_ids);
														// console.warn(selected_ids[child_key], selected_ids[selected_ids.length - 1], child.id);
														build_tree($child_li, child.id, function (sub_child_data) {
															$.each(sub_child_data, function (subchild_key, subchild) {
																// console.warn(child.id, $.inArray(child.id, selected_ids));
																if ($.inArray(subchild.id, selected_ids) > -1) {
																	console.log(subchild);
																	var $subchild_li = $("." + child.id.replace(":", "-")).closest("li").last();

																	console.error(subchild.id);
																	if (selected_ids[selected_ids.length - 1] == subchild.id) {
																		var _$button = $("." + subchild.id.replace(":", "-"));

																		_$button.click();

																		// Hide the loader
																		LOADER.hide("#treeview_container .progress");
																		return false;
																		// } else {
																		// 	console.log("continue");
																		// 	build_tree($child_li, child.id, (sub_child_data) => {
																		// 		$.each(sub_child_data, (subchild_key, subchild) => {
																		// 			console.warn(sub_child.id);
																		// 		});
																		// 	});
																	}
																}
																// $.each(data[0], (kk, vv) => {
																// 	if(vv.id == kv.id) {
																// 		console.log($li);
																// 		console.log($("." + vv.id.replace(":", "-")).closest("li"));
																// 	}
																// });
															});
														});
													}
												}
												// $.each(data[0], (kk, vv) => {
												// 	if(vv.id == kv.id) {
												// 		console.log($li);
												// 		console.log($("." + vv.id.replace(":", "-")).closest("li"));
												// 	}
												// });
											});
										});
										// $button.addClass("selected");
										// $prev_tree_icon.click();

										// if(kk == 0) {
										// return false;
										// }
									}
								});
								// let $button = $("." + data[0][1].id.replace(":", "-")),
								// 	$tree_icon = $button.prev();

								// console.info(data[0][1]);

								// $.each(data[0], (k, v) => {
								// 	if(k > 0) {

								// setTimeout(() => {
								// console.log(e);
								// }, 1000);
								// return false;
								// 	}
								// });
								//
								// $.each($li.find(".btn-mini"), (k, v) => {
								// 	let term_id = $(v).data("id"),
								// 		$tree_icon = $(v).prev();
								// 	console.log();
								// })
							});
							// return false;
							// $li.find("a").first().addClass("selected");
						} else {
							// Load childrens
							build_tree($li, id, function () {
								var $button = $("." + id.replace(":", "-"));
								$button.click();

								// Hide the loader
								LOADER.hide("#treeview_container .progress");
							});
						}

						// if(page == "terms") {
						// 	/**
						// 	 * Highlight the label on the right
						// 	 */
						// 	$(".treeview a.selected").removeClass("selected");
						// 	DATA.get_term_parents(NAV.get_full_id()).then((data) => {
						// 		$.each(data[0], (k, v) => {
						// 			console.log(k, v);
						// 		});
						// 		let $button = $("." + data[0][1].id.replace(":", "-")),
						// 			$tree_icon = $button.prev();
						//
						// 		$tree_icon.click();
						// 		$($button).addClass("selected");
						// 		console.info(data[0][1]);
						//
						// 		// $.each(data[0], (k, v) => {
						// 		// 	if(k > 0) {
						//
						// 				// setTimeout(() => {
						// 				// console.log(e);
						// 				// }, 1000);
						// 				// return false;
						// 		// 	}
						// 		// });
						//         //
						// 		// $.each($li.find(".btn-mini"), (k, v) => {
						// 		// 	let term_id = $(v).data("id"),
						// 		// 		$tree_icon = $(v).prev();
						// 		// 	console.log();
						// 		// })
						// 		return false;
						// 	})
						// 	// $li.find("a").first().addClass("selected");
						// }
					} else {
						$li_ul.show();
						// Hide the loader
						LOADER.hide("#treeview_container .progress");
					}
				} else {
					/**
      * Unexpanded tree
      * ---------------------------------------------------------
      */

					toggleIcon(e);
					// $(".treeview a.selected").removeClass("selected");
					$li_ul.hide();
					$(e.target).closest("ul").closest("li.expandable").find("a").first().addClass("selected");
				}
			};

			return $('<div>', { "class": "hitarea " + icon_class })
			// Simulate the click on the first "hitarea"
			// just a first opening of the tree
			.click(function (e) {
				console.log(_this);
				action(e, id);
			});
		}
	}, {
		key: "page_info_btn__actions",
		value: function page_info_btn__actions() {
			var _this2 = this;

			$("#page_info .btn-mini, #page_info .card-action .btn").on("click", function (e) {
				e.preventDefault();

				var $dd = void 0,
				    $dd2 = void 0,
				    $dl = $("#page_info dl"),
				    term_id = "",
				    key = "",
				    language = "english",
				    old_value = "",
				    placeholder = "Attribute name",
				    context = "add";

				if (!$(e.target).hasClass("add_term")) {
					$dd = $(e.target).closest("dd"), $dd2 = $dd.clone(), term_id = $dd2.find("a").data("term_id"), key = $dd2.find("a").data("key"), language = $dd2.find("a").data("language"), old_value = $.trim($dd2.text()), placeholder = old_value, context = "edit";
				}

				var $form = $('<form>', { "method": "post", "enctype": "multipart/form-data", "action": "", "id": "form" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12 switch" }).append($('<label>').append("Text").append($('<input>', { "type": "checkbox" })).append($('<span>', { "class": "lever" })).append("File")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field inline col s3" }).append($('<select>', { "class": "visible_input", "name": "language" }).append($.map(languages.all, function (v, k) {
					return $('<option>', { "value": v, "selected": v == languages.default }).text(STR.ucfirst(v));
				})))).append($('<div>', { "class": "input-field inline col s9" }).append($('<input>', { "type": "hidden", "name": "term_id" }).val(term_id)).append($('<input>', { "type": "hidden", "name": "key" }).val(key)).append($('<input>', { "type": "hidden", "name": "language" }).val(language)).append($('<input>', { "type": "text", "class": "text_input visible_input", "name": "value", "placeholder": placeholder }).val(old_value)).append($('<div>', { "class": "file-field input-field" }).append($('<div>', { "class": "btn highlight-btn btn-mini" }).append($('<span>').text("Upload file")).append($('<input>', { "type": "file", "class": "visible_input disabled", "name": "value", "placeholder": "Upload file from your computer" }))).append($('<div>', { "class": "file-path-wrapper" }).append($('<input>', { "type": "text", "name": "value", "class": "file-path validate disabled" }))).hide()))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s12" }).append($('<a>', { "href": "javascript:;", "class": "btn-link grey-text left" }).text("‹ Cancel").on("click", function (e) {
					e.preventDefault();
					if (context == "add") {
						$(".add_term").removeClass("disabled");
						$("#add_term_form").html("").hide();
					} else {
						$dd.html($dd2.html()).removeClass("editing");
					}
					_this2.page_info_btn__actions(term_id, key, language);
				})).append($('<a>', { "href": "javascript:;", "class": "btn btn-flat btn-highlight right" }).text("Save").on("click", function (e) {
					e.preventDefault();
					DATA.get_attribute_upload_url().then(function (upload_url) {
						$(e.target).closest("form").attr("action", upload_url).submit();
					});
				}))));

				if ($(e.target).hasClass("add_term")) {
					$(e.target).addClass("disabled");
					$("#add_term_form").html($form).show();

					$form.find(".visible_input").focus().on("keypress", function (e) {
						if (e.which == 0) {
							$(".add_term").removeClass("disabled");
							$("#add_term_form").html("").hide();
						}
					});
				} else {
					var _$dd = $(e.target).closest("dd");

					_$dd.addClass("editing").html($form);
					_$dd.find(".visible_input").focus().on("keypress", function (e) {
						if (e.which == 0) {
							_$dd.html($dd2.html()).removeClass("editing");
							_this2.page_info_btn__actions(term_id, key, language);
						}
					});
				}
				$("select").material_select();
				$(".switch").find("input[type=checkbox]").on("change", function (e) {
					if ($(e.target).prop("checked")) {
						$(".text_input").hide().addClass("disabled");
						$(".file-field").show().find("input").removeClass("disabled");
					} else {
						$(".text_input").show().removeClass("disabled");
						$(".file-field").hide().find("input").addClass("disabled");
					}
				});
			});
		}
	}, {
		key: "add_info",
		value: function add_info(source, remote) {
			/**
    * Filter and order items in the `Term information` box
    */
			var item_id = source.id,
			    hide = {
				id: true,
				comment: true,
				"ontology id": true,
				"ontology name": true,
				"is a": true,
				"Name of Trait": true,
				language: true,
				"Scale ID for modification, Blank for New": true,
				"Method ID for modification, Blank for New": true,
				"Trait ID for modification, Blank for New": true,
				"Language of submission (only in ISO 2 letter codes)": true
			},
			    first = {
				"Abbreviated name": true,
				Synonyms: true,
				Synonym: true,
				Description: true,
				"Trait class": true,
				"How is trait": true
			},
			    last = {
				"Name of submitting scientist": true,
				"Institution": true,
				"Date of submission": true,
				"Bibliographic": true,
				"Updated": true,
				xref: true
			},
			    editable = {
				name: true,
				Synonym: true,
				"created at": true
			},
			    ordered_source = {},
			    last_data_source = {};

			// Remove unwanted items
			$.each(hide, function (k, v) {
				if (v && source[k] !== undefined) {
					delete source[k];
				}
			});
			// Add first wanted items
			$.each(first, function (k, v) {
				if (v && source[k] !== undefined) {
					ordered_source[k] = source[k];
					delete source[k];
				}
			});
			// Remove but keep last wanted items
			$.each(last, function (k, v) {
				if (v && source[k] !== undefined) {
					last_data_source[k] = source[k];
					delete source[k];
				}
			});
			// Add remaining items
			$.each(source, function (k, v) {
				ordered_source[k] = source[k];
			});
			// Add last wanted items
			$.each(last_data_source, function (k, v) {
				ordered_source[k] = last_data_source[k];
			});
			/**
    * ---------------------------------------------------------------------
    */

			if (remote) {
				var name = void 0,
				    $dl = $("#page_info dl").append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(item_id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + item_id }).append($('<span>', { "class": "picol_rdf" }))));
				$.each(ordered_source, function (k, v) {
					$dl.append($('<dt>', { "class": "valign-wrapper" }).append(STR.ucfirst(k) + ":")).append($('<dd>').append(function () {
						if (DATA.get_user_logged() && editable[k] !== undefined) {
							return $('<span>').append(v + " ").append($('<a>', {
								"href": "javascript:;",
								"class": "btn btn-flat btn-mini white highlight-text",
								"data-term_id": item_id,
								"data-key": k,
								"data-language": "english"
							}).append($('<span>', { "class": "fa fa-edit" })));
						} else {
							return v;
						}
					}));
				});
				// $("#term_info_name").text(source.name);
				$("#page_info").html($dl).append($('<div>', { "class": "card-content", "id": "add_term_form" }).hide()).append(function () {
					if (DATA.get_user_logged() && editable[k] !== undefined) {
						return $('<div>', { "class": "card-action" }).append($('<a>', {
							"href": "javascript:;",
							"class": "btn btn-flat white highlight-text add_term"
						}).append("Add a new attribute ").append($('<span>', { "class": "fa fa-plus" }))
						// .click((e) => {
						// 	$(e.target).addClass("disabled");
						// })
						);
					}
				});

				this.page_info_btn__actions();
			} else {
				$("#page_info").html(source);
			}
		}
	}, {
		key: "button",
		value: function button(options) {
			var _this3 = this;

			var defaults = {
				id: "",
				term: "",
				source: {},
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			var $a = $('<a>', {
				"data-tooltip": "<b>" + STR.ucfirst(option.term) + "</b><br /><small>Relationship: <tt>" + option.source.relationship + "</tt></small>",
				"class": "btn btn-mini tooltipped " + option.id.replace(":", "-") /* + ((option.is_root || NAV.get_term_id() == option.id) ? " selected" : "")*/
				, "data-id": option.id
			}).append($('<span>').html(STR.camel_case_2_text(option.term))).click(function (e) {
				$("#page_info dl").html("");
				$("#comments").html("").hide();

				// Item selection in treeview
				$(".treeview a.selected").removeClass("selected");
				$(e.currentTarget).addClass("selected");

				// Permalink
				var permalink = void 0,
				    ext_permalink = void 0;
				if (option.is_root || option.id.split(":")[1] == "0000000" || option.id.split(":")[1] == "ROOT") {
					permalink = "./ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/ontology/" + NAV.get_ontology_id() + ":" + STR.get_ontology_term(option.source.name));

					// Set page title and subtitle
					$("#page_title").html(STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
					$("#page_subtitle").html(NAV.get_ontology_id());
					// Se the breadcrumb
					$("span.breadcrumb").find("tt").html(NAV.get_ontology_id());
				} else {
					permalink = "./terms/" + option.id + ":" + STR.get_ontology_term(option.source.name), history.pushState("", option.term, "/terms/" + option.id + ":" + STR.get_ontology_term(option.source.name));

					// Set page title and subtitle
					$("#page_title").html(STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
					$("#page_subtitle").html('<a href="./ontology/' + NAV.get_ontology_id() + '">' + NAV.get_ontology_id() + "</a><small>:" + NAV.get_term_id() + "</small>");
					// Se the breadcrumb
					$("span.breadcrumb").html('<tt>' + NAV.get_ontology_id() + "<small>:" + NAV.get_term_id() + '</small></tt>' + STR.camel_case_2_text(STR.get_ontology_term(option.source.name)));
				}
				ext_permalink = "https://www.cropontology.org/terms/" + option.id + "/" + option.term + "/static-html?language=" + (option.langs.length == 0 ? settings.general.language : option.langs[0]);

				$("#term_info_name").attr("href", permalink).html(option.term);
				$("#term_permalink").attr("href", ext_permalink);

				// Manage "Term information" nav
				$("#variables").addClass("disabled").find("a").html($('<span>', { "class": "fa fa-spin fa-sync" }));
				$("#general a").click();

				// Variables
				DATA.get_terms_variables(option.source.id).then(function (variables) {
					// $("#new-comments a").text("Comments (" + comments.length + ")");
					if (variables.length > 0) {
						// Manage "Term information" nav
						$("#variables").removeClass("disabled").find("a").text("Variables (" + variables.length + ")");
						$("#ontology_info ul.tabs a").removeClass("active");
						$("#general a").click();
						// Prepare variables container
						$("#item_variables").html($('<ul>', { "class": "collection" }));

						$.each(variables, function (k, v) {
							$("#item_variables .collection").append($('<li>', { "class": "collection-item" }).append($('<a>', { "href": "./terms/" + v.id }).append($('<div>').append(STR.get_ontology_term(v.name)).append($('<span>', { "class": "fa fa-chevron-right secondary-content grey-text" })))));
						});
					} else {
						$("#variables a").addClass("disabled");
					}

					LOADER.hide("#pages .progress");
					_this3.enable_info();
				});

				if (option.is_root || option.id.split(":")[1] == "0000000" || option.id.split(":")[1] == "ROOT") {
					_this3.add_info($('<dl>').append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(option.id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.id }).append($('<span>', { "class": "picol_rdf" })))).append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
						return option.langs.length + ": " + option.langs.join(", ");
					})), false);
					$("#graph_content").html($('<h1>').append($('<span>', { "class": "fab fa-hubspot fa-3x" })));
					$("#graph").addClass("disabled");

					// Comments
					DATA.get_ontology_comments(NAV.get_ontology_id()).then(function (comments) {
						var comments_count = $.map(comments, function (n, i) {
							return i;
						}).length;
						if (comments_count > 0) {
							$("#new-comments a").text("Comments (" + comments_count + ")");
							$("#comments").html("");

							$.each(comments, function (k, c) {
								console.log(c[0]);
								DATA.get_user(c[0].username).then(function (user) {
									$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c[0].date))).append($('<p>', { "style": "font-style:italic;" }).text(c[0].comment))).show();
								});
							});
						}
					});
				} else {
					// Info
					_this3.disable_info();
					LOADER.create({ target: "#pages", type: "progress" });

					DATA.get_ontology_attributes(option.source.id).then(function (data) {
						data.id = option.source.id;
						_this3.add_info(data, true);
					});

					LOADER.create({ target: "#graph", type: "progress" });
					/**
      * Get term data and build graph
      */
					DATA.get_term_parents(option.id).then(function (data) {
						// buildGraph($graph, data);
						var render = function render(r, n) {
							/* the Raphael set is obligatory, containing all you want to display */
							var id = n.id,
							    label = STR.get_ontology_term(n.label),
							    biggest = id.length > label.length ? id : label,
							    set = r.set().push(
							/* custom objects go here */
							r.rect(n.point[0], n.point[1] - 13, biggest.length + 120, 44).attr({
								"fill": "#feb",
								r: "12px",
								"stroke-width": n.distance == 0 ? "3px" : "1px"
							})).push(r.text(n.point[0] + biggest.length / 2 + 60, n.point[1] + 10, (label || n.id) + "\n(" + n.id + ")"));
							return set;
						};

						$("#graph_content").html("");
						var width = $("#graph_content").width(),
						    height = $("#graph_content").height(),
						    g = new Graph();

						g.edgeFactory.template.style.directed = true;

						$.each(data, function (idx, el) {
							for (var i = 0; i < el.length; i++) {
								g.addNode(el[i].id, {
									render: render,
									label: STR.get_ontology_term(el[i].name)
								});
							}
						});
						$.each(data, function (idx, el) {
							for (var i = 0; i < el.length; i++) {
								var next = el[i + 1];
								if (next) {
									g.addEdge(next.id, el[i].id, { label: next.relationship });
									//g.addEdge(next.id, el[i].id);
								}
							}
						});

						var layouter = new Graph.Layout.Spring(g);
						layouter.layout();
						var renderer = new Graph.Renderer.Raphael("graph_content", g, parseInt(width), parseInt(height));
						renderer.draw();

						$("#graph").removeClass("disabled");

						LOADER.hide("#graph .progress");
						// Add fullscreen button
						// if($.fullscreen.isNativelySupported()) {
						// 	$("#graph_content").prepend(
						// 		$('<a>', {
						// 			"href": "javascript:;",
						// 			"class": "btn btn-flat fullscreen tooltipped",
						// 			"data-position": "left",
						// 			"data-tooltip": "Show fullscreen"
						// 		}).append(
						// 			$('<span>', {"class": "fas fa-expand"})
						// 		).click((e) => {
						// 			// Get current svg and renderer measurments
						// 			let r = renderer,
						// 				svg = $("#graph_content svg");
						//
						// 			$("#graph").fullscreen({
						// 				toggleClass: "fullscreen"
						// 			})
						// 			$(".btn.fullscreen").blur();
						// 					// $("#graph_content svg").attr("width", parseInt($(document).width()));
						// 					// $("#graph_content svg").attr("height", parseInt($(document).height()));
						// 					// renderer.width = parseInt($(document).width());
						// 					// renderer.height = parseInt($(document).height());
						// 					// renderer.r.width = parseInt($(document).width());
						// 					// renderer.r.height = parseInt($(document).height());
						// 					// console.log(renderer);
						// 				// 	var renderer = new Graph.Renderer.Raphael(
						// 				// 		"graph_content",
						// 				// 		g,
						// 				// 		parseInt($(document).width() - 100),
						// 				// 		parseInt($(document).height() - 100)
						// 				// 	);
						// 					// renderer.draw();
						// 				// }, 10);
						// 		}).tooltip({delay: 50})
						// 	)
						// }
					});

					// Comments
					DATA.get_terms_comments(option.source.id).then(function (comments) {
						$("#new-comments a").text("Comments (" + comments.length + ")");
						// Get user data
						$.each(comments, function (k, c) {
							DATA.get_user(c.author_id).then(function (user) {
								$("#comments").append($('<li>', { "class": "collection-item avatar" }).append($('<img>', { "src": user.gravatar.thumbnailUrl, "alt": user.username, "class": "circle" })).append($('<span>', { "class": "title" }).append($('<span>', { "class": "highlight" }).text(user.name + " " + user.sirname)).append("<br />").append($('<small>', { "class": "grey-text" }).text(c.created))).append($('<p>', { "style": "font-style:italic;" }).text(c.comment))).show();
							});
						});

						LOADER.hide("#pages .progress");
						_this3.enable_info();
					});
				}
			});

			if (NAV.get_page() && NAV.get_term_id() == option.id) {
				setTimeout(function () {
					$a.click();
					$a.prev().click();
					_this3.tree_icon(true, option.id);
				}, 100);
			}

			if (option.source.relationship !== undefined) {
				$a.tooltip({
					position: "right",
					html: true,
					delay: 1000
				});
			}
			return $a;
		}
	}, {
		key: "disable_info",
		value: function disable_info() {
			$(this).removeClass("disabled");
		}
	}, {
		key: "enable_info",
		value: function enable_info() {
			$(this).addClass("disabled");
		}
	}, {
		key: "get_tree_items",
		value: function get_tree_items(options) {
			var defaults = {
				target: "#treeview",
				source: {}
			},
			    option = $.extend({}, defaults, options);

			this.add_items({
				item: option.target,
				source: option.source,
				term: STR.get_ontology_term(option.source.name),
				is_root: false,
				langs: option.langs
			});
		}
	}, {
		key: "add_items",
		value: function add_items(options) {
			var defaults = {
				item: "#treeview",
				source: {},
				term: "",
				is_root: false,
				langs: []
			},
			    option = $.extend({}, defaults, options);

			if (option.is_root) {
				var $root_li = $('<li>', { "class": "root" }).append(this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				}));

				$(option.item).append($root_li);

				/**
     * Term Information
     */
				LOADER.create({ target: "#pages", type: "progress" });
				// Default action (only for root items)
				$("#page_info").html($('<dl>').append($('<dt>', { "class": "grey-text" }).text("Identifier:")).append($('<dd>', { "class": "grey-text" }).append($('<tt>').text(option.source.id + " ")).append($('<a>', { "target": "_blank", "href": "https://www.cropontology.org/rdf/" + option.source.id }).append($('<span>', { "class": "picol_rdf" })))).append($('<dt>').text("Ontology type:")).append($('<dd>').text(option.source.ontologyType)).append($('<dt>').append("Available languages:")).append($('<dd>').append(function () {
					return option.langs.length + ": " + option.langs.join(", ");
				})));
				// $("#term_info_name").html(option.term);

				LOADER.hide("#pages .progress");

				// Load the root tree
				this.get_tree_items({
					target: "#treeview li.root",
					source: option.source,
					langs: option.langs
				});

				// Open the first tree branch
				$(".treeview .expandable-hitarea").first().click();
			} else {
				var $li = $('<li>', { "class": "last expandable lastExpandable" }).append(this.tree_icon(true, option.source.id)).append(this.button({
					id: option.source.id,
					term: option.term,
					source: option.source,
					is_root: option.is_root,
					langs: option.langs
				}));
				$(option.item).append($li);
			}
		}
	}]);

	return treeview;
}();

exports.default = treeview;

},{"../../common/settings/contents.json":1,"../../common/settings/languages.json":2,"../../src/es6/_navigation.es6":9,"../../src/es6/_str.es6":11,"../../src/es6/data.es6":13,"../../src/es6/loader.es6":16,"moment":6}],13:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require("es6-promise");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _obj = require("../../src/es6/_obj.es6");

var _obj2 = _interopRequireDefault(_obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STR = new _str2.default();
var OBJ = new _obj2.default();
var user = {
	logged: false
};

var data = function () {
	function data() {
		_classCallCheck(this, data);
	}

	_createClass(data, [{
		key: "extract_name",

		/**
   * -------------------------------------------------------------------------
   * 								GET
   * -------------------------------------------------------------------------
   */
		value: function extract_name(json_name) {
			var term = void 0;

			if (STR.is_json(json_name)) {
				$.each(JSON.parse(json_name), function (lang, name) {
					if ($.isArray(name)) {
						name = name.join(", ");
					}
					term = STR.ucfirst(name);
				});
			} else {
				term = STR.ucfirst(json_name);
			}
			return term;
		}
	}, {
		key: "search",
		value: function search(string) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/search",
					data: {
						q: string
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontology_upload_url",
		value: function get_ontology_upload_url() {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/obo-upload-url",
					async: true,
					dataType: "html",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_attribute_upload_url",
		value: function get_attribute_upload_url() {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/attribute-upload-url",
					async: true,
					dataType: "html",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse the CropOntology Community website feed
   * @NOTE This is an async function
   *
   * @return object															The feed data JSON object
   */

	}, {
		key: "get_community_website_feed",
		value: function get_community_website_feed() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see https://developers.google.com/gdata/docs/json
     */
				var feed = [];
				$.ajax({
					type: "GET",
					url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
					data: {
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						var
						/**
       * Find all images in content: the first one will be the preview
       * @param  string 				content 				The HTML image tag
       * @return string|null									The image source
       */
						get_preview_image = function get_preview_image(content) {
							var $imgs = [];
							if ($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if ($imgs.length == 1) {
									return $('<img>', {
										"src": $imgs[0],
										"class": ""
									}).prop("outerHTML");
								}
							} else {
								return null;
							}
						},

						/**
       * Find all videos in content: the first one will be the preview
       * @param  string 				content 				The HTML video embed
       * @return string										The image source
       */
						get_preview_video = function get_preview_video(content) {
							if ($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						};

						$.each(data.feed.entry, function (key, entry) {

							// Clean the response object
							feed.push({
								id: entry.id.$t,
								published: entry.published.$t,
								updated: entry.updated.$t,
								title: entry.title.$t,
								content: entry.content.$t,
								preview: get_preview_image(entry.content.$t) !== null ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
								category: entry.category,
								page: entry.sites$pageName !== undefined ? entry.sites$pageName.$t : null,
								feeds: entry.link,
								link: $.map(entry.link, function (v, k) {
									if (v.type == "text/html") {
										return v.href;
									}
								})[0],
								author: $.map(entry.author, function (v, k) {
									return {
										name: STR.ucwords(v.name.$t),
										email: v.email.$t
									};
								})
							});
							if (feed[key].author.length == 1) {
								feed[key].author = feed[key].author[0];
							}
						});
						resolve(feed);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_help_content",
		value: function get_help_content() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see https://developers.google.com/gdata/docs/json
     */
				var feed = [];
				$.ajax({
					type: "GET",
					url: "https://sites.google.com/feeds/content/cgxchange.org/cropontologycommunity",
					data: {
						path: "/home/help-for-the-crop-ontology",
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						var
						/**
       * Find all images in content: the first one will be the preview
       * @param  string 				content 				The HTML image tag
       * @return string|null									The image source
       */
						get_preview_image = function get_preview_image(content) {
							var $imgs = [];
							if ($(content).find("img").attr("src") !== undefined) {
								$imgs.push($(content).find("img").attr("src"));
								if ($imgs.length == 1) {
									return $('<img>', {
										"src": $imgs[0],
										"class": ""
									}).prop("outerHTML");
								}
							} else {
								return null;
							}
						},

						/**
       * Find all videos in content: the first one will be the preview
       * @param  string 				content 				The HTML video embed
       * @return string										The image source
       */
						get_preview_video = function get_preview_video(content) {
							if ($(content).find("iframe").attr("src") !== undefined) {
								return $(content).find("iframe").attr("width", "100%").attr("height", "100%");
							} else {
								return null;
							}
						};

						$.each(data.feed.entry, function (key, entry) {
							// Clean the response object
							feed.push({
								id: entry.id.$t,
								published: entry.published.$t,
								updated: entry.updated.$t,
								title: entry.title.$t,
								content: entry.content.$t,
								preview: get_preview_image(entry.content.$t) !== null ? get_preview_image(entry.content.$t) : get_preview_video(entry.content.$t),
								category: entry.category,
								page: entry.sites$pageName !== undefined ? entry.sites$pageName.$t : null,
								feeds: entry.link,
								link: $.map(entry.link, function (v, k) {
									if (v.type == "text/html") {
										return v.href;
									}
								})[0],
								author: $.map(entry.author, function (v, k) {
									return {
										name: STR.ucwords(v.name.$t),
										email: v.email.$t
									};
								})
							});
							if (feed[key].author.length == 1) {
								feed[key].author = feed[key].author[0];
							}
						});
						resolve(feed);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse all ontologies from the Crop Ontology website
   * @NOTE This is an async function
   *
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontologies",
		value: function get_ontologies() {
			return new _es6Promise2.default(function (resolve, reject) {
				function filter_categories(cat, ontologies) {
					// if the first word contains a dash - good enough
					var words = cat.split(" "),
					    category = {
						id: words[0],
						name: $.trim(cat.replace(words[0], "")),
						icon: ""
					};

					if (category.id.includes("-")) {
						switch (category.name) {
							case "General Germplasm Ontology":
								category.icon = "picol_ontology";break;
							case "Phenotype and Trait Ontology":
								category.icon = "picol_relevance";break;
							case "Solanaceae Phenotype Ontology":
								category.icon = "picol_path";break;
							case "Structural and Functional Genomic Ontology":
								category.icon = "picol_hierarchy";break;
							case "Location and Environmental Ontology":
								category.icon = "picol_point_of_interest";break;
							case "Plant Anatomy & Development Ontology":
								category.icon = "picol_copy";break;
						}

						// order the categories
						return {
							category: category,
							ontologies: ontologies
						};
					} else {
						return cat;
					}
				}

				var filteredCats = [],
				    newCats = {},
				    categories = [];

				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-ontologies",
					data: {
						alt: "json"
					},
					async: true,
					dataType: "json",
					success: function success(data) {
						$.each(data, function (key, ontologies) {
							/**
        * Filtered categories
        * @type object
        */
							var filtered = filter_categories(key, ontologies);
							categories.push(filtered);
						});
						// console.info(categories);
						// categories = OBJ.sort_by_key(categories, ["category", "name"])
						// console.dir(categories);

						resolve(categories);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get latest ontologies
   * @NOTE This is an async function
   *
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_latest_ontologies",
		value: function get_latest_ontologies() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/latest",
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse the Ontology data (for the Ontology card)
   * @NOTE This is an async function
   *
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontologies_data",
		value: function get_ontologies_data(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "common/ontologies_data.json",
					async: true,
					dataType: "json",
					success: function success(data) {
						if (data[id] !== undefined) {
							resolve(data[id]);
						}
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse all ontologies from the Crop Ontology website
   * @NOTE This is an async function
   *
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_ontology",
		value: function get_ontology(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-ontology-roots/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data[0]);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontology_attributes",
		value: function get_ontology_attributes(id) {
			var _this = this;

			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-attributes/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						var d = {};
						$.each(data, function (k, v) {
							d[STR.readable_data(v.key)] = STR.camel_case_2_text(STR.stripslashes(_this.extract_name(v.value)));
						});
						resolve(d);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_ontology_comments",
		value: function get_ontology_comments(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-comments-onto/?ontoId=" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_term_parents",
		value: function get_term_parents(term_id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-term-parents/" + term_id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_terms_variables",
		value: function get_terms_variables(term_id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-variables/" + term_id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_terms_comments",
		value: function get_terms_comments(term_id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-comments?termId=" + term_id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_children",
		value: function get_children(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
     * @see http://www.cropontology.org/api
     */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/get-children/" + id,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * Get and parse the Ontology data (for the Ontology card)
   * @NOTE This is an async function
   *
   * @param  string 							id								Tho Ontology ID
   * @return object 															The ontologies data JSON object
   */

	}, {
		key: "get_login",
		value: function get_login() {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				$.ajax({
					type: "GET",
					url: "http://www.cropontology.org/login",
					async: true,
					dataType: "json",
					success: function success(data) {
						if (data.username !== undefined && data.username !== "") {
							resolve(data);
						} else {
							resolve(false);
						}
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}
	}, {
		key: "get_user_logged",
		value: function get_user_logged() {
			if (!user.logged) {
				// Check if user is logged
				this.get_login().then(function (login_data) {
					if (login_data) {
						user = login_data;
						user.logged = true;
					} else {
						user.logged = false;
					}
					return user.logged;
				});
			} else {
				return true;
			}
		}
	}, {
		key: "get_user",
		value: function get_user(id) {
			return new _es6Promise2.default(function (resolve, reject) {
				/**
    * @see http://www.cropontology.org/api
    */
				if (!$.isNumeric(id)) {
					// The passed identifier is not a an ID but an username
					$.ajax({
						type: "GET",
						url: "http://www.cropontology.org/users",
						async: true,
						dataType: "json",
						success: function success(users) {
							$.each(users, function (ku, vu) {
								if (vu.username == id) {
									$.ajax({
										type: "GET",
										url: "http://www.cropontology.org/users/" + vu.userid,
										async: true,
										dataType: "json",
										success: function success(data) {
											// Get Gravatar data
											$.ajax({
												type: "GET",
												url: "https://en.gravatar.com/" + data.gravatar + ".json",
												async: true,
												dataType: "json",
												success: function success(gravatar_data) {
													data.gravatar = gravatar_data.entry[0];
													resolve(data);
												}
											});
										},
										error: function error(jqXHR, textStatus, errorThrown) {
											reject(errorThrown);
										}
									});
								}
							});
						},
						error: function error(jqXHR, textStatus, errorThrown) {
							reject(errorThrown);
						}
					});
				} else {
					$.ajax({
						type: "GET",
						url: "http://www.cropontology.org/users/" + id,
						async: true,
						dataType: "json",
						success: function success(data) {
							// Get Gravatar data
							$.ajax({
								type: "GET",
								url: "https://en.gravatar.com/" + data.gravatar + ".json",
								async: true,
								dataType: "json",
								success: function success(gravatar_data) {
									data.gravatar = gravatar_data.entry[0];
									resolve(data);
								}
							});
						},
						error: function error(jqXHR, textStatus, errorThrown) {
							reject(errorThrown);
						}
					});
				}
			});
		}
	}, {
		key: "register_user",
		value: function register_user(user_data) {
			return new _es6Promise2.default(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: "http://www.cropontology.org/register",
					data: user_data,
					async: true,
					dataType: "json",
					success: function success(data) {
						resolve(data);
					},
					error: function error(jqXHR, textStatus, errorThrown) {
						reject(errorThrown);
					}
				});
			});
		}

		/**
   * -------------------------------------------------------------------------
   * 								POST
   * -------------------------------------------------------------------------
   */

	}]);

	return data;
}();

exports.default = data;

},{"../../src/es6/_obj.es6":10,"../../src/es6/_str.es6":11,"es6-promise":5}],14:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var filters = function () {
	function filters() {
		_classCallCheck(this, filters);
	}

	_createClass(filters, [{
		key: "draw_filter",
		value: function draw_filter(key, value) {
			return $('<li>', { "class": "tag " + key }).text(key + ": " + value).append($('<a>', {
				"href": "javascript:;",
				"class": "tooltipped",
				"data-position": "top",
				"data-tooltip": $('<i>').text("Are you sure?").prop("outerHTML")
			}).append($('<span>', { "class": "fa fa-times" })));
		}

		/**
   * Build a modal popup
   * NOTE: Must be executed before or after creating the trigger button
   * @see http://archives.materializecss.com/0.100.2/modals.html
   *
   * @example:
   * ```
   * // Trigger
   * <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
   * ```
   *
   * @param object						options								Parameters passed as JSON object
   */

	}, {
		key: "build_modal",
		value: function build_modal(options) {
			var defaults = {
				id: "modal",
				title: "Modal Header",
				content: "Modal Content",
				ok_button: "Ok",
				cancel_button: "Cancel",
				fixed_footer: true
			},
			    settings = $.extend({}, defaults, options);

			$("body").prepend($('<div>', { "id": settings.id, "class": "modal" + (settings.fixed_footer ? " modal-fixed-footer" : "") }).append($('<div>', { "class": "modal-content" }).append($('<h4>').text(settings.title)).append(settings.content)).append($('<div>', { "class": "modal-footer" }).append($('<a>', { "href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat left" }).text(settings.cancel_button)).append($('<a>', { "href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat right" }).text(settings.ok_button))));
		}
	}, {
		key: "add_filter_row",
		value: function add_filter_row(options) {
			var defaults = {
				id: "",
				name: "",
				placeholder: ""
			},
			    settings = $.extend({}, defaults, options);

			return $('<div>', { class: "row filter" }).append($('<div>', { class: "input-field col s2" }).append($('<p>').append($('<input>', {
				type: "checkbox",
				class: "filled-in",
				id: settings.id
			})).append($('<label>', { for: settings.id }).text(settings.label)))).append($('<div>', { class: "input-field col s4" }).append($('<input>', {
				type: "text",
				name: settings.name,
				placeholder: settings.placeholder,
				disabled: true
			})));
		}

		/**
   * Build the filters modal
   */

	}, {
		key: "filters_modal",
		value: function filters_modal() {
			function activate_rows() {
				$(".filter").each(function (k, v) {
					var $checkbox = $(v).find("input[type='checkbox']"),
					    $input = $(v).find("input[type='text']");

					$checkbox.on("change", function () {
						if ($checkbox.is(":checked")) {
							$input.attr("disabled", false).focus();
						} else {
							$input.attr("disabled", true);
						}
					});
				});
			}

			var $filters_modal_content = $('<div>', { "class": "row" }).append($('<form>', { class: "col s12" }).append(this.add_filter_row({
				id: "user_check",
				name: "user",
				label: "Users:",
				placeholder: "Type a username, name or last name..."
			})).append(this.add_filter_row({
				id: "type_check",
				name: "type",
				label: "Type:",
				placeholder: "Ontology type..."
			})));

			this.build_modal({
				id: "searchbar_filters",
				title: "Filters",
				content: $filters_modal_content,
				fixed_footer: false
			});
			activate_rows();
		}
	}]);

	return filters;
}();

exports.default = filters;

},{}],15:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _data = require("../../src/es6/data.es6");

var _data2 = _interopRequireDefault(_data);

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

var _pagination = require("../../src/es6/pagination.es6");

var _pagination2 = _interopRequireDefault(_pagination);

var _treeview = require("../../src/es6/_treeview.es6");

var _treeview2 = _interopRequireDefault(_treeview);

var _filters = require("../../src/es6/filters.es6");

var _filters2 = _interopRequireDefault(_filters);

var _modals = require("../../src/es6/modals.es6");

var _modals2 = _interopRequireDefault(_modals);

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

var _loader = require("../../src/es6/loader.es6");

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Static pages
*/
var page_about = "<p>The Crop Ontology project is the creation of the Generation Challenge Programme (GCP, <a href=\"http://www.generationcp.org/\">http://www.generationcp.org/</a> ), which understood from its inception the importance of controlled vocabularies and ontologies for the digital annotation of data.  In ontologies, terms bear a particular, logically defined relationship to each other, allowing computational reasoning on data annotated with a structured vocabulary. The volume of agriculture-related information and terminology related to phenotype, breeding, germplasm, pedigree, traits, among others, is increasing exponentially. In order to facilitate access to the data held within and/or across the databases, GCP initiated the development of Trait Dictionaries for breeders' fieldbooks and a Crop Ontology (CO) to facilitate the harmonization of the data capture and powerful manipulations of the data through ontology-driven queries. This is a development that raised interest in CGIAR Centres and other communities, like the Gramene team developing the Plant Trait Ontology, ecologists and semantic web developers holding vast quantities of agriculture-related data. The project will continue the incremental validation and refinement of the Crop Ontology, which involves adding methods of trait measurement and experiments to enable the mapping of ontology terms onto measured, stored or published variables.The Crop Ontology is a key element of the Integrated Breeding Platform <a href=\"https://www.integratedbreeding.net/\">https://www.integratedbreeding.net/</a></p>\n<a href=\"http://www.generationcp.org/\" ><img src=\"common/media/img/gcp-logo.png?{{>VERSION}}\" /></a>\n\n<h2>About the Crop Ontology</h2>\n\n<p>The Crop Ontology (CO) current objective is to compile validated concepts along with their inter-relationships on anatomy, structure and phenotype of Crops, on trait measurement and methods as well as on Germplasm with the multi-crop passport terms. The concepts of the CO are being used to curate agronomic databases and describe the data. The use of ontology terms to describe agronomic phenotypes and the accurate mapping of these descriptions into databases is important in comparative phenotypic and genotypic studies across species and gene-discovery experiments as it provides harmonized description of the data and therefore facilitates the retrieval of information.  Development of crop-specific trait ontologies and the germplasm ontologies began in 2008 for chickpea, maize, <em>Musa</em>, potato, rice and wheat, and in 2010 for cassava. The GCP Crop Ontology is a global public good, available to be used freely by all. </p>\n\n<h2>About the tool</h2>\n\n<p>This curation and annotation web site is a participatory tool that enables you to browse the Crop Ontology, search for specific terms and access the definition, as well as additional information. It is possible to post a suggestion at the level of a term and provide feedback on your experience using the site. Please, consult the video tutorials to get a visual explanation of the web site use.</p>\n\n<p>The Ontology curators are able to upload a full ontology in OBO format, create it online, add attribute information, and submit or delete terms from the Crop Ontology. Researchers can also submit/deposit trait names using the curation/annotation tool &lsquo;add an ontology&rsquo; to increment the tool&rsquo;s capacity. </p>\n\n<p>All lists can be downloaded and a web service API is available. The site is hosted on <a href=\"http://code.google.com/appengine\">Google App Engine</a> and the versioned code is hosted on <a href=\"https://github.com/bioversity/Crop-Ontology\">GitHub</a>.</p>\n\n<p>The tool is still under development, so your feedback will help to improve it. Please provide any comments or suggestions using the &lsquo;Feedback&rsquo; button.</p>\n\n<p>This work was greatly inspired by the Crop Ontology Look-up service developed by Martin Senger, consultant in Bioinformatics, and by Terminizer, online annotation tool developed by David Hancock, from the University of Manchester. </p>\n\n<p>Citation:\n&ldquo;Crop Ontology curation and annotation tool &ndash; 2011 Generation Challenge Programme, Bioversity International as project implementing agency.&rdquo;</p>\n<!--\n<h2>Project partners in 2012</h2>\n\n<p>This work is primarily coordinated and undertaken by the lead institution, Bioversity International (hereafter referred to as Bioversity), and coordinated by Elizabeth Arnaud. Rosemary Shrestha (CIMMYT, Mexico) coordinates the CO community and its implementation in crop-specific databases.</p>\n\n<p>\nPrincipal Investigator &ndash; Elizabeth Arnaud (Bioversity International)\n</p>\n\n<p>\nCurators of the Crop-specific Ontology in 2012\n</p>\n\n<ul>\n<li>Barley - Flavio Capettini (ICARDA)</li>\n<li>Cassava - Bakare Moshood Agba  (IITA) </li>\n<li>Common Beans - Fabio Alberto Gerrera (CIAT)</li>\n<li>Chikpea and Groundnut, Sorghum and pigeon pea - Prasad Peteti, Praveen Reddy, Suyash Pati (ICRISAT)</li>\n<li>Cowpea - Sam Ofodile , Ousmane Boukare (IITA)</li>\n<li>Rice - Nikki Frances Borja (IRRI)</li>\n<li>Potato - Reinhard Simon (CIP)</li>\n<li>Maize and Wheat - Rosemary Shrestha (CIMMYT) - Global Ontology Coordinator until 2011/li>\n</ul>\n\n<p>\nScientists coordinating or actively contributing to the development of crop specific Trait Dictionaries and ontologies:\n</p>\n<ul>\n<li>Bioversity - Inge van den Bergh</li>\n<li>CIRAD - Jean FRancois Rami</li>\n<li>ICARDA - Sanjaya Gyawali,</li> Adnan al-Yassin, Mohamad Maatougui, S. Rajaram., Ahmed Amri, Fawzy Nawar</li>\n<li>ICRISAT - Trushar Shah, Eva Wietzel, Tom Hash</li>\n<li>IITA - Ousmane Boukare, Peter Kulakow, Antonio Lopes Montez </li>\n<li>CIAT - Steve Beebe, Rowland Chirwa</li>\n<li>IRRI- Mauleon Ramil, Ruaraidh Sackville Hamilton</li>\n\n<li>and the Crop Communities of Practice </li>\n</ul>\n\n<p><strong>Acknowledgements to</strong>: Adriana Alercia, (Bioversity International, Crop descriptors specialist), Richard Bruskiewich (GCP Bioinformatics, former project Principle Investigator, IRRI), Guy Davenport (GCP bioinformatics, CIMMYT), Graham McLaren (GCP sub-programme on Crop information system, Leader), Martin SENGER (GCP Bioinformatics, formerly IRRI)</p>\n-->\n<h3>Articles</h3>\n<p>2012 - Shrestha Rosemary, Matteis Luca, Skofic Milko, Portugal Arlett, McLaren Graham, Hyman Glenn, Arnaud Elizabeth    - Bridging the phenotypic and genetic data useful for integrated breeding through a data annotation using the Crop Ontology developed by the crop communities of practice , in Frontiers in Physiology , vol.3, no.0326 <a href=\"http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326\"> URL=http://www.frontiersin.org/Journal/Abstract.aspx?s=907&name=plant_physiology&ART_DOI=10.3389/fphys.2012.00326</a></p>\n<p>2012 - Elizabeth Arnaud, Laurel Cooper, Rosemary Shrestha, Naama Menda, Rex T. Nelson, Luca Matteis, Milko Skofic, Ruth Bastow, Pankaj Jaiswal, Lukas Mueller, Graham McLaren:  Towards a Reference Plant Trait Ontology For Modeling Knowledge of Plant Traits and Phenotypes in: proceedings of the 4th Conference on Knowledge Engineering and Ontology Development, 4-7 October 2012 , Spain.</p>\n<p>2010 - Rosemary Shrestha, Elizabeth Arnaud, Ramil Mauleon, Martin Senger, Guy F. Davenport, David Hancock, Norman Morrison, Richard Bruskiewich, and Graham McLaren - <strong>Multifunctional crop trait ontology for breeders' data: field book, annotation, data discovery and semantic enrichment of the literature</strong>, AoB PLANTS (2010) Vol. 2010 first published online May 27, 2010 doi:10.1093/aobpla/plq008  - <a href=\"http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008\">http://aobpla.oxfordjournals.org/citmgr?gca=aobpla;2010/0/plq008</a></p>\n\n<h3>Book chapter</h3>\n<p>2011 - Shrestha Rosemary, Guy F Davenport, Richard Bruskiewich and Elizabeth Arnaud in : Monneveux Philippe and Ribaut Jean-Marcel, eds (2011). Drought phenotyping in crops: from theory to practice CGIAR Generation Challenge Programme, Texcoco, Mexico. ISBN: 978-970-648-178-8. 475pp. Chapter is: Development of crop ontology for sharing crop phenotypic information .</p>\n\n<h2>Posters</h2>\n\n<style>\n.posters a img {\n  border: 1px solid #ddd;\n  vertical-align: top;\n  margin-right: 20px;\n}\n</style>\n\n<p class=\"posters\">\n  <a href=\"common/media/pdf/GRM_poster_Curation_annotation_tools.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/GRM_poster_Curation_annotation_tools.png\" /></a>\n  <a href=\"common/media/pdf/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/Hyderabad_Sept_2011_CassavaTraitOntologyPoster.png\" /></a>\n  <a href=\"common/media/pdf/Poster_GCP_GRM_Musa.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/Poster_GCP_GRM_Musa.png\" /></a>\n  <a href=\"common/media/pdf/biocuration2012-poster.pdf\"><img class=\"responsive-img\" src=\"common/media/img/posters/biocuration_thumb.png\" /></a>\n</p>\n";
var page_privacy_policy = "\n\n<h2>Photo credit</h2>\n<ul>\n    <li>Neil Palmer, CIAT via Flickr (<a href=\"https://www.flickr.com/photos/CIAT/albums\">https://www.flickr.com/photos/CIAT/albums</a>)</li>\n    <li>Bioversity International via Flickr (<a href=\"https://www.flickr.com/photos/bioversity/albums\">https://www.flickr.com/photos/bioversity/albums</a>)</li>\n    <li>Freepik (<a href=\"https://www.freepik.com/free-photo/golden-color-wheat-ear-in-front-of-white-wooden-wall_2741083.htm#term=wheat&page=1&position=41\">https://www.freepik.com/free-photo/golden-color-wheat-ear-in-front-of-white-wooden-wall_2741083.htm#term=wheat&page=1&position=41</a>)</li>\n</ul>\n";
var page_api = "<style>\nli {\n    margin-left: 15px;\n    list-style: none;\n}\n.api_left h2 {\n    margin-top: 30px !important;\n    padding-top: 30px !important;\n    color: #f28021 !important;\n}\n</style>\n<script>\n\n$(function(){\n\n    // replaces API urls for examples\n    $(\".example\").each(function() {\n        var $this = $(this);\n\n        var url = $this.parent().siblings().first().find(\"code\").text();\n\n        var parameters = url.match(/{(.*?)}/g);\n\n        if(parameters) {\n            for(var i=0; i<parameters.length; i++) {\n                var par = parameters[i];\n                var clean = par.substring(1, par.length-1);\n                url = url.replace(par, $this.attr(clean));\n            }\n        }\n\n        $this.html(\"<a href='\"+url+\"' target='_blank'>\"+url+\"</a>\");\n\n    });\n\n});\n\n</script>\n\n<div class=\"api_left\">\n\n<p>\nThis is the official API for the Ontology Curation Tool. It allows you to programmatically retrieve and interact with Ontology data.\n</p>\n<p>\nTo let us gather feedback you can leave a comment using the form on the right.\n</p>\n<h2>Statistics on collected ontologies</h2>\n<li><strong>URL:</strong> <a target=\"_blank\" href=\"http://www.cropontology.org/ontos_stats\">http://www.cropontology.org/ontos_stats</a></li>\n<li><strong>Returns:</strong> JSON object with statistics about collected ontologies</li>\n\n<h2>API Data Types</h2>\n<p>\nData can be requested in JSON.<br> API calls follow the <a href=\"http://en.wikipedia.org/wiki/Create,_read,_update_and_delete\">CRUD</a> semantics: create, retrieve, update and delete.\n</p>\n\n<!--\n<h2>Retrieve all traits given an Ontology Name</h2>\n<ul>\n    <li>Here's a little code snippet written in <b>PHP</b> to show you how you can leverage this API to retrieve all the traits of a specific Ontology: <a href=\"https://gist.github.com/1322511\">https://gist.github.com/1322511</a></li>\n</ul>\n-->\n<h2>JSON DUMP</h2>\n<ul>\n    <li><strong>URL:</strong> <a target=\"_blank\" href=\"https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json\">https://github.com/bioversity/Crop-Ontology/blob/master/public/dump.json</a></li>\n    <li><strong>Returns:</strong> JSON array of *raw* objects inside database</li>\n</ul>\n\n<h2>Search Terms</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/search?q={query}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects matching the search query - each object being a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" query=\"stem rust\"></span></li>\n</ul>\n\n<h2>Retrieve all Ontologies</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontologies</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON Hierarchy of the Ontologies under each category</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n<h2>Retrieve a specific Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n\t<li><strong>Returns:</strong> JSON representation of the ontology. </br><span style=\"font-style:italic;\">NB: This call does not retrieve the variables that are present in TD template v5 (and in the OBO files derived from the TDv5)</span></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n<h2>Retrieve Ontology ID by its Name</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-id?ontology_name={ontology_name}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> ID of the ontology, to be used with <code>/get-ontology-roots/{id}</code></li>\n    <li><strong>Example:</strong> <span class=\"example\" ontology_name=\"cassava\"></span></li>\n</ul>\n\n<h2>Retrieve Categories</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-categories</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of strings - string being the name of the category that you pass to the <code>/ontologies</code> API call</li>\n    <li><strong>Example:</strong> <span class=\"example\"></span></li>\n</ul>\n\n<h2>Retrieve Ontologies By Category</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/ontologies?category={category}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing an ontology</li>\n    <li><strong>Example:</strong> <span class=\"example\" category=\"010-089 General Germplasm Ontology\"></span></li>\n</ul>\n\n<a name=\"rdf\"></a>\n<h2>Retrieve Terms in RDF</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/rdf/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> XML related RDF</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Root Terms of an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-ontology-roots/{ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects; each one representing a term</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_020\"></span></li>\n</ul>\n\n<h2>Retrieve Child Terms of parent Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-children/{parentId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" parentId=\"CO_020:0000000\"></span></li>\n</ul>\n<h2>Retrieve Parents of Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term-parents/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of the paths from the parent to child</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_020:0000000\"></span></li>\n</ul>\n\n<h2>Retrieve Properties/Attributes of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-attributes/{termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing the terms property</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve Comments of a Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments?termId={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Array of objects representing a comment</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Login - Retrieve a user's auth token (used for adding and editing ontologies)</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {username}, {password}</li>\n    <li><strong>Returns:</strong> HTTP response with a <code>user</code> cookie in the header that contains a <code>token</code>. You'll need to pass this cookie to subsequent requests that require authentication</li>\n</ul>\n\n<h2>Retrieve Logged-in User information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/login</code></li>\n    <li><strong>Method:</strong> <code>GET</code>. Pass <code>user</code> cookie in request</li>\n    <li><strong>Returns:</strong> Object of the currently logged in user</li>\n</ul>\n\n<h2>Create Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/add-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. Pass <code>user</code> cookie in request. {json} a JSON string representing a list of objects; each object being a term. {ontology_name}, {ontology_id}, {ontology_summary}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<!--\n<h2>Create Term</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/create-term</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {jsonTerm} a JSON representation of the term. You can call this method as many times as you need to build the structure of an ontology. Example: <code>{\"ontology_id: \"CO_22\", \"ontology_name\": \"Sorghum Trait\", \"parent\": \"CO_222:1122\" ...}</code>. As you can see the <strong>parent</strong> property describes the relationship between terms. If parent is <i>null</i> then the term is a ROOT term</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n-->\n\n<h2>Delete Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/delete-ontology</code></li>\n    <li><strong>Method:</strong> <code>POST</code>. {ontologyID}</li>\n    <li><strong>Returns:</strong> HTTP error if something went wrong</li>\n</ul>\n\n<h2>Retrieve IB Fieldbook Default List</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/default-list/?ontologyId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> JSON of the default list of traits, methods and scales of an ontology ID</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_334\"></span></li>\n</ul>\n\n<h2>Retrieve Term Information</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-term/?id={termId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> Object representing a term information. Can be used to update the information of a given term when it is updated</li>\n    <li><strong>Example:</strong> <span class=\"example\" termId=\"CO_321:0000118\"></span></li>\n</ul>\n\n<h2>Retrieve all Comments from an Ontology</h2>\n<ul>\n    <li><strong>URL:</strong> <code>{{URL}}/get-comments-onto/?ontoId={ontologyId}</code></li>\n    <li><strong>Method:</strong> <code>GET</code></li>\n    <li><strong>Returns:</strong> a JSON object that lists the comments and the details about the comments' authors. Comments are grouped by terms</li>\n    <li><strong>Example:</strong> <span class=\"example\" ontologyId=\"CO_321\"></span></li>\n</ul>\n\n</div><!-- /api_left -->\n<div class=\"api_right\" style=\"margin-top:40px\">\n    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n</div><!-- //api_right -->\n";
var page_help = "\n<h2>Video Tutorials</h2>\n<style type=\"text/css\"> \n    \n \n    \n \n#ytvideo,\n#ytvideo2 {\n    float: left;\n    margin-right:10px;\n}\n \n \n.yt_holder {\n    background: #f3f3f3;\n    padding: 10px;\n    float: left;\n    border: 1px solid #e3e3e3;\n    margin-bottom:15px;\n}\n \n \nul {\n    float: left;\n    margin: 0;\n    padding: 0;\n    width: 220px;\n}\n \nul li {\n    list-style-type: none;\n    display:block;\n    background: #f1f1f1;\n    float: left;\n    width: 216px;\n    margin-bottom: 5px;\n    padding:2px;\n \n}\n \nul li img {\n    width: 120px;\n    float: left;\n    margin-right: 5px;\n    border: 1px solid #999;\n}\n \nul li a {\n    text-decoration: none;\n    display: block;\n    color: #000;\n}\n \n.currentvideo {\n    background: #e6e6e6;\n}\n    \n \n    \n</style> \n<script>\n//-------------------------------------------------\n//      youtube playlist jquery plugin\n//      Created by dan@geckonm.com\n//      www.geckonewmedia.com\n//\n//      v1.1 - updated to allow fullscreen \n//           - thanks Ashraf for the request\n//-------------------------------------------------\n\njQuery.fn.ytplaylist = function(options) {\n \n  // default settings\n  var options = jQuery.extend( {\n    holderId: 'ytvideo',\n    playerHeight: '300',\n    playerWidth: '450',\n    addThumbs: false,\n    thumbSize: 'small',\n    showInline: false,\n    autoPlay: true,\n    showRelated: true,\n    allowFullScreen: false\n  },options);\n \n  return this.each(function() {\n                            \n        var selector = $(this);\n        \n        var autoPlay = \"\", autoHide = \"\", hd = \"\", modestBranding = \"\", showInfo = \"&showinfo=0\";\n        var showRelated = \"&rel=0\";\n        var fullScreen = \"\";\n        if(options.autoPlay) autoPlay = \"&autoplay=1\"; \n        if(options.showRelated) showRelated = \"&rel=1\"; \n        if(options.allowFullScreen) fullScreen = \"&fs=1\"; \n        if(options.autoHide) autoHide = \"&autohide=1\";\n        if(options.hd) hd = \"&hd=1\";\n        if(options.modestBranding) modestBranding = \"&modestbranding=1\";\n        if(options.showInfo) showInfo = \"&showinfo=1\";\n\n        var params = autoPlay+showRelated+fullScreen+autoHide+hd+modestBranding+showInfo;\n        \n        //throw a youtube player in\n        function play(id)\n        {\n           var html  = '';\n    \n           html += '<object height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\">';\n           html += '<param name=\"movie\" value=\"http://www.youtube.com/v/'+id+params+'\"> </param>';\n           html += '<param name=\"wmode\" value=\"transparent\"> </param>';\n           if(options.allowFullScreen) { \n                html += '<param name=\"allowfullscreen\" value=\"true\"> </param>'; \n           }\n           html += '<embed src=\"http://www.youtube.com/v/'+id+params+'\"';\n           if(options.allowFullScreen) { \n                html += ' allowfullscreen=\"true\" '; \n            }\n           html += 'type=\"application/x-shockwave-flash\" wmode=\"transparent\"  height=\"'+options.playerHeight+'\" width=\"'+options.playerWidth+'\"></embed>';\n           html += '</object>';\n            \n           return html;\n           \n        };\n        \n        \n        //grab a youtube id from a (clean, no querystring) url (thanks to http://jquery-howto.blogspot.com/2009/05/jyoutube-jquery-youtube-thumbnail.html)\n        function youtubeid(url) {\n            var ytid = url.match(\"[\\\\?&]v=([^&#]*)\");\n            ytid = ytid[1];\n            return ytid;\n        };\n        \n        \n        //load inital video\n        var firstVid = selector.children(\"li:first-child\").addClass(\"currentvideo\").children(\"a\").attr(\"href\");\n        $(\"#\"+options.holderId+\"\").html(play(youtubeid(firstVid)));\n        \n        //load video on request\n        selector.children(\"li\").children(\"a\").click(function() {\n            \n            if(options.showInline) {\n                $(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\").html(play(youtubeid($(this).attr(\"href\"))));\n            }\n            else {\n                $(\"#\"+options.holderId+\"\").html(play(youtubeid($(this).attr(\"href\"))));\n                $(this).parent().parent(\"ul\").find(\"li.currentvideo\").removeClass(\"currentvideo\");\n                $(this).parent(\"li\").addClass(\"currentvideo\");\n            }\n                                                             \n            \n            \n            return false;\n        });\n        \n        //do we want thumns with that?\n        if(options.addThumbs) {\n            \n            selector.children().each(function(i){\n                                              \n                var replacedText = $(this).text();\n                \n                if(options.thumbSize == 'small') {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/2.jpg\";\n                }\n                else {\n                    var thumbUrl = \"http://img.youtube.com/vi/\"+youtubeid($(this).children(\"a\").attr(\"href\"))+\"/0.jpg\";\n                }\n                \n                \n                $(this).children(\"a\").empty().html(\"<img src='\"+thumbUrl+\"' alt='\"+replacedText+\"' />\"+replacedText).attr(\"title\", replacedText);\n                \n            }); \n            \n        }\n            \n        \n   \n  });\n \n};\n\n</script>\n\n<script type=\"text/ecmascript\"> \n    \n        $(function() {\n            $(\"ul.demo2\").ytplaylist({\n                addThumbs:true, \n                autoPlay: false, \n                holderId: 'ytvideo2',\n                playerWidth: 660,\n                playerHeight: 500,\n                autoHide: true,\n                allowFullScreen: true,\n                hd: true,\n                modestBranding: true,\n                showRelated: false\n\n            });\n        });\n    \n</script> \n <div class=\"yt_holder\"> \n    <div id=\"ytvideo2\"></div> \n    <ul class=\"demo2\"> \n        <li><a href=\"http://www.youtube.com/watch?v=ani1SWy1N-g\">Homepage Navigation</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=GiADgYlwmGI\">Login & Registration</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=E67xYagMYe0\">Search</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-5j7AeuFT1A\">OBO Upload</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=HMaQgKPrpwo\">Create New Ontology</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=-aLr_E-JuSM\">API & Feedback</a></li> \n        <li><a href=\"http://www.youtube.com/watch?v=TLo4GpuXHn4\">General Navigation</a></li> \n    </ul> \n</div>\n\n";
var page_login = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/login\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <div class=\"context-loader\" style=\"display: none; top:0px;\">Sending Request...</div>\n                <div class=\"error_box\" style=\"display: none;\">Incorrect login or password.</div>\n                <h1>Login</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"username\" id=\"log_username\" class=\"text\">\n                <label for=\"log_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"password\" value=\"\" tabindex=\"2\" name=\"password\" id=\"log_password\" class=\"text\">\n                <label for=\"log_password\">Password</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <a href=\"./forgot-password\">Forgot Password?</a>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Log in\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_register = "\n<form id=\"register_form\" action=\"\" novalidate=\"novalidate\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"input-field col s6 required\">\n                <input type=\"text\" value=\"\" tabindex=\"1\" name=\"first_name\" id=\"first_name\" class=\"text\">\n                <label for=\"first_name\">First name</label>\n            </div>\n            <div class=\"input-field col s6 required\">\n                <input type=\"text\" value=\"\" tabindex=\"2\" name=\"sirname\" id=\"sirname\" class=\"text\">\n                <label for=\"sirname\">Last name</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s12\">\n                <input type=\"text\" value=\"\" tabindex=\"3\" name=\"institution\" id=\"institution\" class=\"text\">\n                <label for=\"institution\">Host institution</label>\n            </div>\n        </div>\n        <br />\n        <div class=\"row\">\n            <div class=\"input-field col s11 required\">\n                <input type=\"email\" value=\"\" tabindex=\"4\" name=\"email\" id=\"email\" class=\"text\">\n                <label for=\"email\">Email address</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4 required\">\n                <input type=\"text\" value=\"\" tabindex=\"5\" name=\"username\" id=\"reg_username\" class=\"text\">\n                <label for=\"reg_username\">Username</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s4 required\">\n                <input type=\"password\" value=\"\" tabindex=\"6\" name=\"password\" id=\"password\" class=\"text\">\n                <label for=\"password\">Password</label>\n            </div>\n            <div class=\"input-field col s4 required\">\n                <input type=\"password\" value=\"\" tabindex=\"6\" name=\"confirm_password\" id=\"confirm_password\" class=\"text\">\n                <label for=\"confirm_password\">Repeat password</label>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s10\">\n                <center>\n                    <div class=\"g-recaptcha\" data-sitekey=\"6LdssoIUAAAAAIQYYHDi_jMiGHylKTm7JpPiq1GY\"></div>\n                </center>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s10\">\n                <button type=\"submit\" tabindex=\"7\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">Register</button>\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_forgot_password = "\n<form method=\"post\" id=\"login_form\" action=\"http://www.cropontology.org/forgot-password\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col s6 offset-s2\">\n                <h1>Forgot Password?</h1>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"email\" value=\"\" tabindex=\"1\" style=\"width: 21em;\" name=\"email\" id=\"email\" class=\"text\">\n                <label for=\"email\">Please enter your Email</label>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"input-field col s6 offset-s2\">\n                <input type=\"submit\" value=\"Recover\" tabindex=\"3\" name=\"commit\" class=\"btn btn-flat green white-text waves-effect waves-light right\">\n            </div>\n        </div>\n    </div>\n</form>\n";
var page_feedback = "    <div id=\"disqus_thread\"></div>\n    <script type=\"text/javascript\">\n        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n        var disqus_shortname = 'cropontologycurationtool'; // required: replace example with your forum shortname\n\n        // The following are highly recommended additional parameters. Remove the slashes in front to use.\n        // var disqus_identifier = 'unique_dynamic_id_1234';\n        // var disqus_url = 'http://example.com/permalink-to-page.html';\n\n        /* * * DON'T EDIT BELOW THIS LINE * * */\n        (function() {\n            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;\n            dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';\n            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);\n        })();\n    </script>\n    <noscript>Please enable JavaScript to view the <a href=\"http://disqus.com/?ref_noscript\">comments powered by Disqus.</a></noscript>\n";
var page_add_ontology = "<!-- <script type=\"text/javascript\" src=\"./dist/js/add.js\"></script> -->\n\n<h1>Add Ontology</h1>\n<div class=\"row\">\n    <div class=\"col s12\">\n        <ul class=\"tabs add-ontology\">\n            <li class=\"tab col s4\">\n                <a class=\"active tooltipped\" href=\"#upload_excel\" data-tooltip=\"Upload an Excel Trait Template\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"fa fa-upload\"></span> Upload an Excel Trait Template</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"fa fa-upload\"></span> Excel</span>\n                </a>\n            </li>\n            <li class=\"tab col s4\">\n                <a class=\"tooltipped\" href=\"#upload_obo\" data-tooltip=\"Upload an OBO File\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"picol_rdf_document\"></span> Upload an OBO File</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"picol_rdf_document\"></span> OBO</span>\n                </a>\n            </li>\n            <li class=\"tab col s4\">\n                <a class=\"tooltipped\" href=\"#create_ontology\" data-tooltip=\"Create an Ontology\" data-position=\"top\">\n                    <span class=\"hide-on-med-and-down\"><span class=\"picol_rdf\"></span> Create an Ontology</span>\n                    <span class=\"show-on-medium-and-up\"><span class=\"picol_rdf\"></span> Ontology</span>\n                </a>\n            </li>\n        </ul>\n    </div>\n\n    <a class=\"button\" id=\"error\" style=\"display: none; margin-bottom: 10px;\"></a>\n    <div id=\"add_ontology_tab_contents\">\n        <!-- Upload an Excel Trait Template content -->\n        <div id=\"upload_excel\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"upload_excel_cont\" style=\"display: block;\">\n                    <p><b>Note:</b> be sure your template is structured exactly like the latest standard Trait Template which can be found here: <a href=\"http://www.cropontology.org/TD_template_v5.xls\">Trait Dictionary template version 5</a></p>\n\n                    <div class=\"container\">\n                        <form action=\"\" method=\"post\" enctype=\"multipart/form-data\" target=\"excel_upload_iframe\">\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option><option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option><option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                                <div class=\"input-field col s5\">\n                                    <input type=\"text\" name=\"ontology_id\" id=\"ontology_id\">\n                                    <label for=\"ontology_id\">Ontology ID</label>\n                                </div>\n                                <div class=\"input-field col s7\">\n                                    <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                    <label for=\"ontology_name\">Ontology Name</label>\n                                </div>\n                                <div class=\"input-field col s12 m10\">\n                                    <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                    <label for=\"ontology_summary\">Ontology Summary</label>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s8\">\n                                    <div class=\"file-field input-field\">\n                                        <div class=\"btn btn-flat highlight-btn\">\n                                            <span>Browse...</span>\n                                            <input name=\"excelfile\" type=\"file\">\n                                        </div>\n                                        <div class=\"file-path-wrapper\">\n                                            <input class=\"file-path validate\" type=\"text\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <input class=\"btn btn-highlight waves-effect waves-light right\" type=\"submit\" value=\"Upload Excel\">\n                                </div>\n                            </div>\n                        </form>\n                        <iframe name=\"excel_upload_iframe\" style=\"display: none\"></iframe>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Upload an OBO File content -->\n        <div id=\"upload_obo\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"upload_obo_cont\" style=\"display: block;\">\n                    <div class=\"container\">\n                        <form action=\"\" method=\"post\" enctype=\"multipart/form-data\" target=\"obo_upload_iframe\">\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                        <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                        <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                                <div class=\"input-field col s12 m5\">\n                                    <input type=\"text\" name=\"ontology_name\" id=\"ontology_name\">\n                                    <label for=\"ontology_name\">Ontology Name</label>\n                                </div>\n                                <div class=\"input-field col s12 m10\">\n                                    <textarea class=\"materialize-textarea\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea>\n                                    <label for=\"ontology_summary\">Ontology Summary</label>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    <div class=\"file-field input-field\">\n                                        <div class=\"btn btn-flat highlight-btn\">\n                                            <span>Browse...</span>\n                                            <input name=\"obofile\" type=\"file\">\n                                        </div>\n                                        <div class=\"file-path-wrapper\">\n                                            <input class=\"file-path validate\" type=\"text\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <input class=\"btn btn-highlight waves-effect waves-light right\" type=\"submit\" value=\"Upload OBO\">\n                                </div>\n                            </div>\n                        </form>\n                        <iframe name=\"obo_upload_iframe\" style=\"display: none\"></iframe>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Create an Ontology -->\n        <div id=\"create_ontology\" class=\"col s12\">\n            <div class=\"tab-content\">\n                <div id=\"create_ontology_cont\" style=\"\">\n                    <p><b>Note:</b> this feature is not fully supported. For instance, deleting terms or term attributes is not possible.</p>\n\n                    <div class=\"container\">\n                        <form>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12 m8\">\n                                    Category:\n                                    <select name=\"category\">\n                                        <option value=\"010-089 General Germplasm Ontology\">010-089 General Germplasm Ontology</option>\n                                        <option value=\"090-099 Taxonomic Ontology\">090-099 Taxonomic Ontology</option>\n                                        <option value=\"100-299 Plant Anatomy &amp; Development Ontology\">100-299 Plant Anatomy &amp; Development Ontology</option>\n                                        <option value=\"300-499 Phenotype and Trait Ontology\" selected=\"\">300-499 Phenotype and Trait Ontology</option>\n                                        <option value=\"500-699 Structural and Functional Genomic Ontology\">500-699 Structural and Functional Genomic Ontology</option>\n                                        <option value=\"700-799 Location and Environmental Ontology\">700-799 Location and Environmental Ontology</option>\n                                        <option value=\"800-899 General Science Ontology\">800-899 General Science Ontology</option>\n                                        <option value=\"900-999 Other (Sub-domain or Site-Specific) Ontology\">900-999 Other (Sub-domain or Site-Specific) Ontology</option>\n                                    </select>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"col s12\">\n                                    <ul class=\"treeview\" id=\"cont\">\n                                        <li class=\"last\" id=\"ontology\">\n                                            <div class=\"row\">\n                                                <div class=\"input-field col s8 m4 l4\">\n                                                    <input type=\"text\" id=\"ontology_name\" name=\"name\">\n                                                    <label for=\"ontology_name\">Ontology Name</label>\n                                                </div>\n                                                <div class=\"input-field col s3 m3\">\n                                                    <input type=\"text\" id=\"ontology_id\" name=\"id\">\n                                                    <label for=\"ontology_id\">Ontology ID</label>\n                                                </div>\n                                                <div class=\"col s11 m4\">\n                                                    <div class=\"row\">\n                                                        <div class=\"input-field col s12\">\n                                                            <input type=\"text\" id=\"ontology_summary\" name=\"ontology_summary\">\n                                                            <!-- <textarea class=\"materialize-textarea autoresize\" name=\"ontology_summary\" id=\"ontology_summary\"></textarea> -->\n                                                            <label for=\"ontology_summary\">Ontology Summary</label>\n                                                        </div>\n                                                    </div>\n                                                </div>\n                                                <div class=\"input-field col s1\">\n                                                    <a id=\"add_childs_btn\" class=\"btn btn-highlight btn-small btn-floating waves-effect waves-circle waves-light tooltipped\" data-tooltip=\"Add childs\" data-position=\"top\">\n                                                        <span class=\"fa fa-plus\"></span>\n                                                    </a>\n                                                </div>\n                                            </div>\n                                        </li>\n                                    </ul>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"input-field col s12\">\n                                    <a id=\"save\" class=\"btn btn-highlight waves-effect waves-light disabled right\">Save</a>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n</div>\n\n<!-- <ul class=\"treeview\" id=\"term_tmpl\" style=\"display: none;\">\n    <li class=\"last term\">\n        <input type=\"text\" name=\"name\" placeholder=\"Term Name\" />\n        <input type=\"text\" name=\"relation_name\" placeholder=\"Relation Name\" />\n        <a title=\"Add\" class=\"add minibutton btn-watch\"><span>+</span></a>\n        <a title=\"Remove\" class=\"remove minibutton btn-watch\"><span>-</span></a>\n    </li>\n</ul> -->\n";


var DATA = new _data2.default(),
    NAV = new _navigation2.default(),
    PAGINATION = new _pagination2.default(),
    TREEVIEW = new _treeview2.default(),
    FILTERS = new _filters2.default(),
    MODALS = new _modals2.default(),
    STR = new _str2.default(),
    LOADER = new _loader2.default(),
    URL = "http://www.cropontology.org",
    PAGE_ABOUT = page_about,
    PAGE_PRIVACY_POLICY = page_privacy_policy,
    PAGE_API = page_api.replace(/\{\{URL\}}/igm, window.location).replace(/((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g, ""),
    PAGE_HELP = page_help,
    PAGE_LOGIN = page_login,
    PAGE_REGISTER = page_register,
    PAGE_FORGOT_PASSWORD = page_forgot_password,
    PAGE_FEEDBACK = page_feedback,
    PAGE_ADD_ONTOLOGY = page_add_ontology,
    page = NAV.get_page(),
    settings = require("../../common/settings/contents.json"),
    languages = require("../../common/settings/languages.json"),
    moment = require("moment"),
    user = {
	logged: false
};

if (settings[page] == undefined) {
	page = "404";
}

var layout = function () {
	function layout() {
		_classCallCheck(this, layout);
	}

	_createClass(layout, [{
		key: "activate",
		value: function activate() {
			/* Add rel="external" to links that are external (this.hostname !== location.hostname) BUT don't add to anchors containing images */
			$("#static_contents a, .license a").each(function (k, v) {
				// Compare the anchor tag's host name with location's host name
				if ($(v).prop("hostname") && $(v).prop("hostname") !== location.hostname && $(v).prop("hostname") !== "www.cropontology.org") {
					$(v).not("a:has(img)").attr("rel", "external");
				}
			});

			$("select").material_select();

			// Modals
			$(".modal").modal({
				dismissible: true,
				opacity: 0.8,
				ready: function ready(modal, trigger) {},
				complete: function complete() {
					// this.add_search_filters($(".modal-content").find("form").serializeObject());
					// $("#tags").tagit("createTag", "brand-new-tag");

					// 	$(".modal-content").find("form").serializeObject();//.reduce(function(obj, item) {obj[item.name] = item.value; return obj; }, {}))
					// }
				}
			});

			// Sidenav
			$(".button-collapse").sideNav({ edge: "right" });

			var search_data = {};
			$("input.autocomplete").on("keyup", function (e) {
				var start_search_after = 3,
				    reg = new RegExp("[\\w\\d\\\\\/\\-\\_\\p{L}]");

				// Intercept only word, digits and allowed special characters (see regex above)
				if ($("input.autocomplete").val().length > start_search_after && reg.test(e.key)) {
					// The search loader
					LOADER.create({
						type: "circular",
						size: "micro",
						colour: "yellow",
						target: "#search_loader"
					});
					DATA.search($("input.autocomplete").val()).then(function (data) {
						LOADER.hide("#search_loader", true);
						$.each(data, function (k, v) {
							search_data["<small><tt>" + v.id + "</tt></small> - " + v.ontology_name + " - " + STR.get_ontology_term(JSON.stringify(v.name))] = null;
						});

						$("input.autocomplete").autocomplete({
							data: search_data,
							minLength: start_search_after,
							limit: 50,
							onAutocomplete: function onAutocomplete(val) {
								location.href = "./terms/" + val.replace(/ \- (.*?) \- /g, "/");
							}
						}).blur().focus();
					});
				}
			});

			$(".collapsible").collapsible();

			$(".tooltipped").tooltip({ html: true });

			$(".materialboxed").materialbox();

			$(".parallax").parallax();

			$(".tabs:not(.add-ontology)").tabs();

			$("textarea.autoresize").trigger("autoresize");

			/**
    * Behaviours after page build
    * ---------------------------------------------------------------------
    */
			switch (page) {
				case "home":
					// Add the loader for news and info contents
					LOADER.create({ target: ".help", type: "progress" });
					break;
				case "ontology":
					// Add the loader for news and info contents
					LOADER.create({ target: "#contents", type: "progress" });
					break;
				case "register":
					$.validator.setDefaults({
						errorClass: 'invalid',
						validClass: "valid",
						errorPlacement: function errorPlacement(error, element) {
							$(element).closest("form").find("label[for='" + element.attr("id") + "']").attr('data-error', error.text());
						},
						submitHandler: function submitHandler(form) {
							if (grecaptcha.getResponse().length == 0) {
								DATA.register_user($("#register_form").serializeObject()).then(function (response) {
									if (response.message !== undefined) {
										Materialize.toast('<span class="fa fa-2x fa-check grey-text"></span> ' + response.message, 2000, "", function () {
											location.reload();
										});
									} else {
										$("#register_form :input").blur().removeClass("invalid").removeClass("valid");
										Materialize.toast('<span class="fa fa-2x fa-times grey-text"></span> ' + response.error, 4000);
									}
								});
							}
						}
					});
					$("#register_form").validate({
						rules: {
							first_name: {
								required: true
							},
							sirname: {
								required: true
							},
							email: {
								required: true,
								email: true
							},
							username: {
								required: true,
								minlength: 2
							},
							password: {
								required: true,
								minlength: 5
							},
							confirm_password: {
								required: true,
								minlength: 5,
								equalTo: "#password"
							}
						},
						messages: {
							first_name: "Please specify your name",
							sirname: "Please specify your last name",
							email: {
								required: "Please specify an e-mail address",
								email: "Your email address must be in the format of name@domain.com"
							},
							username: {
								required: "Please insert an username",
								minlength: "Your username must consist of at least 2 characters"
							},
							password: {
								required: "Please insert a password",
								minlength: "Your password must be at least 5 characters long"
							},
							confirm_password: {
								required: "Please insert a password",
								minlength: "Your password must be at least 5 characters long",
								equalTo: "Please enter the same password as before"
							}
						}
					});
					break;
			}

			// Adapt graph on fullscreen mode
			$(document).bind("fscreenchange", function (e, state, elem) {
				if ($(elem).attr("id") == "graph") {
					if (state) {
						$(".fa-expand").removeClass("fa-expand").addClass("fa-compress");

						$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Exit fullscreen").click(function (e) {
							$.fullscreen.exit();
						});
					} else {
						$(".fa-compress").removeClass("fa-compress").addClass("fa-expand");

						$("#graph.fullscreen").find(".btn.fullscreen").attr("data-tooltip", "Show fullscreen");
					}
				}
			});
		}

		/**
   * Build a menu
   * @param  string 						position							The menu position
   * @return object
   */

	}, {
		key: "build_menu",
		value: function build_menu(position) {
			var menus = require("../../common/settings/menu.json");

			$.each(menus, function (k, v) {
				$("#" + position).append($.map(v[position].items, function (item, k) {
					switch (position) {
						case "top_menu":
							var display = !item.is_sidenav_link ? k >= 6 ? " hide-on-med-and-down" : " hide-on-small-only" : "";

							if (item.label === undefined && item.separator) {
								switch ($.type(item.separator)) {
									case "boolean":
										return $('<li>', { "class": display }).append($('<span>', { "class": "separator" }));
										break;
									case "string":
										return $('<li>', { "class": "disabled black-text" + display }).append($('<span>').text(item.separator));
										break;
								}
							} else {
								if (item.display) {
									var $li = $('<li>').append($('<a>', {
										"href": item.link,
										"class": item.class + display
									}).append(function () {
										if (!item.is_sidenav_link) {
											return item.label;
										} else {
											return $('<i>', { "class": "material-icons" }).text("menu");
										}
									}));
									if (item.data !== undefined) {
										$.each(item.data, function (data_key, data_value) {
											$li.find("a").attr("data-" + data_key, data_value);
										});
									}
									if (item.is_sidenav_link) {
										$li.addClass("right show-on-medium-and-down");
									}
									return $li;
								}
							}
							break;
						case "bottom_links":
							$.each(item.items, function (ik, iv) {
								if (iv.display) {
									$("#" + position + " ." + item.position).append($('<a>', { "class": "tooltipped", "href": iv.link, "target": iv.target, "data-tooltip": iv.label }).append($('<img>', { "class": "", "src": "common/media/img/" + iv.image })));
								}
							});
							break;
						case "footer_menu":
							$("#" + item.position).prepend($('<h2>').html(item.title));
							$("#" + item.position).append($('<ul>', { "class": item.class }));
							$.each(item.items, function (ik, iv) {
								$("#" + item.position).find("ul").append(function () {
									if (iv.display) {
										return $('<li>').append($('<a>', { "href": iv.link, "target": iv.target, "data-tooltip": iv.label, "class": "tooltipped" }).append(iv.icon !== undefined ? $('<span>', { "class": iv.icon }) : iv.label));
									}
									if (iv.separator !== undefined) {
										return $('<li>', { "class": "separator" });
									}
								});
							});
							break;
						default:
							if (item.label === undefined && item.separator) {
								switch ($.type(item.separator)) {
									case "boolean":
										return $('<li>', { "class": "divider" }).append($('<span>', { "class": "separator" }));
										break;
									case "string":
										return $('<li>', { "class": "disabled black-text" }).append($('<span>').text(item.separator));
										break;
								}
							} else {
								if (item.display) {
									return $('<li>').append($('<a>', { "href": item.link, "class": item.class }).text(item.label));
								}
							}
							break;
					}
				}));
			});
		}

		/**
   * Build the page <header>
   * @return {[type]} [description]
   */

	}, {
		key: "build_header",
		value: function build_header() {
			$("body").prepend($("<header>").append($('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "src": "common/media/img/crop_ontology.png" }))).append(
			// Sidenav
			$('<ul>', { "id": "sidenav", "class": "side-nav" }).append($('<li>', { "class": "row-control" }).append($('<a>', { "href": "javascript:;" }).append($('<i>', { "class": "material-icons" }).text("close")).append("Close").click(function () {
				$(".button-collapse").sideNav("hide");
			}))
			// ).append(
			// $('<li>', {"class": "divider"})
			)).append(
			// Top menu container
			$('<ul>', { "id": "top_menu", "class": "right" })))));

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("sidenav");

			/**
    * Build the top menu
    * @uses build_menu()
    */
			this.build_menu("top_menu");
		}

		/**
   * Build the carousel messages slider
   */

	}, {
		key: "build_carousel",
		value: function build_carousel() {
			var path = STR.ucfirst(NAV.get_url_path()[NAV.get_url_path().length - 1]),
			    title = "",
			    subtitle = "";

			if (settings.general.carousel.visible && settings[page].carousel.visible) {
				$("body").append($('<section>', { "id": "top_carousel", "class": "" }).append($('<div>', { "class": "carousel carousel-slider center" }).append($('<div>', { "class": "carousel-fixed-item container" }).append($('<div>', { "class": "left" }).append(function () {
					if (page == "404") {
						return $('<h1>', { "id": "page_subtitle" }).text(page);
					} else if (settings[page].subtitle !== undefined && settings[page].subtitle !== "") {
						return $('<h1>', { "id": "page_subtitle" }).text(settings[page].subtitle);
					}
				}).append($('<h1>', { "id": "page_title" }).text(settings[page].title)))).append($.map(settings[page].carousel.items, function (v) {
					return $('<div>', { "class": "carousel-item valign-wrapper", "href": "#one" }).append(function () {
						if (v.image !== "") {
							return $('<img>', { "src": "common/media/img/carousel_images/" + v.image, "class": "responsive-img" });
						}
					}).append($('<h1>').html(STR.nl2br(v.message).replace(/\[(.*?)\]/gm, '<span class="highlight">$1</span>')));
				}))));

				// Instantiate Materialize carousel
				$(".carousel").carousel({
					duration: 50,
					fullWidth: true,
					indicators: false
				}).animate({ "opacity": 1 }, 300);

				if (settings[page].carousel.items.length == 1) {
					$(".carousel").css("pointer-events", "none");
				}

				/**
    * Animate the carousel
    * @param integer						time						The delay after carousel change (default is 10'000)
    */
				if (settings.general.carousel.animate && settings[page].carousel.items.length > 1) {
					setInterval(function () {
						// $(".carousel .carousel-item").fadeOut(300, () => {
						$(".carousel").carousel("next");
						// $(".carousel .carousel-item").delay(300).fadeIn();
						// })
					}, settings.general.carousel.time);
				}
			} else {
				/**
     * Set page title & subtitle
     * @note
     */
				var _title = "",
				    _subtitle = "";
				switch (page) {
					case "ontology":
						_title = NAV.get_ontology_id();
						_subtitle = STR.camel_case_2_text(NAV.get_ontology_label());
						break;
					case "terms":
						_title = '<a href="./terms/CO_020">' + NAV.get_ontology_id() + "</a><small>:" + NAV.get_term_id() + "</small>";
						_subtitle = STR.camel_case_2_text(NAV.get_term_label());
						break;
					default:
						_title = settings[page].title;
						_subtitle = settings[page].subtitle;
						break;
				}

				$("body").append($('<div>', { "id": "ontology_card", "class": "row container" }).append($('<h1>', { "id": "page_subtitle" }).html(_title)).append($('<h2>', { "id": "page_title" }).text(_subtitle)));
			}
		}

		/**
   * Build the searchbar
   */

	}, {
		key: "build_searchbar",
		value: function build_searchbar() {
			// Build the filters modal
			// MODALS.filters_modal();

			if (settings.general.search.visible) {
				var $searchbar = $('<div>', { "class": "bar" }).append(
				// Layout for search with tags
				// $('<div>', {"id": "search_input", "class": "input-field col s8 m8 l8 xl8"}).append(
				$('<div>', { "id": "search_input", "class": "input-field", "style": "width:100%;" }).append($('<input>', {
					"type": "search",
					"id": "search",
					"autocomplete": "off",
					"class": "autocomplete",
					"placeholder": "Search...",
					"name": "q"
				}))).append($('<div>', { "id": "search_loader" })),
				    $breadcrumbs = $('<nav>', { "class": "transparent z-depth-0" }).append($('<div>', { "class": "nav-wrapper" }).append($('<div>', { "class": "col s12" }).append($('<a>', { "href": "./", "class": "breadcrumb" }).append($('<span>', { "class": "fas fa-home" }))).append(function () {
					if (NAV.get_url_path().length > 1) {
						switch (page) {
							case "ontology":
								return $('<span>', { "class": "breadcrumb" }).html($('<tt>').append(NAV.get_ontology_id())).append(" ").append($("<span>", { "class": "page_name" }).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_ontology_label()))));
								break;
							case "terms":
								return $('<span>', { "class": "breadcrumb" }).html($('<tt>').append(NAV.get_ontology_id()).append($('<small>').append(":" + NAV.get_term_id()))).append(" ").append($("<span>", { "class": "page_name" }).append(STR.ucfirst(STR.camel_case_2_text(NAV.get_term_label()))));
								break;
							default:
								return $('<span>', { "class": "breadcrumb" }).html(STR.ucfirst(STR.camel_case_2_text(v.replace(NAV.get_ontology_url_regex(":"), "<tt>$1</tt> $2"))));
								break;
						}
					} else {
						return $('<span>', { "class": "breadcrumb" }).text(STR.ucfirst(NAV.get_page()));
					}
				})));

				if (page == "home") {
					$("body").append($('<section>', { "id": "searchbar", "class": "container" }).append($('<form>', { "method": "get", "onsubmit": "return false;" }).append($('<div>', { "class": "" }).append($('<div>', { "class": "row" }).append($searchbar).append(function () {
						if (settings.general.search.tags.visible) {
							return $('<div>', { "id": "tags_list", "class": "input-field col s4 m4 l4 xl4" }).append($('<ul>', { "class": "tags" }).append(FILTERS.draw_filter("type", "TRAIT")).append(FILTERS.draw_filter("user", "MALAPORTE")));
						}
					})).append(function () {
						if (settings.general.search.filters.visible) {
							return $('<a>', { "href": "#searchbar_filters", "class": "btn-text blue-text right modal-trigger" }).append($('<span>', { "class": "fa fa-filter" })).append(" Add a filter");
						}
					}))));
				} else {
					$("body").append($('<section>', { "id": "navbar", "class": "container" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "searchbar", "class": "col s12 m8 l6 right" }).append($searchbar)).append($('<div>', { "id": "breadcrumb", "class": "col s12 m4 l6 left" }).append($breadcrumbs))));
				}
			}
		}

		/**
   * Build the halfway menu
   */

	}, {
		key: "build_halfway_menu",
		value: function build_halfway_menu() {
			if (settings.general.halfway_menu.visible) {
				$("body").append($('<section>', { "id": "halfway", "class": "" }).append($('<ul>', { "id": "halfway_menu", "class": "center horizontal" })));

				/**
     * Build the top menu
     * @uses build_menu()
     */
				this.build_menu("halfway_menu");
			}
		}

		/**
   * Build the contents section
   * @uses build_page_contents()
   */

	}, {
		key: "build_contents_section",
		value: function build_contents_section() {
			/**
    * Content container
    */
			$("body").append($('<section>', { "id": "contents", "class": "" }).append(function () {
				switch (page) {
					/**
     * Home layout
     * -------------------------------------------------------------
     */
					case "home":
						return $('<div>', { "class": "row" }).append($('<div>', { "id": "ontologies_container", "class": "col s12 m12 l8 xl8 right" }).append($('<div>', { "class": "center-align" }).text(settings.general.loader.text))).append($('<div>', { "class": "col s12 m12 l4 xl4 left" }).append($('<div>', { "class": "row" }).append($('<div>', { "id": "info_container", "class": "col s12 m12 l12 xl12" }).append($('<div>', { "class": "card lighten-5" }).append($('<div>', { "class": "card-content" }).append($('<span>', { "class": "card-title highlight" })).append(
						// Loader
						// ---------------------------------
						$('<div>', { "class": "help" }).append()
						// $('<div>', {"class": "center-align"}).text(settings.general.loader.text)

						// ---------------------------------
						)))).append($('<div>', { "id": "feed_container", "class": "col s12 m12 l12 xl12" }))));
						break;
					case "latest":
						return $('<div>', { "class": "container" }).append($('<div>', { "id": "ontologies_container", "class": "col s12 m8 l8 xl8" }).append($('<div>', { "class": "center-align" }).text(settings.general.loader.text)));
						break;
					default:
						return $('<div>', { "id": "page_content", "class": "container" });
						break;
				}
			}));

			/**
    * Get and place contents in the page
    */
			this.build_page_contents();
		}

		/**
   * Build pages contents
   */

	}, {
		key: "build_page_contents",
		value: function build_page_contents() {
			DATA.get_user_logged();

			// Build the user account modal
			MODALS.user_modal("Login");

			switch (page) {
				/**
     * 							404 contents
     * -----------------------------------------------------------------
     */
				case "404":
					$("#contents .container").append($('<center>', { "class": "flow-text" }).text("The page you are looking for does not exists"));
					break;
				/**
     * 							HOME contents
     * -----------------------------------------------------------------
     */
				case "home":
					/**
      * Info
      * -------------------------------------------------------------
      */
					DATA.get_help_content().then(function (data) {
						if (settings.home.sections.help.visible) {
							// LOADER.hide("#help");
							$("#info_container .card-title").append($('<small>', { "class": "far fa-question-circle grey-text" })).append(" " + settings.home.sections.help.title);
							$("#info_container .card-content .help").html(data[0].content.replace("<ul>", '<ul class="browser-default">'));
							// return data[0].content;
						}
					});

					/**
      * Feeds
      * -------------------------------------------------------------
      */
					DATA.get_community_website_feed().then(function (data) {
						if (settings.home.sections.news.visible) {
							var $feeds = [],
							    feeds = [],
							    total_pages = Math.ceil(parseInt(data.length) / settings.home.sections.news.items_per_page),
							    visible_data = 0,
							    current_page = 0,
							    visible;

							$.each(data, function (k, v) {
								if (v.category[0].label == "announcement") {
									visible_data++;
									if (visible_data % parseInt(settings.home.sections.news.items_per_page + 1) == 0) {
										current_page++;
									}

									feeds.push({
										page: current_page,
										visible: current_page == 0 ? "visible" : "hide",
										title: v.title,
										preview: v.preview,
										author: $('<a>', { "href": "mailto:" + v.author.email }).text(v.author.name).prop("outerHTML"),
										published: moment(v.published).local().format("MMM DD, YYYY"),
										link: v.link,
										abstract: STR.extract_text(v.content) + "<br />"
									});
								}
							});
							$.each(feeds, function (k, v) {
								$feeds.push($('<div>', { "class": "feed page_" + v.page + " " + v.visible }).append($('<div>', { "class": "preview" }).append($('<a>', { "href": v.link }).append($(v.preview)))).append($('<span>', { "class": "card-title highlight" }).append($('<a>', { "href": v.link }).text(v.title))).append($('<div>', { "class": "release" }).append($('<span>', { "class": "far fa-fw fa-clock" })).append($('<span>').html(" " + v.published + " by " + v.author))
								// Uncomment below if you want the "abstract" content and the "Read more..." button on each news
								//
								// ).append(
								// 	$('<div>', {"class": "content"}).append(
								// 		v.abstract
								// 	).append(
								// 		$('<a>', {"href": v.link, "class": "readmore"}).text("Read more...")
								// 	)
								));
							});

							$("#feed_container").append($('<div>', { "class": "card z-depth-1" }).append($('<div>', { "class": "card-content" }).append($('<div>', { "class": "card-title highlight" }).append(settings.home.sections.news.title))).append($('<div>', { "class": "card-content" }).append($feeds

							// Uncomment below if you want news pagination
							//
							// PAGINATION.build_pagination({
							// 	id: "feed_pagination",
							// 	content: "#feed_container",
							// 	items: ".feed",
							// 	current_page: 1,
							// 	total_pages: Math.ceil(parseInt(data.length)/settings.home.sections.news.items_per_page),
							// })
							)).append($('<div>', { "class": "card-action right-align" }).append($('<a>', { "class": "btn btn-flat highlight-btn", "href": "https://sites.google.com/a/cgxchange.org/cropontologycommunity/" }).text("Read more...")))).slideDown(300);
						}
					}).catch(function (e) {
						// handle the error
					});

					/**
      * Ontologies
      * -------------------------------------------------------------
      */
					LOADER.create({ target: "#ontologies_container", type: "progress" });

					DATA.get_ontologies().then(function (data) {
						LOADER.hide("#ontologies_container .progress", true);

						if (settings.home.sections.ontologies.visible) {
							$("#ontologies_container").html($('<h5>').text("Ontologies")).append($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" }));

							var current_page = 1,
							    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							    page_content = [];

							if (page_limit <= 0) {
								page_limit = 1;
							}

							$("#ontologies_container .collapsible").append($('<li>').append($('<div>', { "class": "collapsible-header grey-text" }).append($('<div>', { "class": "collapsible-secondary help-text" }).append($('<span>', { "class": "fa fa-chevron-right" }))).append($('<div>', { "class": "truncate" }).append($('<span>', { "class": "picol_news" })).append("See latest")).click(function () {
								window.location.href = "./latest";
							})));
							/**
        * Cycle categories (5 items)
        */
							$.each(data, function (k, categories) {
								var page = 0,
								    pages = categories.ontologies.length > page_limit ? Math.ceil(categories.ontologies.length / page_limit) : 1,
								    page_count = 0,
								    $pagination = $('<div>', { "class": "ontology_pagination pagination-content" }),
								    $ontology_page = null;

								$("#ontologies_container .collapsible").append($('<li>', {
									"class": k == 3 ? "active" : "",
									"id": categories.category.id
								}).append($('<div>', { "class": "collapsible-header " + (k == 3 ? "active" : "") }).append($('<div>', { "class": "collapsible-secondary help-text" }).append(categories.ontologies.length + " " + STR.pluralize(categories.ontologies.length, "item")).append(function () {
									if (pages > 1) {
										var $indications = $('<span>', {
											"class": "tooltipped",
											"data-tooltip": "Displaying page " + current_page + " of " + pages + " - " + page_limit + " items per page"
										}).append(" | ").append($('<span>', { "class": "far fa-file-alt" })).append($('<span>', { "id": "page_no", "class": "grey-text" }).text(current_page)).append("/" + pages).prop("outerHTML");

										setTimeout(function () {
											$("#ontologies_container .tooltipped").tooltip({ position: "left" });
										}, 1000);
										return $indications;
									}
								})).append($('<div>', { "class": "truncate" }).append($('<span>', { "class": categories.category.icon })).append($('<span>', {
									"class": "tooltipped",
									"data-tooltip": categories.category.name,
									"data-position": "top"
								}).text(categories.category.name)))).append($('<div>', { "class": "collapsible-body" + (pages > 0 ? " paginated" : "") }).append(function () {
									if (pages > 1) {
										return $pagination;
									}
								}).append($('<ul>', { "id": "ontology_container" }).append(
								/**
         * Cycle all ontologies
         */
								$.map(categories.ontologies, function (vv, kk) {
									page_count = kk + 1;

									/**
          * Subdivide ontologies in pages
          */
									if (page_count % page_limit == 1 || page_limit == 1) {
										page++;

										var display = page == 1 || pages == 1 ? "" : "hide";
										$ontology_page = $('<li>', { "class": "ontology page_" + page + " " + display }).append($('<ul>', { "class": "collection" }));
									}
									$ontology_page.find(".collection").append($('<li>', { "class": "collection-item" }).append($('<a>', {
										"href": "./ontology/" + vv.ontology_id + ":" + vv.ontology_name.replace("/", "-")
									}).append($('<h2>').append(vv.ontology_name))).append($('<div>', { "class": "secondary-content" }).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "Ontology RSS",
										"data-delay": "0",
										"target": "_blank",
										"href": "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/rss"
									}).append($('<span>', { "class": "fa fa-rss-square" }))).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "RDF N-Triples",
										"data-delay": "0",
										"target": "_blank",
										"href": "https://www.cropontology.org/ontology/" + vv.ontology_id + "/" + vv.ontology_name.replace("/", "-") + "/nt"
									}).append($('<span>', { "class": "picol_rdf_document" })))).append($('<span>', { "class": "items_count" }).text(vv.tot + " " + STR.pluralize(vv.tot, "item"))).append($('<p>').text(vv.ontology_summary)));
									return $ontology_page;
								}))).append(function () {
									if (pages > 1) {
										return $pagination.clone();
									}
								}))).collapsible();

								$("#" + categories.category.id).find(".pagination-content").append(PAGINATION.build_pagination({
									id: "ontology_pagination",
									context_class: categories.category.id,
									content: "#ontology_container",
									items: ".ontology",
									total_pages: pages
								}));
							});
						}
					}).catch(function (e) {
						// handle the error
					});
					break;
				/**
    			 * 							LATEST ONTOLOGIES AND NEWS contents
     * -----------------------------------------------------------------
    			 */
				case "latest":
					LOADER.create({ target: "#ontologies_container", type: "progress" });

					DATA.get_latest_ontologies().then(function (latest) {
						LOADER.hide("#ontologies_container .progress", true);

						if (settings.latest.visible) {
							$("#ontologies_container").html($('<ul>', { "class": "collapsible z-depth-0", "data-collapsible": "accordion" }));

							var current_page = 1,
							    page_limit = parseInt(settings.home.sections.ontologies.items_per_page),
							    page_content = [];

							if (page_limit <= 0) {
								page_limit = 1;
							}

							/**
        * Cycle categories (5 items)
        */
							$.each(latest, function (k, categories) {
								$("#ontologies_container .collapsible").append($('<li>', {
									"class": k == "latestOntos" ? "active" : "",
									"id": k
								}).append($('<div>', { "class": "collapsible-header " + (k == "latestOntos" ? "active" : "") }).append($('<div>', { "class": "left" }).append($('<span>').text(STR.ucfirst(STR.camel_case_2_text(k.replace("Ontos", "Ontologies"))) + " (top 10)")))).append($('<div>', { "class": "collapsible-body" }).append($('<ul>', { "id": "ontology_container" }).append($.map(categories, function (vv, kk) {
									var name = "",
									    href = "",
									    rss = "",
									    nt = "",
									    summary = "",
									    author = "";

									if (k == "latestOntos") {
										name = vv.ontology_name;
										href = "./ontology/" + vv.ontology_id + ":" + name.replace("/", "-");
										rss = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/rss";
										nt = "http://www.cropontology.org/ontology/" + vv.ontology_id + "/" + name.replace("/", "-") + "/nt";
										summary = STR.ucfirst(vv.ontology_summary), author = vv.username;
									} else {
										name = STR.get_ontology_term(vv.name);
										href = "./terms/" + vv.id + ":" + name.replace("/", "-");
										rss = "http://www.cropontology.org/ontology/" + vv.id + "/" + name.replace("/", "-") + "/rss";
										nt = "http://www.cropontology.org/ontology/" + vv.id.split(":")[0] + "/" + (vv.ontology_name == null || vv.ontology_name == "null" ? "" : vv.ontology_name.replace("/", "-")) + "/nt";
										summary = "", author = vv.author;
									}
									return $('<ul>', { "class": "collection" }).append($('<li>', { "class": "collection-item" }).append($('<a>', {
										"href": href
									}).append($('<h2>').append(name))).append($('<div>', { "class": "secondary-content" }).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "Ontology RSS",
										"data-delay": "0",
										"target": "_blank",
										"href": rss
									}).append($('<span>', { "class": "fa fa-rss-square" })).tooltip()).append($('<a>', {
										"class": "download tooltipped",
										"data-position": "top",
										"data-tooltip": "RDF N-Triples",
										"data-delay": "0",
										"target": "_blank",
										"href": nt
									}).append($('<span>', { "class": "picol_rdf_document" })).tooltip())).append($('<a>', { "href": "javascript:;", "class": "tag green" }).text(author)).append(function () {
										if (summary.length > 0) {
											return $('<p>').html(summary);
										}
									}));
								}))))).collapsible();
							});
						}
					});
					break;
				/**
    			 * 							CONTACT US contents
     * -----------------------------------------------------------------
    			 */
				case "contact-us":
				case "contact us":
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "contact_form").append($('<form>', {
						"method": "get",
						"onsubmit": "return false;"
					}).append($('<div>', { "class": "row" }).append($('<form>', { "class": "col s12 m6 offset-m3" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "first_name", "class": "validate" })).append($('<label>', { "for": "first_name" }).text("First name"))).append($('<div>', { "class": "input-field col s6" }).append($('<input>', { "type": "text", "id": "last_name", "class": "validate" })).append($('<label>', { "for": "last_name" }).text("Last name"))).append($('<div>', { "class": "input-field col s12" }).append($('<input>', { "type": "email", "id": "email", "class": "validate" })).append($('<label>', { "for": "email" }).text("E-mail address")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s10" }).append($('<input>', { "type": "text", "id": "subject", "class": "validate" })).append($('<label>', { "for": "subject" }).text("Subject"))).append($('<div>', { "class": "input-field col s12" }).append($('<textarea>', { "id": "message", "class": "materialize-textarea" })).append($('<label>', { "for": "message" }).text("Message"))).append(
					// Google reCAPTCHA
					$('<div>', { "class": "g-recaptcha right", "data-sitekey": "6LdssoIUAAAAAIQYYHDi_jMiGHylKTm7JpPiq1GY" }))).append($('<div>', { "class": "row" }).append($('<a>', { "class": "btn btn-flat right waves-effect waves-light", "href": "javascript:;" }).text("Send"))))));
					break;
				/**
     * 							ABOUT contents
    * -----------------------------------------------------------------
     */
				case "about":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_ABOUT);
					break;
				/**
     * 							PRIVACY POLICY contents
    * -----------------------------------------------------------------
     */
				case "privacy-policy":
				case "privacy policy":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_PRIVACY_POLICY);
					break;
				/**
     * 							API contents
     * -----------------------------------------------------------------
     */
				case "api":
				case "API":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_API);
					break;
				/**
     * 							HELP contents
     * -----------------------------------------------------------------
     */
				case "help":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_HELP);
					break;
				/**
     * 							LOGIN contents
     * -----------------------------------------------------------------
     */
				case "login":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_LOGIN);
					break;
				/**
     * 							REGISTER contents
     * -----------------------------------------------------------------
     */
				case "register":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_REGISTER);
					break;
				/**
     * 							FORGOT-PASSWORD contents
     * -----------------------------------------------------------------
     */
				case "forgot-password":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_FORGOT_PASSWORD);
					break;
				/**
     * 							FEEDBACK contents
     * -----------------------------------------------------------------
     */
				case "feedback":
					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_FEEDBACK);
					break;
				/**
     * 							ADD-ONTOLOGIES contents
     * -----------------------------------------------------------------
     */
				case "add-ontology":

					// -------------------------------------------------------------

					// Place the external html page
					$("#contents").addClass("coloured grey lighten-5").find(".container").attr("id", "static_contents").append(PAGE_ADD_ONTOLOGY);
					$(".tooltipped").tooltip();

					var $template = $('<ul>', { "class": "treeview" }).append($('<li>', { "class": "last term" }).append($('<div>', { "class": "input-field col s5" }).append($('<input>', { "type": "text", "name": "name", "placeholder": "Term Name" }))).append($('<div>', { "class": "input-field col s5" }).append($('<input>', { "type": "text", "name": "relation_name", "placeholder": "Relation Name" }))).append($('<div>', { "class": "input-field col 2" }).append($('<a>', { "class": "btn btn-mini add", "href": "javascript:;" }).append($('<span>', { "class": "fa fa-plus" })).on("click", function (e) {
						$(e.target).closest("ul").append($template.clone(true, true));
					})).append($('<a>', { "class": "btn btn-mini remove", "href": "javascript:;" }).append($('<span>', { "class": "fa fa-minus" })).on("click", function (e) {
						if (!confirm("Are you sure you want to remove this term and all its children?")) return;
						$(e.target).closest("ul").remove();
					}))));

					$("#add_childs_btn").on("click", function (e) {
						$("#cont").append($template);
						e.preventDefault();
						e.stopPropagation();
					});

					setTimeout(function () {
						DATA.get_ontology_upload_url().then(function (upload_url) {
							$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
						});
						$(".btn-mini.add").on("click", function (e) {
							console.log($(e.target));
						});
					}, 100);

					$(".tabs").tabs({
						onShow: function onShow(e) {
							DATA.get_ontology_upload_url().then(function (upload_url) {
								$("#add_ontology_tab_contents .col.active form").attr("action", upload_url);
							});
						}
					});
					break;
				/**
     * 							ONTOLOGIES contents
     * -----------------------------------------------------------------
     */
				case "ontology":
				case "terms":
					var name = "",
					    term = "",
					    language = "english";

					MODALS.download_ontology_modal();

					/**
      * Ontology card
      */
					DATA.get_ontologies_data(NAV.get_ontology_id()).then(function (ontologies_data) {
						$("#ontology_card").html($('<div>', { "class": "col s2" }).append($('<img>', { "class": "crop_pict responsive-img", "src": ontologies_data.ontology_picture }))).append($('<div>', { "class": "col s10" }).append($('<h1>', { "id": "page_subtitle" }).append(NAV.get_ontology_id()).append(NAV.get_term_id() !== undefined ? "<small>:" + NAV.get_term_id() + "</small>" : "")).append($('<h2>', { "id": "page_title" }).append(function () {
							// if(ontologies_data.ontology_title.link !== "") {
							// 	return $('<a>', {"href": ontologies_data.ontology_title.link, "target": "_blank"}).append(ontologies_data.ontology_title.title).append((NAV.get_term_id() !== undefined) ? NAV.get_term_label() : "");
							// } else {
							// 	return ontologies_data.ontology_title.title + ((page == "terms" && NAV.get_term_id() !== undefined) ? "<small>" + NAV.get_term_label() + "</small>" : "");
							// }
						})).append($('<table>').append($('<thead>').append($('<tr>').append($('<th>').text("Ontology curators")).append($('<th>').text("Scientists")).append($('<th>', { "class": "center" }).text("Crop Lead Center")).append($('<th>', { "class": "center" }).text("Partners")).append($('<th>', { "class": "center" }).text("CGIAR research program")))).append($('<tbody>').append($('<td>').append(function () {
							if (ontologies_data.ontology_curators.length > 0 && ontologies_data.ontology_curators[0] !== "") {
								return $('<ul>', { "class": "browser-default" }).append($.map(ontologies_data.ontology_curators, function (v, k) {
									return $('<li>').append(v);
								}));
							}
						})).append($('<td>').append(function () {
							if (ontologies_data.scientists.length > 0 && ontologies_data.scientists[0] !== "") {
								return $('<ul>', { "class": "browser-default" }).append($.map(ontologies_data.scientists, function (v, k) {
									return $('<li>').append(v);
								}));
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.lead_centers.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.lead_centers, function (v, k) {
									if (v.image) {
										var image = !STR.is_url(v.image) ? "common/media/img/" + v.image : v.image;
										return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": image }));
									}
								})).html();
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.partners.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.partners, function (v, k) {
									if (v.image) {
										var image = !STR.is_url(v.image) ? "common/media/img/" + v.image : v.image;
										return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": "common/media/img/" + image }));
									}
								})).html();
							}
						})).append($('<td>', { "class": "center" }).append(function () {
							if (ontologies_data.cgiar_research_program.length > 0) {
								// 	console.info(v.image);
								return $('<div>').append($.map(ontologies_data.cgiar_research_program, function (v, k) {
									return $('<a>', { "href": v.link, "target": "_blank" }).append($('<img>', { "src": "common/media/img/" + v.image }));
								})).html();
							}
						})))));
					});

					DATA.get_ontology(NAV.get_ontology_id()).then(function (data) {
						LOADER.hide("#contents .progress");

						// Set Ontology languages
						var langs = [];
						langs.push(STR.get_ontologies_languages(data.name));
						// Set the page name
						var page_name = STR.get_ontology_term(data.name);
						$(".page_name").text(page_name);
						// Reset the page title
						$("#page_title").html(page_name);

						$("#ontology_tree .languages_refresh select").append($.map(langs, function (lang) {
							return $('<option>', {
								"value": lang.toLowerCase(),
								"selected": lang.toLowerCase() == settings.general.language ? true : false
							}).text(lang);
						}))
						//.attr("disabled", (langs.length == 1))
						.material_select();

						TREEVIEW.add_items({
							item: "#treeview",
							source: data,
							term: '<tt>' + NAV.get_ontology_id() + "</tt> - " + STR.get_ontology_term(data.name),
							is_root: true,
							langs: langs
						});

						var permalink = "./ontology/" + NAV.get_ontology_id() + ":" + NAV.get_ontology_label(),
						    ext_permalink = "https://www.cropontology.org/terms/" + data.id + "/" + STR.get_ontology_term(data.name) + "/static-html?language=" + STR.get_ontology_term_language(data.name);

						$("#term_permalink").attr("href", ext_permalink);
						$("#term_info_name").attr("href", permalink);
						$("#ontology_tree, #ontology_info").removeClass("disabled");
					});

					$("#contents").addClass("coloured grey lighten-5").find(".container").append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s5" }).append($('<h6>').text("Traits, methods and scales")).append($('<div>', { "id": "ontology_tree", "class": "card z-depth-0 disabled" }).append($('<nav>').append($('<div>', { "class": "languages_refresh left" }).append($('<select>', { "name": "language" }))).append($('<ul>', { "class": "right" }).append($('<li>').append($('<a>', { "href": "#download_ontology_modal", "class": "modal-trigger" }).append($('<span>', { "class": "picol_arrow_full_down" })).append(" Download"))))).append($('<div>', { "id": "treeview_container", "class": "card-content" }).append($('<ul>', { "id": "treeview", "class": "treeview" }))))).append($('<div>', { "class": "col s7" }).append($('<h6>').text("Term information")).append($('<div>', { "id": "ontology_info", "class": "disabled" }).append($('<div>', { "class": "card z-depth-1 browser-content browser" }).append($('<nav>', { "class": "nav-extended" }).append($('<div>', { "class": "nav-content" }).append($('<ul>', { "class": "tabs" }).append(
					// Info tab
					$('<li>', { "id": "general", "class": "tab" }).append($('<a>', { "href": "#page_info", "class": "active" }).text("General"))).append(
					// Variables tab
					$('<li>', { "id": "variables", "class": "tab disabled" }).append($('<a>', { "href": "#item_variables" }).text("Variables"))).append(
					// Comments tab
					$('<li>', { "id": "new-comments", "class": "tab" }).append($('<a>', { "href": "#page_comments" }).text("Comments"))))).append($('<div>', { "class": "filterbar nav-wrapper" }).append($('<ul>', { "class": "filters left" }).append($('<li>', { "data-filter": "read" }).append($('<a>', {
						"href": "javascript:;",
						"id": "term_info_name"
					}))).append($('<li>', { "data-filter": "read" }).append($('<a>', {
						"href": "javascript:;",
						"target": "_blank",
						"id": "term_permalink",
						"class": "right tooltipped",
						"data-tooltip": "Permalink"
					}).append($('<span>', { "class": "fa fa-link" }))))))).append($('<div>', { "id": "pages" }).append(
					// Info container
					$('<div>', { "id": "page_info", "class": "card-content" })).append(
					// Variables container
					$('<div>', { "id": "item_variables", "class": "card-content" })).append(
					// Comments container
					$('<div>', { "id": "page_comments", "class": "card-content" }).append($('<ul>', { "id": "comments", "class": "collection" }).hide()).append($('<div>', { "id": "comment_form" }).append(function () {
						if (DATA.get_user_logged()) {
							return $('<form>', { "method": "post", "action": "http://www.cropontology.org/add-comment" }).append($('<div>', { "class": "row" }).append($('<input>', { "type": "hidden", "name": "termId" }).val(page == "terms" ? NAV.get_term_id() : "")).append($('<input>', { "type": "hidden", "name": "ontologyId" }).val(NAV.get_ontology_id())).append($('<div>', { "class": "input-field col s12" }).append($("<textarea>", {
								"name": "comment",
								"class": "materialize-textarea",
								"id": "comment_input"
							})).append($('<label>', { "for": "comment_input" }).text("Add a comment"))).append($('<input>', { "type": "submit", "class": "btn btn-flat btn-highlight waves-effect waves-light right" }).val("Comment")));
						} else {
							return $('<center>').append($('<i>').append("Please ").append($('<a>', { "href": "#user_modal", "class": "modal-trigger" }).text("login")).append(" to comment"));
						}
					}))))).append($('<div>', { "id": "graph", "class": "card disabled" }).append($('<div>', { "id": "graph_content", "class": "valign-wrapper" }).append(
					// $('<h1>').html('<svg aria-hidden="true" data-prefix="fal" data-icon="chart-network" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-chart-network fa-w-20 fa-3x"><path fill="currentColor" d="M513.6 202.8l-19.2-25.6-48 36 19.2 25.6 48-36zM576 192c13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 153.6 640 141.3 640 128c0-13.3-4-25.6-10.9-35.8-2.3-3.4-4.9-6.6-7.8-9.5-2.9-2.9-6.1-5.5-9.5-7.8C601.6 68 589.3 64 576 64s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C516 102.4 512 114.7 512 128c0 35.3 28.7 64 64 64zm0-96c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zM99.8 250.9C89.6 244 77.3 240 64 240s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C4 278.4 0 290.7 0 304c0 35.3 28.7 64 64 64s64-28.7 64-64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3zM64 336c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm88-16h48v-32h-48v32zm469.3 82.7c-2.9-2.9-6.1-5.5-9.5-7.8C601.6 388 589.3 384 576 384s-25.6 4-35.8 10.9c-3.3 2.2-6.3 4.7-9.1 7.5l-91.8-55.1c5.6-13.3 8.7-28 8.7-43.3 0-61.9-50.1-112-112-112-11.3 0-21.9 2.2-32.2 5.2l-39.3-84.1C278.8 101.4 288 83.9 288 64c0-13.3-4-25.6-10.9-35.8-4.6-6.8-10.5-12.7-17.3-17.3C249.6 4 237.3 0 224 0s-25.6 4-35.8 10.9c-6.8 4.6-12.7 10.5-17.3 17.3C164 38.4 160 50.7 160 64c0 35.3 28.7 64 64 64 4 0 7.9-.5 11.7-1.2l39 83.6c-30.5 20-50.7 54.4-50.7 93.6 0 61.9 50.1 112 112 112 35 0 65.8-16.4 86.4-41.5l92.4 55.4c-1.7 5.8-2.7 11.8-2.7 18.1 0 35.3 28.7 64 64 64 13.3 0 25.6-4 35.8-10.9 6.8-4.6 12.7-10.5 17.3-17.3C636 473.6 640 461.3 640 448c0-13.3-4-25.6-10.9-35.8-2.3-3.4-5-6.6-7.8-9.5zM224 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32zm112 288c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm240 96c-17.6 0-32-14.4-32-32s14.4-32 32-32 32 14.4 32 32-14.4 32-32 32z" class=""></path></svg>')
					$('<h1>').append($('<span>', { "class": "fab fa-hubspot fa-3x" }))))))));

					$("#contents").prepend(LOADER.create({ type: "progress" }));
					break;
			}
		}

		/**
   * Build the footer section
   */

	}, {
		key: "build_footer",
		value: function build_footer() {
			if (settings.general.footer.visible) {
				$("body").append($("<footer>", { "class": "parallax-container" }).append($("<div>", { "class": "parallax" }).append($("<img>", { "src": "common/media/img/" + settings.general.footer.background }))).append($("<div>", { "class": "row" }).append($("<div>", { "class": "col s12 m12 l3 xl2" }).append($('<a>', { "href": "./", "class": "brand-logo" }).append($('<img>', { "class": "responsive-img", "src": "common/media/img/" + settings.general.footer.logo }))).append($('<p>', { "class": "description" }).html(settings.general.footer.description))).append($("<div>", { "id": "left_menu", "class": "col s12 m4 l2 offset-l1 offset-xl1" })).append($("<div>", { "id": "center_menu", "class": "col s12 m4 l3" })).append($("<div>", { "id": "right_menu", "class": "col s12 m4 l3 offset-xl1" })))).append($('<section>', { "id": "bottom_links" }).append($('<div>', { "class": "row container" }).append($('<div>', { "id": "", "class": "col s12 m12 l8 xl8 left" })).append($('<div>', { "id": "owner", "class": "col s12 m12 l4 xl4 right right-align" })))).append($('<center>', { "class": "license" }).append($('<p>').html(settings.general.license.text)));
			}

			/**
    * Build the footer menu
    * @uses build_menu()
    */
			this.build_menu("footer_menu");

			/**
   * Build the bottom links menu
   * @uses build_menu()
   */
			this.build_menu("bottom_links");
			// this.build_menu("owner");
		}
	}, {
		key: "load_scripts",
		value: function load_scripts() {
			switch (page) {
				case "ontology":
				case "terms":
					$("head").append("<!-- Main style -->").append($('<link>', { "rel": "stylesheet", "href": "dist/css/jquery.treeview.css", "type": "text/css", "media": "screen" }));

					$("#scripts").append("<!-- Fullscreen feature -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/jq-fullscreen/release/jquery.fullscreen.min.js" })).append("<!--  The Raphael JavaScript library for vector graphics display  -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/raphael-min.js" })).append("<!--  Dracula  -->").append("<!--  An extension of Raphael for connecting shapes -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_graffle.js" })).append("<!--  Graphs  -->").append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_graph.js" })).append($('<script>', { "type": "text/javascript", "src": "dist/js/dracula_algorithms.js" }));
					break;
				case "register":
					$("#scripts").append("<!-- jquery-validation -->").append($('<script>', { "type": "text/javascript", "src": "bower_components/jquery-validation/dist/jquery.validate.min.js" })).append("<!-- Google reCAPTCHA -->").append($('<script>', { "type": "text/javascript", "src": "https://www.google.com/recaptcha/api.js" }));
					break;
			}
		}
	}]);

	return layout;
}();

exports.default = layout;

},{"../../common/settings/contents.json":1,"../../common/settings/languages.json":2,"../../common/settings/menu.json":3,"../../src/es6/_navigation.es6":9,"../../src/es6/_str.es6":11,"../../src/es6/_treeview.es6":12,"../../src/es6/data.es6":13,"../../src/es6/filters.es6":14,"../../src/es6/loader.es6":16,"../../src/es6/modals.es6":17,"../../src/es6/pagination.es6":18,"moment":6}],16:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loader = function () {
	function loader() {
		_classCallCheck(this, loader);
	}

	_createClass(loader, [{
		key: "create",

		/**
   * Build a circular or a progress loader
   * @see https://materializecss.com/preloader.html
   *
   * @param  object 						options								The loader display options
   */
		value: function create(options) {
			var defaults = {
				/**
     * The loader type.
     * Options: "progress" or "circular"
     * @type {String}
     */
				type: "progress",
				/**
     * The progress type.
     * Options: `true` stay for determinate progress (need `size` option)
     * NOTE: This option is available only for progress loaders
     * @type {Boolean}
     */
				determinate: false,
				/**
     * The loader size.
     * Options:
     * 	- Circular loader: @type {String} 	"" or "small" or "big"
     * 	- Progress loader: @type {Integer}	The percentage of progress
     */
				size: "",
				/**
     * The loader colour
     * NOTE: This option is available only for circular loaders
     * @type {String}
     */
				colour: "grey",
				target: ""
			},
			    data = $.extend({}, defaults, options);

			switch (data.type) {
				case "progress":
					if ($(data.target + " .progress").length > 0) {
						this.show(data.target + " .progress");
					} else {
						$(data.target).prepend($('<div>', { "class": "progress" }).append($('<div>', {
							"class": data.determinate ? "determinate" : "indeterminate",
							"style": data.size !== "" ? "width: " + data.size + "%" : ""
						})));
					}
					break;
				case "circular":
					if ($(data.target + " .preloader-wrapper").length > 0) {
						this.show(data.target + " .preloader-wrapper");
					} else {
						$(data.target).prepend($('<div>', { "class": "preloader-wrapper " + data.size + " active" }).append($('<div>', { "class": "spinner-layer spinner-" + data.colour + "-only" }).append($('<div>', { "class": "circle-clipper left" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "gap-patch" }).append($('<div>', { "class": "circle" }))).append($('<div>', { "class": "circle-clipper right" }).append($('<div>', { "class": "circle" })))));
					}
					break;
			}
		}
	}, {
		key: "show",
		value: function show(item) {
			$(item).animate({ "opacity": 1 });
		}
	}, {
		key: "hide",
		value: function hide(item, remove) {
			remove = remove == undefined ? false : remove;
			$(item).animate({ "opacity": 0 }, 300, function () {
				if (remove) {
					$(item).remove();
				}
			});
		}
	}]);

	return loader;
}();

exports.default = loader;

},{}],17:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navigation = require("../../src/es6/_navigation.es6");

var _navigation2 = _interopRequireDefault(_navigation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NAV = new _navigation2.default();

var modals = function () {
	function modals() {
		_classCallCheck(this, modals);
	}

	_createClass(modals, [{
		key: "build_modal",

		/**
   * Build a modal popup
   * NOTE: Must be executed before or after creating the trigger button
   * @see http://archives.materializecss.com/0.100.2/modals.html
   *
   * @example:
   * ```
   * // Trigger
   * <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
   * ```
   *
   * @param object						options								Parameters passed as JSON object
   */
		value: function build_modal(options) {
			var defaults = {
				id: "modal",
				class: "",
				title: "Modal Header",
				subtitle: "",
				content: "Modal Content",
				display_buttons: true,
				ok_button: "Ok",
				cancel_button: "Cancel",
				fixed_footer: true,
				bottom_sheet: false,
				width: "55%"
			},
			    settings = $.extend({}, defaults, options);

			$("body").prepend($('<div>', {
				"id": settings.id,
				"class": "modal " + settings.class + " " + (settings.fixed_footer ? " modal-fixed-footer" : "") + (settings.bottom_sheet ? " bottom-sheet" : ""),
				"style": settings.width ? "width: " + settings.width : ""
			}).append($('<div>', { "class": "modal-content" }).append($('<h4>').html(settings.title)).append(function () {
				if (settings.subtitle) {
					return $('<h5>').html(settings.subtitle);
				}
			}).append(settings.content)).append(function () {
				if (settings.display_buttons) {
					return $('<div>', { "class": "modal-footer" }).append($('<a>', { "href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat left" }).text(settings.cancel_button)).append($('<a>', { "href": "javascript:;", "class": "modal-action modal-close waves-effect waves-green btn-flat right" }).text(settings.ok_button));
				}
			}));
		}
	}, {
		key: "add_filter_row",
		value: function add_filter_row(options) {
			var defaults = {
				id: "",
				name: "",
				placeholder: ""
			},
			    settings = $.extend({}, defaults, options);

			return $('<div>', { class: "row filter" }).append($('<div>', { class: "input-field col s2" }).append($('<p>').append($('<input>', {
				type: "checkbox",
				class: "filled-in",
				id: settings.id
			})).append($('<label>', { for: settings.id }).text(settings.label)))).append($('<div>', { class: "input-field col s4" }).append($('<input>', {
				type: "text",
				name: settings.name,
				placeholder: settings.placeholder,
				disabled: true
			})));
		}

		/**
   * Build the filters modal
   */

	}, {
		key: "filters_modal",
		value: function filters_modal() {
			function activate_rows() {
				$(".filter").each(function (k, v) {
					var $checkbox = $(v).find("input[type='checkbox']"),
					    $input = $(v).find("input[type='text']");

					$checkbox.on("change", function () {
						if ($checkbox.is(":checked")) {
							$input.attr("disabled", false).focus();
						} else {
							$input.attr("disabled", true);
						}
					});
				});
			}

			var $filters_modal_content = $('<div>', { "class": "row" }).append($('<form>', { class: "col s12" }).append(this.add_filter_row({
				id: "user_check",
				name: "user",
				label: "Users:",
				placeholder: "Type a username, name or last name..."
			})).append(this.add_filter_row({
				id: "type_check",
				name: "type",
				label: "Type:",
				placeholder: "Ontology type..."
			})));

			this.build_modal({
				id: "searchbar_filters",
				title: "Filters",
				content: $filters_modal_content,
				fixed_footer: false
			});
			activate_rows();
		}
	}, {
		key: "user_modal",
		value: function user_modal(title) {
			var $user_modal_content = $('<div>', { "class": "container" }).append($('<form>', { class: "col s12" }).append($('<div>', { "class": "row" }).append($('<div>', { "class": "input-field col s10 offset-s1" }).append($('<input>', {
				"type": "text",
				"name": "username",
				"id": "log_username"
			})).append($('<label>', { "for": "log_username" }).text("Username"))
			// 	)
			).append(
			// 	$('<div>', {"class": "row"}).append(
			$('<div>', { "class": "input-field col s10 offset-s1" }).append($('<input>', {
				"type": "password",
				"name": "Password",
				"id": "log_password"
			})).append($('<label>', { "for": "log_password" }).text("Password")))).append($('<div>', { "class": "row" }).append($('<div>', { "class": "col s10 offset-s1" }).append($('<a>', { "href": "./forgot-password" }).text("Forgot Password?")))));

			this.build_modal({
				id: "user_modal",
				width: "35%",
				title: title,
				content: $user_modal_content,
				fixed_footer: false,
				bottom_sheet: false
			});
		}
	}, {
		key: "download_ontology_modal",
		value: function download_ontology_modal() {
			var $download_ontology_modal = $('<div>', { "class": "" }).append($('<div>', { class: "row" }).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/report?ontology_id=" + NAV.get_ontology_id(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".csv"
			}).append($('<h4>').append($('<span>', { "class": "picol_document_text" }))).append($('<h6>').text("Trait dictionary")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/rdf/" + NAV.get_ontology_id() + (NAV.get_term_id() !== undefined ? ":" + NAV.get_term_id() : "") + "/" + NAV.get_ontology_label(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".nt"
			}).append($('<h4>').append($('<span>', { "class": "picol_rdf" }))).append($('<h6>').text("RDF")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/ontology/" + NAV.get_ontology_id() + "/" + NAV.get_ontology_label() + "/nt",
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".nt"
			}).append($('<h4>').append($('<span>', { "class": "picol_rdf_document" }))).append($('<h6>').text("RDF N-Triples")))).append($('<div>', { "class": "col s3 m3 l3 xl3" }).append($('<a>', {
				"target": "_blank",
				"href": "https://www.cropontology.org/obo/" + NAV.get_ontology_id(),
				"class": "center dowload-item",
				"download": NAV.get_ontology_id() + ".obo"
			}).append($('<h4>').append($('<span>', { "class": "picol_owl_lite_document" }))).append($('<h6>').text("OBO File")))));

			this.build_modal({
				id: "download_ontology_modal",
				width: "35%",
				class: "centered",
				title: "Download",
				subtitle: "<tt>" + NAV.get_ontology_id() + (NAV.get_term_id() !== undefined ? "<small>:" + NAV.get_term_id() + "</small>" : "") + "</tt> &rsaquo; " + (NAV.get_term_label() !== undefined ? NAV.get_term_label() : NAV.get_ontology_label()),
				content: $download_ontology_modal,
				fixed_footer: false,
				bottom_sheet: false,
				display_buttons: false
			});
		}
	}]);

	return modals;
}();

exports.default = modals;

},{"../../src/es6/_navigation.es6":9}],18:[function(require,module,exports){
"use strict";
/* jshint esversion: 6 */
"strict mode";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _str = require("../../src/es6/_str.es6");

var _str2 = _interopRequireDefault(_str);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STR = new _str2.default();

var pagination = function () {
	function pagination() {
		_classCallCheck(this, pagination);
	}

	_createClass(pagination, [{
		key: "build_pagination",

		/**
  * Build a pagination menu
  * @param  integer 						total_pages							The amount of pages
  */
		value: function build_pagination(options) {
			var _this = this;

			var defaults = {
				id: "",
				context_class: "group",
				content: "",
				items: "",
				current_page: 1,
				total_pages: 1
			},
			    settings = $.extend({}, defaults, options);
			var prev_page = settings.current_page <= 1 ? 1 : settings.current_page - 1,
			    next_page = settings.current_page >= settings.total_pages ? settings.total_pages : settings.current_page + 1,
			    $pagination = $('<ul>', {
				"id": settings.id,
				"class": settings.context_class + " pagination center",
				"data-current_page": settings.current_page,
				"data-total_pages": settings.total_pages
			}),
			    $left_arrow_btn = $('<li>', { "class": "prev_page_btn", disabled: true }).append($('<a>', { "href": "javascript:;" }).append($('<span>', { "class": "fa fa-chevron-left" }))).click(function (e) {
				_this.goto(e, settings.context_class, "prev", settings.content, settings.items);
			}),
			    $right_arrow_btn = $('<li>', { "class": "next_page_btn" }).append($('<a>', { "href": "javascript:;" }).append($('<span>', { "class": "fa fa-chevron-right" }))).click(function (e) {
				_this.goto(e, settings.context_class, "next", settings.content, settings.items);
			});

			var _loop = function _loop(p) {
				var pagelink_class = p == settings.current_page ? "waves-effect active" : "waves-effect",
				    left_arrow_class = settings.current_page <= 1 ? "disabled" : "",
				    right_arrow_class = settings.current_page >= settings.total_pages ? "disabled" : "";

				$left_arrow_btn.addClass(left_arrow_class);
				$right_arrow_btn.addClass(right_arrow_class);
				$pagination.append($('<li>', { "class": pagelink_class + " page_" + p }).append($('<a>', { "href": "javascript:;" }).text(p).click(function (e) {
					_this.goto(e, settings.context_class, p, settings.content, settings.items);
				})));
			};

			for (var p = 1; p <= settings.total_pages; p++) {
				_loop(p);
			}
			return $pagination.prepend($left_arrow_btn).append($right_arrow_btn);
		}
	}, {
		key: "goto",
		value: function goto(e, context_class, page, content, items) {
			if (!$(e.target).closest("li").attr("disabled")) {
				var current_page = parseInt($("." + context_class).data("current_page")),
				    total_pages = parseInt($("." + context_class).data("total_pages")),
				    prev_page = current_page <= 1 ? 1 : current_page - 1,
				    next_page = current_page >= total_pages ? total_pages : current_page + 1;

				$("." + context_class).find("li.active").removeClass("active");
				$("#" + context_class + " " + items).addClass("hide");
				switch (page) {
					case "prev":
						$("." + context_class).find("li.page_" + prev_page).addClass("active");
						$("." + context_class).data("current_page", prev_page);
						current_page = prev_page;
						break;
					case "next":
						$("." + context_class).find("li.page_" + next_page).addClass("active");
						$("." + context_class).data("current_page", next_page);
						current_page = next_page;
						break;
					default:
						$("." + context_class).find("li.page_" + page).addClass("active");
						$("." + context_class).data("current_page", page);
						current_page = page;
						break;
				}
				$(content + " " + items + ".page_" + current_page).removeClass("hide");
				if ($("#page_no").length > 0) {
					$("#page_no").text(current_page);
				}

				// Prev/next buttons
				if (current_page > 1) {
					$(".prev_page_btn").removeClass("disabled").attr("disabled", false);
				} else {
					$(".prev_page_btn").addClass("disabled").attr("disabled", true);
				}
				if (current_page < total_pages) {
					$(".next_page_btn").removeClass("disabled").attr("disabled", false);
				} else {
					$(".next_page_btn").addClass("disabled").attr("disabled", true);
				}
			}
		}
	}]);

	return pagination;
}();

exports.default = pagination;

},{"../../src/es6/_str.es6":11}]},{},[4]);
