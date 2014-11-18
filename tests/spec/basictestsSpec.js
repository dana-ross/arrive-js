function setUpHTMLFixture(prefix) {

	// Create a new fixture div
	var div = document.createElement('div');
	div.id = prefix + 'fixture';
	document.body.appendChild(div);

	// Populate the fixture div with a large number of lorem ipsum paragraphs
	for (var paragraph_count = 1; paragraph_count <= 50; paragraph_count += 1) {
		var paragraph = document.createElement('p');
		paragraph.id = prefix + 'paragraph_' + paragraph_count;
		paragraph.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porta mauris est, eget egestas elit luctus sed. Aliquam sagittis risus eget dui laoreet, id placerat augue tincidunt. Cras elementum purus a pellentesque molestie. Integer sagittis dictum feugiat. Aliquam a lacinia nibh. Cras eu nunc at lacus rutrum viverra sit amet vitae dolor. Vivamus a vehicula diam. Mauris nec enim purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat, velit eget aliquet commodo, est orci dictum lectus, vitae mattis nisi nisi nec purus. Quisque blandit sem at ligula convallis, quis ornare nulla molestie. Donec molestie nulla in mattis interdum. Morbi in tempus ex. Donec pretium aliquet magna, sit amet malesuada turpis dictum sed.';
		div.appendChild(paragraph);
	}

}

window.addEventListener('DOMContentLoaded', function () {

	describe('waypoint-once', function () {

		beforeEach(function (done) {

			Arrive.reset();
			setUpHTMLFixture('fixture1_');
			Arrive.register_selector('#fixture1_paragraph_20');
			Arrive.register_selector('#fixture1_paragraph_40');
			window.location.hash = 'fixture1_paragraph_20';

			setTimeout(function () {
				done();
			}, 1000);

		});

		it('added to element when it becomes visible', function () {
			expect(document.querySelector('#fixture1_paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
		});

		it('element below the viewport does not get waypoint-once class', function () {
			expect(document.querySelector('#fixture1_paragraph_40').className.split(/\s+/)).not.toContain('waypoint-once');
		});


	});

	describe('waypoint-visible', function () {

		beforeEach(function (done) {

			Arrive.reset();
			setUpHTMLFixture('fixture2_');
			Arrive.register_selector('#fixture2_paragraph_20');
			Arrive.register_selector('#fixture2_paragraph_40');
			window.location.hash = 'fixture2_paragraph_20';

			setTimeout(function () {
				done();
			}, 1000);

		});

		it('added to element when it becomes visible', function () {
			expect(document.querySelector('#fixture2_paragraph_20').className.split(/\s+/)).toContain('waypoint-visible');
		});

		it('element below the viewport does not get waypoint-visible class', function () {
			expect(document.querySelector('#fixture2_paragraph_40').className.split(/\s+/)).not.toContain('waypoint-visible');
		});

	});

	describe('no longer visible', function () {

		beforeEach(function (done) {

			Arrive.reset();
			setUpHTMLFixture('fixture3_');
			Arrive.register_selector('#fixture3_paragraph_20');
			Arrive.register_selector('#fixture3_paragraph_40');
			window.location.hash = 'fixture3_paragraph_20';

			// Give arrive a chance to run
			setTimeout(function () {

				window.location.hash = 'fixture3_paragraph_1';

				// Give arrive a chance to run again
				setTimeout(function () {
					done();
				}, 1000);

			}, 1000);

		});

		it('removed from element when no longer visible', function () {
			expect(document.querySelector('#fixture3_paragraph_20').className.split(/\s+/)).not.toContain('waypoint-visible');
		});

		it('still has waypoint-once', function () {
			expect(document.querySelector('#fixture3_paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
		});

		it('element below the viewport never had waypoint-visible class', function () {
			expect(document.querySelector('#fixture3_paragraph_40').className.split(/\s+/)).not.toContain('waypoint-visible');
		});

	});

	describe('callbacks', function () {

		var visible_callback_called,
			no_longer_visible_callback_called;

		beforeEach(function (done) {

			visible_callback_called = {'20': false, '40': false};
			no_longer_visible_callback_called = {'20': false, '40': false};

			Arrive.reset();
			setUpHTMLFixture('fixture4_');
			Arrive.register_selector('#fixture4_paragraph_20', function () {
				visible_callback_called['20'] = true;
			}, function () {
				no_longer_visible_callback_called['20'] = true;
			});
			Arrive.register_selector('#fixture4_paragraph_40', function () {
				visible_callback_called['40'] = true;
			}, function () {
				no_longer_visible_callback_called['40'] = true;
			});

			window.location.hash = 'fixture4_paragraph_19';

			// Give arrive a chance to run
			setTimeout(function () {

				window.location.hash = 'fixture4_paragraph_1';

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
			setUpHTMLFixture('fixture5_');
			var promise = Arrive.register_selector('#fixture5_paragraph_20');

			promise.visible_callback = function () {
				visible_callback_called['20'] = true;
			};

			promise.no_longer_visible_callback = function () {
				no_longer_visible_callback_called['20'] = true;
			};

			window.location.hash = 'fixture5_paragraph_20';

			// Give arrive a chance to run
			setTimeout(function () {

				window.location.hash = 'fixture5_paragraph_1';

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
			setUpHTMLFixture('fixture6_');
			Arrive.register_element(document.querySelector('#fixture6_paragraph_20'));
			window.location.hash = 'fixture6_paragraph_20';

			setTimeout(function () {
				done();
			}, 1000);

		});

		it('added to element when it becomes visible', function () {
			expect(document.querySelector('#fixture6_paragraph_20').className.split(/\s+/)).toContain('waypoint-once');
		});

		it('element below the viewport does not get waypoint-once class', function () {
			expect(document.querySelector('#fixture6_paragraph_40').className.split(/\s+/)).not.toContain('waypoint-once');
		});

	});

	describe('exceptions', function () {

		beforeEach(function (done) {

			Arrive.reset();
			setUpHTMLFixture('fixture7_');
			done();

		});

		it('throws an exception when not passed a string', function () {

			var exception_received = false;

			try {
				Arrive.register_selector(document.getElementById('fixture7_paragraph_30'));
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

	});

});