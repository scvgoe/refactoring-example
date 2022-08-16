function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichStatementData);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return statementData;

	function enrichStatementData(aPerformance) {
		const performancCalculator = createPerformancCalculator(aPerformance, playFor(aPerformance));
		aPerformance.play = playFor(aPerformance);
		aPerformance.amount = performancCalculator.amount;
		aPerformance.volumeCredits = performancCalculator.volumeCredits;
		return aPerformance;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}

	function totalAmount(data) {
		return data.performances.reduce((total, curr) => total += curr.amount, 0);
	}

	function totalVolumeCredits(data) {
		return data.performances.reduce((total, curr) => total += curr.volumeCredits, 0);
	}
}
exports.createStatementData = createStatementData;


function createPerformancCalculator(aPerformance, play) {
	switch (play.type) {
		case "tragedy": // 비극
			return new TragedyCalculator(aPerformance);
		case "comedy": // 희극
			return new ComedyCalculator(aPerformance);
		default:
			throw new Error(`알 수 없는 장르: ${play.type}`);
	}
}

class PerformancCalculator {
	constructor(aPerformance) {
		this.aPerformance = aPerformance;
	}

	get volumeCredits() {
		return Math.max(this.aPerformance.audience - 30, 0);
	}
}

class TragedyCalculator extends PerformancCalculator {
	get amount() {
		let result = 40000;
		if (this.aPerformance.audience > 30) {
			result += 1000 * (this.aPerformance.audience - 30);
		}
		return result;
	}
}

class ComedyCalculator extends PerformancCalculator {
	get amount() {
		let result = 30000;
		if (this.aPerformance.audience > 20) {
			result += 10000 + 500 * (this.aPerformance.audience - 20);
		}
		result += 300 * this.aPerformance.audience;
		return result;
	}

	get volumeCredits() {
		return super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
	}
}