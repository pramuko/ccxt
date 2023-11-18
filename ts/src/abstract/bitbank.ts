// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    publicGetPairTicker (params?: {}): Promise<implicitReturnType>;
    publicGetTickers (params?: {}): Promise<implicitReturnType>;
    publicGetTickersJpy (params?: {}): Promise<implicitReturnType>;
    publicGetPairDepth (params?: {}): Promise<implicitReturnType>;
    publicGetPairTransactions (params?: {}): Promise<implicitReturnType>;
    publicGetPairTransactionsYyyymmdd (params?: {}): Promise<implicitReturnType>;
    publicGetPairCandlestickCandletypeYyyymmdd (params?: {}): Promise<implicitReturnType>;
    publicGetPairCircuitBreakInfo (params?: {}): Promise<implicitReturnType>;
    privateGetUserAssets (params?: {}): Promise<implicitReturnType>;
    privateGetUserSpotOrder (params?: {}): Promise<implicitReturnType>;
    privateGetUserSpotActiveOrders (params?: {}): Promise<implicitReturnType>;
    privateGetUserSpotTradeHistory (params?: {}): Promise<implicitReturnType>;
    privateGetUserDepositHistory (params?: {}): Promise<implicitReturnType>;
    privateGetUserWithdrawalAccount (params?: {}): Promise<implicitReturnType>;
    privateGetUserWithdrawalHistory (params?: {}): Promise<implicitReturnType>;
    privateGetSpotStatus (params?: {}): Promise<implicitReturnType>;
    privateGetSpotPairs (params?: {}): Promise<implicitReturnType>;
    privatePostUserSpotOrder (params?: {}): Promise<implicitReturnType>;
    privatePostUserSpotCancelOrder (params?: {}): Promise<implicitReturnType>;
    privatePostUserSpotCancelOrders (params?: {}): Promise<implicitReturnType>;
    privatePostUserSpotOrdersInfo (params?: {}): Promise<implicitReturnType>;
    privatePostUserRequestWithdrawal (params?: {}): Promise<implicitReturnType>;
    marketsGetSpotPairs (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange
