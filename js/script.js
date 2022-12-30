// fsyms: from symbols
// tsyms: to symbols
const COIN_INFO_ENDPOINT = 
	"https://min-api.cryptocompare.com/data/top/totalvol?limit=30&tsym=CAD";

const PRICE_INFO_ENDPOINT =
	"https://min-api.cryptocompare.com/data/pricemulti?tsyms=CAD&fsyms=";

class CryptoApp {
	constructor() {
		this.coinData = {};
	}

	// API - Application Program Interface
	makeAPIcall(endPoint, callback) {
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				callback(JSON.parse(this.response));
			}
		}
		xhttp.open("GET", endPoint, true);
		xhttp.send();
	}

	start() {
		this.makeAPIcall(COIN_INFO_ENDPOINT, coinData => {
			console.log(coinData);
		});
	}
}

const crypto = new CryptoApp();
crypto.start();