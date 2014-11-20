/**
 * @file Arrive.js: jQuery-less waypoints
 * @author Dave Ross <dave@davidmichaelross.com>
 * @license http://daveross.mit-license.org MIT
 * @version 0.2.0
 */

/**
 * @namespace Arrive
 */
window.Arrive = ((function () {

	"use strict";

	var fn = {},
		waypoints = [],
		debouncing = false;

	/**
	 * Infer if a given target is a DOM Element
	 * @private
	 * @param target
	 * @returns {boolean} true if target looks like a DOM element type
	 */
	function is_dom_element(target) {
		return 'object' === typeof target && "nodeType" in target &&
		target.nodeType === 1;
	}

	/**
	 * Reset all waypoint assignments
	 * Note: does not remove classes from DOM elements
	 * @memberof Arrive
	 * @alias reset
	 * @public
	 * @example
	 * Arrive.reset();
	 */
	fn.reset = function () {
		waypoints = [];
	};

	/**
	 * onScroll handler that evaluates waypoints which might need updating
	 * @private
	 */
	function evaluate_waypoints() {

		var waypoint_index;

		for (waypoint_index in waypoints) {

			if (waypoints.hasOwnProperty(waypoint_index)) {

				if (is_dom_element(waypoints[waypoint_index].target)) {

					// Target is a DOM element
					_process_element(waypoints[waypoint_index]);

				}
				else {

					// Target is a CSS selector
					_process_selector(waypoints[waypoint_index]);

				}

			}

		}

		debouncing = false;

	}

	/**
	 * @private
	 * @param waypoint
	 */
	function _process_element(waypoint) {

		var viewport_height = window.innerHeight || document.documentElement.clientHeight,
			waypoint_index, element_offset;

		// Target is a single element
		element_offset = waypoint.target.getBoundingClientRect();

		if (element_offset.bottom < 0 || element_offset.top > viewport_height) {

			// Element is no longer visible
			if (waypoint.target.getAttribute('data-arrived')) {
				//if (0 <= waypoint.target.className.indexOf('waypoint-visible')) {

				//waypoint.target.className = waypoint.target.className.replace(/(?:^|\s)waypoint-visible(?!\S)/, '');
				waypoint.target.removeAttribute('data-arrived');

				// Call the waypoint's no_longer_visible_callback if defined
				if ('function' === typeof waypoint.no_longer_visible_callback) {
					waypoint.no_longer_visible_callback(waypoint.target);
				}

			}

		}
		else {

			// Element is visible
			if (!waypoint.target.getAttribute('data-arrived-once')) {
				waypoint.target.setAttribute('data-arrived-once', 1);
			}

			if (!waypoint.target.getAttribute('data-arrived')) {

				waypoint.target.setAttribute('data-arrived', 1);

				// Call the waypoint's visible_callback if defined
				if ('function' === typeof waypoint.visible_callback) {
					waypoint.visible_callback(waypoint.target);
				}

			}

		}

	}

	/**
	 * @private
	 * @param waypoint
	 */
	function _process_selector(waypoint) {

		var viewport_height = window.innerHeight || document.documentElement.clientHeight,
			matching_element_index, matching_elements,
			element_offset;

		matching_elements = document.querySelectorAll(waypoint.target);
		for (matching_element_index = 0; matching_element_index < matching_elements.length; matching_element_index += 1) {

			element_offset = matching_elements[matching_element_index].getBoundingClientRect();

			if (element_offset.bottom < 0 || element_offset.top > viewport_height) {

				// Element is no longer visible
				if (matching_elements[matching_element_index].getAttribute('data-arrived')) {

					matching_elements[matching_element_index].removeAttribute('data-arrived');

					// Call the waypoint's no_longer_visible_callback if defined
					if ('function' === typeof waypoint.no_longer_visible_callback) {
						waypoint.no_longer_visible_callback(matching_elements[matching_element_index]);
					}

				}

			}
			else {

				// Element is visible
				if (!matching_elements[matching_element_index].getAttribute('data-arrived-once')) {
					matching_elements[matching_element_index].setAttribute('data-arrived-once', 1);
				}

				if (!matching_elements[matching_element_index].getAttribute('data-arrived')) {

					matching_elements[matching_element_index].setAttribute('data-arrived', '1');

					// Call the waypoint's visible_callback if defined
					if ('function' === typeof waypoint.visible_callback) {
						waypoint.visible_callback(matching_elements[matching_element_index]);
					}

				}

			}

		}

	}

	/**
	 * Register a scroll event handler
	 */
	window.addEventListener(
		'scroll',
		function () {

			if (!debouncing) {
				requestAnimationFrame(evaluate_waypoints);
			}
			debouncing = true;

		}
	);

	/**
	 * Register a selector to be monitored for changes in visibility
	 * @param {string} selector query selector to monitor for changes in visibility
	 * @param {function} [visible_callback] function to call when an element matching selector becomes visible
	 * @param {function} [no_longer_visible_callback] function to call when an element matching selector is no longer visible
	 * @return {{target: *}} waypoint promise; set visible_callback and/or no_longer_visible_callback
	 * @memberof Arrive
	 * @alias register_selector
	 * @public
	 * @throws {string} 'selector must be a string'
	 * @example
	 * var promise = Arrive.register_selector('#footer');
	 */
	fn.register_selector = function (selector, visible_callback, no_longer_visible_callback) {

		if ('string' !== typeof selector) {
			throw 'selector must be a string';
		}

		return this._register(selector, visible_callback, no_longer_visible_callback);
	};

	/**
	 * Register a signle element to be monitored for changes in visibility
	 * @param {string} element element to monitor for changes in visibility
	 * @param {function} [visible_callback] function to call when the element becomes visible
	 * @param {function} [no_longer_visible_callback] function to call when the element is no longer visible
	 * @return {{target: *}} waypoint promise; set visible_callback and/or no_longer_visible_callback
	 * @memberof Arrive
	 * @alias register_element
	 * @throws {string} 'element is not a DOM Element object'
	 * @public
	 * @example
	 * var promise = Arrive.register_element(document.getElementById('#footer'));
	 */
	fn.register_element = function (element, visible_callback, no_longer_visible_callback) {

		if (!is_dom_element(element)) {
			throw 'element is not a DOM Element object';
		}

		return this._register(element, visible_callback, no_longer_visible_callback);

	};

	/**
	 * Register a waypoint
	 * @param target
	 * @param {function} visible_callback
	 * @param {function} no_longer_visible_callback
	 * @returns {{target: *}}
	 * @private
	 */
	fn._register = function (target, visible_callback, no_longer_visible_callback) {

		var waypoint = {
			'target': target
		};

		if ('undefined' !== typeof visible_callback) {
			waypoint.visible_callback = visible_callback;
		}

		if ('undefined' !== typeof no_longer_visible_callback) {
			waypoint.no_longer_visible_callback = no_longer_visible_callback;
		}

		waypoints.push(waypoint);

		return waypoint;

	};

	return fn;

})());
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel
// Modified to pass jSHint by Dave Ross <dave@davidmichaelross.com>

// MIT license

(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
		window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
}());
// Document.querySelectorAll method
// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
// Needed for: IE7-
if (!document.querySelectorAll) {
	document.querySelectorAll = function (selectors) {
		var style = document.createElement('style'), elements = [], element;
		document.documentElement.firstChild.appendChild(style);
		document._qsa = [];

		style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
		window.scrollBy(0, 0);
		style.parentNode.removeChild(style);

		while (document._qsa.length) {
			element = document._qsa.shift();
			element.style.removeAttribute('x-qsa');
			elements.push(element);
		}
		document._qsa = null;
		return elements;
	};
}

// Document.querySelector method
// Needed for: IE7-
if (!document.querySelector) {
	document.querySelector = function (selectors) {
		var elements = document.querySelectorAll(selectors);
		return (elements.length) ? elements[0] : null;
	};
}