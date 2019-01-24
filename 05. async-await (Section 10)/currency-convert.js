//  USD, CAD 20
// 20 USD is worth 26 CAD. You can spend these in the following countries: Canada
// http://data.fixer.io/api/latest?access_key=11c37f85300a8cf685b0cac1b5e34098

const axios = require('axios');


//WITH ASYNC
const getExchangeRate = async (from, to) => {
    const response = await axios.get('http://data.fixer.io/api/latest?access_key=11c37f85300a8cf685b0cac1b5e34098');
    const euro = 1 / response.data.rates[from];
    const rate = euro * response.data.rates[to];
    return rate.toFixed(2); //round to 2 decimals

};
// WITHOUT ASYNC
// const getExchangeRate = (from, to) => {
//     return axios.get('http://data.fixer.io/api/latest?access_key=11c37f85300a8cf685b0cac1b5e34098').then((response) => {
//         const euro = 1 / response.data.rates[from];
//         const rate = euro * response.data.rates[to];
//         return rate.toFixed(2); //round to 2 decimals
//     });
// };

//WITH ASYNC
const getCountries = async (currencyCode) => {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map((country) => country.name)

};

// WITHOUT ASYNC
// const getCountries = (currencyCode) => {
//  return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then((response) => {
//      return response.data.map((country) => country.name)
//  })
// };

const convertCurreny = async (from, to, amount) => {
    const rate = await getExchangeRate(from, to);
        const convertedAmount = (amount * rate).toFixed(2);
        const countries = await getCountries(to);

        return `${amount} ${from} is worth ${convertedAmount} ${to}.You can spend it in the following country/ies: \r\n\ ${countries}`

};

convertCurreny('USD', 'CAD', 10).then((result) => {
    console.log(result);
});

