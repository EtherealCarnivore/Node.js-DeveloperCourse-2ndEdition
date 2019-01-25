//  USD, CAD 20
// 20 USD is worth 26 CAD. You can spend these in the following countries: Canada
// http://data.fixer.io/api/latest?access_key=11c37f85300a8cf685b0cac1b5e34098

const axios = require('axios');


//WITH ASYNC
const getExchangeRate = async (from, to) => {
    try {
        //handle bad axios request
        const response = await axios.get('http://dat' +
            'a.fixer.io/api/latest?access_key=11c37f85300a8cf685b0cac1b5e34098');
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];
        //handle bad data sent back from API
        if(isNaN(rate)){
            throw new Error(`Unable to get exchange rate for ${from} and ${to}.`)
        }

        return rate.toFixed(2); //round to 2 decimals
    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`)
    }


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
    try{ //if an invalid country is entered the catch will handle the error
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map((country) => country.name)
    } catch(e){
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }


};



// WITHOUT ASYNC
// const getCountries = (currencyCode) => {
//  return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then((response) => {
//      return response.data.map((country) => country.name)
//  })
// };

const convertCurrency = async (from, to, amount) => {
    const rate = await getExchangeRate(from, to);
        const convertedAmount = (amount * rate).toFixed(2);
        const countries = await getCountries(to);

        return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following country/ies: \r\n\ ${countries}`

};

convertCurrency('USD', 'CAD', 500).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e.message);
});

const add = async (a, b) => a + b;

const doWork = async () => {
    try{
        return await add(12, 13);
    } catch (e) {
    return 10;
    }

};

doWork().then((data) => {
    console.log(data);
}).catch((e) => {
    console.log('Something went wrong', e.message);
});

