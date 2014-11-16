# Arrive [![Build Status](https://travis-ci.org/daveross/arrive-js.svg?branch=master)](https://travis-ci.org/daveross/arrive-js)

> A waypoints library written in plain JavaScript

## Getting Started

## Adding waypoints

Waypoints are added by calling `Arrive.register_selector(selector)`, where `selector` is a CSS selector.

When an element matching one of the registered selectors enters the viewport, Arrive adds two classes to it:

| Class | Description |
|:------|:----------|
| waypoint-visible | The element is current in the browser's viewport. *This class is removed when the element leaves the viewport.*|
| waypoint-once | The element entered the browser's viewport at one time. *This class is never removed.*|

### Passing callbacks at registration time

Callbacks can be passed as the second and third parameters to `Arrive.register_selector()`.

| Pos | Name                       | Required | Type     | Description |
|:----:|:--------------------------|:---------|:---------|:-------------|
| 0   | selector                   | Required | string   | CSS selector |
| 1   | visible_callback           | Optional | function | Called when a matching element enters the viewport |
| 2   | no_longer_visible_callback | Optional | function | Called when a matching element is no longer in the viewport |

```JavaScript
	Arrive.register_selector('#section_2', function (elem) {
		console.log('element is visible');
	}, function (elem) {
		console.log('element is no longer visible');
	});
```

### Callbacks using promises

`Arrive.register_selector() ` returns a promise object which can be used to register callbacks after the initial registration takes place.

| Promise member variable    | Type        | Parameters |Description |
|:-------------------------------------|:--------------|:---------------|:---------------|
|visible_callback                    | function    | element      | Called when a matching element enters the viewport|
|no_longer_visible_callback  | function    | element     | Called when a matching element is no longer in the viewport|

```JavaScript

	var promise = Arrive.register_selector('#section_2');

	promise.visible_callback = function (elem) {
		console.log('element is visible');
	};

	promise.no_longer_visible_callback = function (elem) {
		console.log('element is no longer visible');
	};
```

## Release History

 * 2014-11-16   v0.0.1   Initial release
