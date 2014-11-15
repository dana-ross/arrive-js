/**
 * Arrive.js: jQuery-less waypoints
 * @author Dave Ross <dave@davidmichaelross.com>
 * @license http://daveross.mit-license.org MIT
 */
window.JSWaypoints = ((function () {

	"use strict";

	var fn = {},
		waypoints = [],
		debouncing = false;

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

						// Element is not visible
						matching_elements[matching_element_index].className = matching_elements[matching_element_index].className.replace(/(?:^|\s)waypoint-visible(?!\S)/, '');

					}
					else {

						// Element is visible
						if (0 > matching_elements[matching_element_index].className.indexOf('waypoint-once')) {
							matching_elements[matching_element_index].className += ' waypoint-once';
						}

						if (0 > matching_elements[matching_element_index].className.indexOf('waypoint-visible')) {
							matching_elements[matching_element_index].className += ' waypoint-visible';
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
	 * @public
	 * @example
	 * JSWaypoints.register_selector('#footer');
	 */
	fn.register_selector = function (selector) {
		waypoints.push({
			'selector': selector
		});
	};

	return fn;

})());