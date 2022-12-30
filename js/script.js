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
			coinData.Data.forEach(coin => {
				this.coinData[coin.CoinInfo.Name] = coin.CoinInfo;
			});
			console.log(this.coinData);
			this.updateCoinDataPrices();
		});
	}

	updateCoinDataPrices() {
		this.makeAPIcall(
			PRICE_INFO_ENDPOINT + Object.keys(this.coinData).join(","),
			coinPrices => {
				console.log(coinPrices);
				Object.keys(coinPrices).forEach(coinPriceKey => {
					this.coinData[coinPriceKey].Price = coinPrices[coinPriceKey].CAD;
				});
			});
	}
}

const crypto = new CryptoApp();
crypto.start();