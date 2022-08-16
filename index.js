module.exports = function statement(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichStatementData);
	return renderPlainText(statementData);

	function enrichStatementData(aPerformance) {
		aPerformance.play = playFor(aPerformance)
		aPerformance.amount = amountFor(aPerformance)
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
}

function renderPlainText(data) {
	let result = `청구 내역 (고객명: ${data.customer})\n`;

	for (let perf of data.performances) {
		// 청구 내역을 출력한다.
		result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
	}

	result += `총액: ${usd(totalAmount())}\n`;
	result += `적립 포인트: ${totalVolumeCredits()}점\n`;
	return result;

	function totalAmount() {
		let result = 0;
		for (let perf of data.performances) {
			result += perf.amount;
		}
		return result;
	}

	function totalVolumeCredits() {
		let result = 0;
		for (let perf of data.performances) {
			// 포인트를 적립한다.
			result += volumeCreditsFor(perf);
		}
		return result;
	}

	function usd(aNumber) {
		return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
	}

	function volumeCreditsFor(aPerformance) {
		let result = Math.max(aPerformance.audience - 30, 0);
		// 희극 관객 5명마다 추가 포인트를 제공한다.
		if ("comedy" === aPerformance.play.type)
			result += Math.floor(aPerformance.audience / 5);
		return result;
	}
}
