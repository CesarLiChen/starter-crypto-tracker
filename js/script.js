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

	updateCoinTable() {
		let tableBody = document.getElementById("table-body");
		Object.keys(this.coinData).forEach(coinKey => {
			let coin = this.coinData[coinKey];
			let coinTableEntry = document.getElementById(coin.Id);

			if(coinTableEntry) {
				let price = document.getElementById(coin.Id + "-price");
				if(coin.Price != price.innerText) {
					if(coin.Price > price.innerText) {
						price.className = "up flash-up";
						setTimeout(() => {price.classList.remove("flash-up"), 500});
					} else {
						price.className = "down flash-down";
						setTimeout(() => {price.classList.remove("flash-down"), 500});
					}
				}
				price.innerText = coin.Price;
				
			} else {
				coinTableEntry = document.createElement("tr");
				coinTableEntry.id = coin.Id;

				let image = document.createElement("img");
				image.src = "https://www.cryptocompare.com" + coin.ImageUrl;
				image.classList.add("coin-image");

				let name = document.createElement("td");
				name.innerText = coin.FullName;

				let price = document.createElement("td");
				price.id = coin.Id + "-price";
				price.innerText = coin.Price;

				coinTableEntry.appendChild(image);
				coinTableEntry.appendChild(name);
				coinTableEntry.appendChild(price);

				tableBody.appendChild(coinTableEntry);
			}
		});
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
			setInterval(this.updateCoinDataPrices.bind(this), 6000);
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
				this.updateCoinTable();
			});
	}
}

const crypto = new CryptoApp();
crypto.start();