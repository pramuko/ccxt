// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code
// EDIT THE CORRESPONDENT .ts FILE INSTEAD

import testTradingFee from './base/test.tradingFee.js';
async function testFetchTradingFees(exchange, skippedProperties) {
    const method = 'fetchTradingFees';
    const fees = await exchange.fetchTradingFees();
    const symbols = Object.keys(fees);
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        testTradingFee(exchange, skippedProperties, method, symbol, fees[symbol]);
    }
}
export default testFetchTradingFees;
