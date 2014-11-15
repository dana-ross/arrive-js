describe('waypoint-once', function () {

	beforeEach(function (done) {

		JSWaypoints.register_selector('#paragraph_20');
		JSWaypoints.register_selector('#paragraph_40');
		window.location.hash = 'paragraph_20';

		setTimeout(function () {
			done();
		}, 1000);

	});

	it('added to element when it becomes visible', function () {
		console.log(document.querySelector('#paragraph_20').className.split(/\s+/));
		expect(document.querySelector('#paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
	});

	it('element below the viewport does not get waypoint-once class', function () {
		expect(document.querySelector('#paragraph_40').className.split(/\s+/)).not.toContain('waypoint-once');
	});


});
