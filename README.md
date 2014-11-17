# Arrive [![Build Status](https://travis-ci.org/daveross/arrive-js.svg?branch=master)](https://travis-ci.org/daveross/arrive-js)

> A waypoints library written in plain JavaScript

## License

[MIT](http://daveross.mit-license.org)

See [why I contribute to open source software](https://davidmichaelross.com/blog/contribute-open-source-software/).

## Getting Started

The `dist` directory contains concatenated & minified files ready for use in your project. There are no additional dependencies you need to install unless you want to [contribute to the project](#contributing) itself.

## Adding waypoints

Waypoints are added by calling `Arrive.register_element(element)` (where `element` is a DOM Element) or `Arrive.register_selector(selector)` (where `selector` is a CSS selector).

When the specified element or an element matching one of the registered selectors enters the viewport, Arrive adds two classes to it:

| Class | Description |
|:------|:----------|
| waypoint-visible | The element is current in the browser's viewport. *This class is removed when the element leaves the viewport.*|
| waypoint-once | The element entered the browser's viewport at one time. *This class is never removed.*|

*NOTE: This behavior is likely to change. Adding CSS classes may be implemented as a pre-defined callback you can pass to `register_selector()` in future releases.*

### Passing callbacks at registration time

Callbacks can be passed as the second and third parameters to `Arrive.register_element()`.

#### Calling Arrive.register_element()
| Pos | Name                       | Required | Type     | Description |
|:----:|:--------------------------|:---------|:---------|:-------------|
| 0   | element                   | Required | Element   | DOM Element |
| 1   | visible_callback           | Optional | function | Called when the element enters the viewport |
| 2   | no_longer_visible_callback | Optional | function | Called when the element is no longer in the viewport |

```JavaScript
	Arrive.register_element(document.getElementById('intro'), function (elem) {
		console.log('element is visible');
	}, function (elem) {
		console.log('element is no longer visible');
	});
```
Callbacks can be also passed to `Arrive.register_selector()`.

#### Calling Arrive.register_selector()
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

`Arrive.register_element()` and `Arrive.register_selector()` return a promise object which can be used to register callbacks after the initial registration takes place.

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

## Contributing

### Grunt commands
|Command|Description|
|:------|:----------|
|`grunt travis`| Runs tests essential for continuous integration|
|`grunt docs`| Just regenerates JSDoc documentation|
|`grunt default`| Build process for testing and creating a new release|

## Release History

 * 2014-11-16   v0.2.0   Added querySelector polyfill
 * 2014-11-16   v0.1.0   Initial release
