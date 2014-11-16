/**
 * @file Arrive.js: jQuery-less waypoints
 * @author Dave Ross <dave@davidmichaelross.com>
 * @license http://daveross.mit-license.org MIT
 * @version 0.0.0
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
		// @TODO remove classes from DOM elements?
	};

	/**
	 * onScroll handler that evaluates waypoints which might need updating
	 * @private
	 */
	function evaluate_waypoints() {

		var viewport_height = window.innerHeight || document.documentElement.clientHeight,
			waypoint_index, matching_element_index, matching_elements,
			element_offset;

		for (waypoint_index in waypoints) {

			if (waypoints.hasOwnProperty(waypoint_index)) {

				matching_elements = document.querySelectorAll(waypoints[waypoint_index].selector);
				for (matching_element_index = 0; matching_element_index < matching_elements.length; matching_element_index += 1) {

					element_offset = matching_elements[matching_element_index].getBoundingClientRect();

					if (element_offset.bottom < 0 || element_offset.top > viewport_height) {

						// Element is no longer visible
						if (0 <= matching_elements[matching_element_index].className.indexOf('waypoint-visible')) {

							matching_elements[matching_element_index].className = matching_elements[matching_element_index].className.replace(/(?:^|\s)waypoint-visible(?!\S)/, '');

							// Call the waypoint's no_longer_visible_callback if defined
							if ('function' === typeof waypoints[waypoint_index].no_longer_visible_callback) {
								waypoints[waypoint_index].no_longer_visible_callback(matching_elements[matching_element_index]);
							}

						}

					}
					else {

						// Element is visible
						if (0 > matching_elements[matching_element_index].className.indexOf('waypoint-once')) {
							matching_elements[matching_element_index].className += ' waypoint-once';
						}

						if (0 > matching_elements[matching_element_index].className.indexOf('waypoint-visible')) {

							matching_elements[matching_element_index].className += ' waypoint-visible';

							// Call the waypoint's visible_callback if defined
							if ('function' === typeof waypoints[waypoint_index].visible_callback) {
								waypoints[waypoint_index].visible_callback(matching_elements[matching_element_index]);
							}

						}

					}

				}

			}

		}

		debouncing = false;

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
	 * @return object waypoint promise; set visible_callback and/or no_longer_visible_callback
	 * @memberof Arrive
	 * @alias register_selector
	 * @public
	 * @example
	 * var promise = Arrive.register_selector('#footer');
	 */
	fn.register_selector = function (selector, visible_callback, no_longer_visible_callback) {

		var waypoint = {
			'selector': selector
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