function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichStatementData);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;

	function enrichStatementData(aPerformance) {
		const performancCalculator = new PerformancCalculator(aPerformance);
		aPerformance.play = playFor(aPerformance);
		aPerformance.amount = amountFor(aPerformance);
		aPerformance.volumeCredits = volumeCreditsFor(aPerformance);
		return aPerformance;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function amountFor(aPerformance) {
		let result = 0;

		switch (aPerformance.play.type) {
			case "tragedy": // 비극
				result = 40000;
				if (aPerformance.audience > 30) {
					result += 1000 * (aPerformance.audience - 30);
				}
				break;
			case "comedy": // 희극
				result = 30000;
				if (aPerformance.audience > 20) {
					result += 10000 + 500 * (aPerformance.audience - 20);
				}
				result += 300 * aPerformance.audience;
				break;
			default:
				throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
		}
		return result;
	}

	function volumeCreditsFor(aPerformance) {
		let result = Math.max(aPerformance.audience - 30, 0);
		// 희극 관객 5명마다 추가 포인트를 제공한다.
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}

	function totalAmount(data) {
		return data.performances.reduce((total, curr) => total += curr.amount, 0);
	}

	function totalVolumeCredits(data) {
		return data.performances.reduce((total, curr) => total += curr.volumeCredits, 0);
	}
}
exports.createStatementData = createStatementData;


class PerformancCalculator {
	constructor(aPerformance) { }
}