/**
  Chapter 6 code listings
  Author: Luis Atencio
*/

"use strict";
const assert = require('assert');
const _ = require('lodash');
const R = require('ramda');
const helpers = require('../helper');

const Either = require('../../model/monad/Either.js').Either;

const fork = (join, func1, func2) => (val) => join(func1(val), func2(val));

describe('Chapter 6', function () {

	it('Compute Average Grade', function () {

		const toLetterGrade = (grade) => {
			if (grade >= 90) return 'A';
			if (grade >= 80) return 'B';
			if (grade >= 70) return 'C';
			if (grade >= 60) return 'D';
			return 'F';
		};

		const computeAverageGrade =
			R.compose(toLetterGrade, fork(R.divide, R.sum, R.length));
		assert.equal(computeAverageGrade([80, 90, 100]), 'A');
	});

	it('Functional Combinator: fork', function () {
		const timesTwo = fork((x) => x + x, R.identity, R.identity);
		assert.equal(timesTwo(1), 2);
		assert.equal(timesTwo(2), 4);
	});

	it('showStudent: cleanInput', function () {

		const trim = (str) => str.replace(/^\s*|\s*$/g, '');
		const normalize = (str) => str.replace(/\-/g, '');
		const cleanInput = R.compose(normalize, trim);

		const input = ['', '-44-44-', '44444', ' 4 ', ' 4-4 '];
		const assertions = ['', '4444', '44444', '4', '44'];
		
		// Give assert.equal the ability to track its call counts.
		let assertEqual = helpers.addCallCount(assert.equal);

		input.forEach(function (val, key) {
			assertEqual(cleanInput(val), assertions[key]);
		});
		
		assert.equal(assertEqual.getCallCount(), input.length);
	});

	it('showStudent: checkLengthSsn', function () {

		// validLength :: Number, String -> Boolean
		const validLength = (len, str) => str.length === len;

		// checkLengthSsn :: String -> Either(String)
		const checkLengthSsn = ssn => {
			return Either.of(ssn)
				.filter(R.partial(validLength, [9]));
		};

		assert.ok(checkLengthSsn('444444444').isRight);
		assert.ok(checkLengthSsn('').isLeft);
		assert.ok(checkLengthSsn('44444444').isLeft);
		assert.equal(checkLengthSsn('444444444').chain(R.length), 9);
	});

	it('showStudent: csv', function () {

		// csv :: Array => String
		const csv = arr => arr.join(',');

		assert.equal(csv(['']), '');
		assert.equal(csv(['Alonzo']), 'Alonzo');
		assert.equal(csv(['Alonzo', 'Church']), 'Alonzo,Church');
		assert.equal(csv(['Alonzo', '', 'Church']), 'Alonzo,,Church');
	});
});