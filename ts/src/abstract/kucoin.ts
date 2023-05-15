// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    publicGetTimestamp (params?: {}): Promise<implicitReturnType>;
    publicGetStatus (params?: {}): Promise<implicitReturnType>;
    publicGetSymbols (params?: {}): Promise<implicitReturnType>;
    publicGetMarkets (params?: {}): Promise<implicitReturnType>;
    publicGetMarketAllTickers (params?: {}): Promise<implicitReturnType>;
    publicGetMarketOrderbookLevelLevelLimit (params?: {}): Promise<implicitReturnType>;
    publicGetMarketOrderbookLevel220 (params?: {}): Promise<implicitReturnType>;
    publicGetMarketOrderbookLevel2100 (params?: {}): Promise<implicitReturnType>;
    publicGetMarketHistories (params?: {}): Promise<implicitReturnType>;
    publicGetMarketCandles (params?: {}): Promise<implicitReturnType>;
    publicGetMarketStats (params?: {}): Promise<implicitReturnType>;
    publicGetCurrencies (params?: {}): Promise<implicitReturnType>;
    publicGetCurrenciesCurrency (params?: {}): Promise<implicitReturnType>;
    publicGetPrices (params?: {}): Promise<implicitReturnType>;
    publicGetMarkPriceSymbolCurrent (params?: {}): Promise<implicitReturnType>;
    publicGetMarginConfig (params?: {}): Promise<implicitReturnType>;
    publicGetMarginTradeLast (params?: {}): Promise<implicitReturnType>;
    publicPostBulletPublic (params?: {}): Promise<implicitReturnType>;
    privateGetMarketOrderbookLevelLevel (params?: {}): Promise<implicitReturnType>;
    privateGetMarketOrderbookLevel2 (params?: {}): Promise<implicitReturnType>;
    privateGetMarketOrderbookLevel3 (params?: {}): Promise<implicitReturnType>;
    privateGetAccounts (params?: {}): Promise<implicitReturnType>;
    privateGetAccountsAccountId (params?: {}): Promise<implicitReturnType>;
    privateGetAccountsLedgers (params?: {}): Promise<implicitReturnType>;
    privateGetAccountsAccountIdHolds (params?: {}): Promise<implicitReturnType>;
    privateGetAccountsTransferable (params?: {}): Promise<implicitReturnType>;
    privateGetBaseFee (params?: {}): Promise<implicitReturnType>;
    privateGetSubUser (params?: {}): Promise<implicitReturnType>;
    privateGetUserInfo (params?: {}): Promise<implicitReturnType>;
    privateGetSubApiKey (params?: {}): Promise<implicitReturnType>;
    privateGetSubAccounts (params?: {}): Promise<implicitReturnType>;
    privateGetSubAccountsSubUserId (params?: {}): Promise<implicitReturnType>;
    privateGetDepositAddresses (params?: {}): Promise<implicitReturnType>;
    privateGetDeposits (params?: {}): Promise<implicitReturnType>;
    privateGetHistDeposits (params?: {}): Promise<implicitReturnType>;
    privateGetHistWithdrawals (params?: {}): Promise<implicitReturnType>;
    privateGetWithdrawals (params?: {}): Promise<implicitReturnType>;
    privateGetWithdrawalsQuotas (params?: {}): Promise<implicitReturnType>;
    privateGetOrders (params?: {}): Promise<implicitReturnType>;
    privateGetOrderClientOrderClientOid (params?: {}): Promise<implicitReturnType>;
    privateGetOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    privateGetLimitOrders (params?: {}): Promise<implicitReturnType>;
    privateGetFills (params?: {}): Promise<implicitReturnType>;
    privateGetLimitFills (params?: {}): Promise<implicitReturnType>;
    privateGetIsolatedAccounts (params?: {}): Promise<implicitReturnType>;
    privateGetIsolatedAccountSymbol (params?: {}): Promise<implicitReturnType>;
    privateGetIsolatedBorrowOutstanding (params?: {}): Promise<implicitReturnType>;
    privateGetIsolatedBorrowRepaid (params?: {}): Promise<implicitReturnType>;
    privateGetIsolatedSymbols (params?: {}): Promise<implicitReturnType>;
    privateGetMarginAccount (params?: {}): Promise<implicitReturnType>;
    privateGetMarginBorrow (params?: {}): Promise<implicitReturnType>;
    privateGetMarginBorrowOutstanding (params?: {}): Promise<implicitReturnType>;
    privateGetMarginBorrowRepaid (params?: {}): Promise<implicitReturnType>;
    privateGetMarginLendActive (params?: {}): Promise<implicitReturnType>;
    privateGetMarginLendDone (params?: {}): Promise<implicitReturnType>;
    privateGetMarginLendTradeUnsettled (params?: {}): Promise<implicitReturnType>;
    privateGetMarginLendTradeSettled (params?: {}): Promise<implicitReturnType>;
    privateGetMarginLendAssets (params?: {}): Promise<implicitReturnType>;
    privateGetMarginMarket (params?: {}): Promise<implicitReturnType>;
    privateGetStopOrderOrderId (params?: {}): Promise<implicitReturnType>;
    privateGetStopOrder (params?: {}): Promise<implicitReturnType>;
    privateGetStopOrderQueryOrderByClientOid (params?: {}): Promise<implicitReturnType>;
    privateGetTradeFees (params?: {}): Promise<implicitReturnType>;
    privateGetHfAccountsLedgers (params?: {}): Promise<implicitReturnType>;
    privateGetHfOrdersActive (params?: {}): Promise<implicitReturnType>;
    privateGetHfOrdersActiveSymbols (params?: {}): Promise<implicitReturnType>;
    privateGetHfOrdersDone (params?: {}): Promise<implicitReturnType>;
    privateGetHfOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    privateGetHfOrdersClientOrderClientOid (params?: {}): Promise<implicitReturnType>;
    privateGetHfFills (params?: {}): Promise<implicitReturnType>;
    privatePostAccounts (params?: {}): Promise<implicitReturnType>;
    privatePostAccountsInnerTransfer (params?: {}): Promise<implicitReturnType>;
    privatePostAccountsSubTransfer (params?: {}): Promise<implicitReturnType>;
    privatePostDepositAddresses (params?: {}): Promise<implicitReturnType>;
    privatePostWithdrawals (params?: {}): Promise<implicitReturnType>;
    privatePostOrders (params?: {}): Promise<implicitReturnType>;
    privatePostOrdersMulti (params?: {}): Promise<implicitReturnType>;
    privatePostIsolatedBorrow (params?: {}): Promise<implicitReturnType>;
    privatePostIsolatedRepayAll (params?: {}): Promise<implicitReturnType>;
    privatePostIsolatedRepaySingle (params?: {}): Promise<implicitReturnType>;
    privatePostMarginBorrow (params?: {}): Promise<implicitReturnType>;
    privatePostMarginOrder (params?: {}): Promise<implicitReturnType>;
    privatePostMarginRepayAll (params?: {}): Promise<implicitReturnType>;
    privatePostMarginRepaySingle (params?: {}): Promise<implicitReturnType>;
    privatePostMarginLend (params?: {}): Promise<implicitReturnType>;
    privatePostMarginToggleAutoLend (params?: {}): Promise<implicitReturnType>;
    privatePostBulletPrivate (params?: {}): Promise<implicitReturnType>;
    privatePostStopOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSubUser (params?: {}): Promise<implicitReturnType>;
    privatePostSubApiKey (params?: {}): Promise<implicitReturnType>;
    privatePostSubApiKeyUpdate (params?: {}): Promise<implicitReturnType>;
    privatePostHfOrders (params?: {}): Promise<implicitReturnType>;
    privatePostHfOrdersSync (params?: {}): Promise<implicitReturnType>;
    privatePostHfOrdersMulti (params?: {}): Promise<implicitReturnType>;
    privatePostHfOrdersMultiSync (params?: {}): Promise<implicitReturnType>;
    privatePostHfOrdersAlter (params?: {}): Promise<implicitReturnType>;
    privateDeleteWithdrawalsWithdrawalId (params?: {}): Promise<implicitReturnType>;
    privateDeleteOrders (params?: {}): Promise<implicitReturnType>;
    privateDeleteOrderClientOrderClientOid (params?: {}): Promise<implicitReturnType>;
    privateDeleteOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteMarginLendOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteStopOrderCancelOrderByClientOid (params?: {}): Promise<implicitReturnType>;
    privateDeleteStopOrderOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteStopOrderCancel (params?: {}): Promise<implicitReturnType>;
    privateDeleteSubApiKey (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrdersSyncOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrdersClientOrderClientOid (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrdersSyncClientOrderClientOid (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrdersCancelOrderId (params?: {}): Promise<implicitReturnType>;
    privateDeleteHfOrders (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetContractsActive (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetContractsSymbol (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetTicker (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel2Snapshot (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel2Depth20 (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel2Depth100 (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel2MessageQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel3MessageQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetLevel3Snapshot (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetTradeHistory (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetInterestQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetIndexQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetMarkPriceSymbolCurrent (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetPremiumQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetFundingRateSymbolCurrent (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetTimestamp (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetStatus (params?: {}): Promise<implicitReturnType>;
    futuresPublicGetKlineQuery (params?: {}): Promise<implicitReturnType>;
    futuresPublicPostBulletPublic (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetAccountOverview (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetTransactionHistory (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetDepositAddress (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetDepositList (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetWithdrawalsQuotas (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetWithdrawalList (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetTransferList (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetOrders (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetStopOrders (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetRecentDoneOrders (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetOrdersByClientOid (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetFills (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetRecentFills (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetOpenOrderStatistics (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetPosition (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetPositions (params?: {}): Promise<implicitReturnType>;
    futuresPrivateGetFundingHistory (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostWithdrawals (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostTransferOut (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostOrders (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostPositionMarginAutoDepositStatus (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostPositionMarginDepositMargin (params?: {}): Promise<implicitReturnType>;
    futuresPrivatePostBulletPrivate (params?: {}): Promise<implicitReturnType>;
    futuresPrivateDeleteWithdrawalsWithdrawalId (params?: {}): Promise<implicitReturnType>;
    futuresPrivateDeleteCancelTransferOut (params?: {}): Promise<implicitReturnType>;
    futuresPrivateDeleteOrdersOrderId (params?: {}): Promise<implicitReturnType>;
    futuresPrivateDeleteOrders (params?: {}): Promise<implicitReturnType>;
    futuresPrivateDeleteStopOrders (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange
