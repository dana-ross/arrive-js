/**
 * Arrive.js: jQuery-less waypoints
 * @author Dave Ross <dave@davidmichaelross.com>
 * @license http://daveross.mit-license.org MIT
 */
window.Arrive = ((function () {

	"use strict";

	var fn = {},
		waypoints = [],
		debouncing = false;

	/**
	 * Reset all waypoint assignments
	 * Note: does not remove classes from DOM elements
	 * @example
	 * Arrive.reset();
	 */
	fn.reset = function () {
		waypoints = [];
		// @TODO remove classes from DOM elements?
	};

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
	 * @param {string} selector
	 * @param {function} visible_callback
	 * @param {function} no_longer_visible_callback
	 * @return object waypoint promise
	 * @public
	 * @example
	 * Arrive.register_selector('#footer');
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