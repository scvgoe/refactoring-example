const statement = require('./index')

describe('statement', () => {
	let playsJson = require('./plays.json');
	let invoicesJson = require('./invoices.json');

	it('should print a statement for multiple plays, single customer and multiple seats in plain text', () => {
		let expected = "청구 내역 (고객명: BigCo)\n" +
			" Hamlet: $650.00 (55석)\n" +
			" As You Like It: $580.00 (35석)\n" +
			" Othello: $500.00 (40석)\n" +
			"총액: $1,730.00\n" +
			"적립 포인트: 47점\n";

		expect(statement(invoicesJson[0], playsJson)).toBe(expected);
	});
});
