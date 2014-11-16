describe('waypoint-once', function () {

	beforeEach(function (done) {

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