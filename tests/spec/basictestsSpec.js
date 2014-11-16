describe('waypoint-once', function () {

	beforeEach(function (done) {

		Arrive.reset();
		Arrive.register_selector('#paragraph_20');
		Arrive.register_selector('#paragraph_40');
		window.location.hash = 'paragraph_20';

		setTimeout(function () {
			done();
		}, 1000);

	});

	it('added to element when it becomes visible', function () {
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
	});

	it('element below the viewport does not get waypoint-once class', function () {
		expect(document.querySelector('#paragraph_40').className.split(/\s+/)).not.toContain('waypoint-once');
	});


});

describe('waypoint-visible', function () {

	beforeEach(function (done) {

		Arrive.reset();
		Arrive.register_selector('#paragraph_20');
		Arrive.register_selector('#paragraph_40');
		window.location.hash = 'paragraph_20';

		setTimeout(function () {
			done();
		}, 1000);

	});

	it('added to element when it becomes visible', function () {
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).toContain('waypoint-visible');
	});

	it('element below the viewport does not get waypoint-visible class', function () {
		expect(document.querySelector('#paragraph_40').className.split(/\s+/)).not.toContain('waypoint-visible');
	});

});

describe('no longer visible', function () {

	beforeEach(function (done) {

		Arrive.reset();
		Arrive.register_selector('#paragraph_20');
		Arrive.register_selector('#paragraph_40');
		window.location.hash = 'paragraph_20';

		// Give arrive a chance to run
		setTimeout(function () {

			window.location.hash = 'paragraph_1';

			// Give arrive a chance to run again
			setTimeout(function () {
				done();
			}, 1000);

		}, 1000);

	});

	it('removed from element when no longer visible', function () {
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).not.toContain('waypoint-visible');
	});

	it('still has waypoint-once', function () {
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
	});

	it('element below the viewport never had waypoint-visible class', function () {
		expect(document.querySelector('#paragraph_40').className.split(/\s+/)).not.toContain('waypoint-visible');
	});

});

describe('callbacks', function () {

	var visible_callback_called,
		no_longer_visible_callback_called;

	beforeEach(function (done) {

		visible_callback_called = {'20': false, '40': false};
		no_longer_visible_callback_called = {'20': false, '40': false};

		Arrive.reset();
		Arrive.register_selector('#paragraph_20', function () {
			visible_callback_called['20'] = true;
		}, function () {
			no_longer_visible_callback_called['20'] = true;
		});
		Arrive.register_selector('#paragraph_40', function () {
			visible_callback_called['40'] = true;
		}, function () {
			no_longer_visible_callback_called['40'] = true;
		});

		window.location.hash = 'paragraph_20';

		// Give arrive a chance to run
		setTimeout(function () {

			window.location.hash = 'paragraph_1';

			// Give arrive a chance to run again
			setTimeout(function () {
				done();
			}, 1000);

		}, 1000);

	});

	it('called the visible callback for paragraph 20', function () {
		expect(visible_callback_called['20']).toBe(true);
	});

	it('called the no-longer-visible callback for paragraph 20', function () {
		expect(no_longer_visible_callback_called['20']).toBe(true);
	});

	it('never called the visible callback for paragraph 40', function () {
		expect(visible_callback_called['40']).toBe(false);
	});

	it('never called the no-longer-visible callback for paragraph 40', function () {
		expect(no_longer_visible_callback_called['40']).toBe(false);
	})

});

describe('callback promises', function () {

	var visible_callback_called,
		no_longer_visible_callback_called;

	beforeEach(function (done) {

		visible_callback_called = {'20': false};
		no_longer_visible_callback_called = {'20': false};

		Arrive.reset();
		var promise = Arrive.register_selector('#paragraph_20');

		promise.visible_callback = function () {
			visible_callback_called['20'] = true;
		};

		promise.no_longer_visible_callback = function () {
			no_longer_visible_callback_called['20'] = true;
		};

		window.location.hash = 'paragraph_20';

		// Give arrive a chance to run
		setTimeout(function () {

			window.location.hash = 'paragraph_1';

			// Give arrive a chance to run again
			setTimeout(function () {
				done();
			}, 1000);

		}, 1000);

	});

	it('called the visible callback for paragraph 20', function () {
		expect(visible_callback_called['20']).toBe(true);
	});

	it('called the no-longer-visible callback for paragraph 20', function () {
		expect(no_longer_visible_callback_called['20']).toBe(true);
	});

});

describe('register element', function () {

	beforeEach(function (done) {

		Arrive.reset();
		Arrive.register_element(document.querySelector('#paragraph_20'));
		window.location.hash = 'paragraph_20';

		setTimeout(function () {
			done();
		}, 1000);

	});

	it('added to element when it becomes visible', function () {
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
	});

	it('element below the viewport does not get waypoint-once class', function () {
		expect(document.querySelector('#paragraph_40').className.split(/\s+/)).not.toContain('waypoint-once');
	});

});

describe('exceptions', function () {

	beforeEach(function (done) {

		Arrive.reset();
		done();

	});

	it('throws an exception when not passed a string', function () {

		var exception_received = false;

		try {
			Arrive.register_selector(document.getElementById('paragraph_30'));
		}
		catch (e) {
			exception_received = true;
		}

		expect(exception_received).toBe(true);

	});

	it('throws an exception when not passed an element', function () {

		var exception_received = false;

		try {
			Arrive.register_element('this is a string');
		}
		catch (e) {
			exception_received = true;
		}

		expect(exception_received).toBe(true);

	});

})