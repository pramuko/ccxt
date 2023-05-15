<?php

namespace ccxt\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class currencycom extends \ccxt\Exchange {
    public function public_get_v1_time($params = array()) {
        return $this->request('v1/time', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v1_exchangeinfo($params = array()) {
        return $this->request('v1/exchangeInfo', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v1_depth($params = array()) {
        return $this->request('v1/depth', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v1_aggtrades($params = array()) {
        return $this->request('v1/aggTrades', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v1_klines($params = array()) {
        return $this->request('v1/klines', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v1_ticker_24hr($params = array()) {
        return $this->request('v1/ticker/24hr', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_time($params = array()) {
        return $this->request('v2/time', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_exchangeinfo($params = array()) {
        return $this->request('v2/exchangeInfo', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_depth($params = array()) {
        return $this->request('v2/depth', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_aggtrades($params = array()) {
        return $this->request('v2/aggTrades', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_klines($params = array()) {
        return $this->request('v2/klines', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_v2_ticker_24hr($params = array()) {
        return $this->request('v2/ticker/24hr', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_assets($params = array()) {
        return $this->request('v1/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_candles($params = array()) {
        return $this->request('v1/candles', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_orderbook($params = array()) {
        return $this->request('v1/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_summary($params = array()) {
        return $this->request('v1/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_ticker($params = array()) {
        return $this->request('v1/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_assets($params = array()) {
        return $this->request('v1/token/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_orderbook($params = array()) {
        return $this->request('v1/token/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_summary($params = array()) {
        return $this->request('v1/token/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_ticker($params = array()) {
        return $this->request('v1/token/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_trades($params = array()) {
        return $this->request('v1/token/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_ohlc($params = array()) {
        return $this->request('v1/token_crypto/OHLC', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_assets($params = array()) {
        return $this->request('v1/token_crypto/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_orderbook($params = array()) {
        return $this->request('v1/token_crypto/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_summary($params = array()) {
        return $this->request('v1/token_crypto/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_ticker($params = array()) {
        return $this->request('v1/token_crypto/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_token_crypto_trades($params = array()) {
        return $this->request('v1/token_crypto/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcap_get_v1_trades($params = array()) {
        return $this->request('v1/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_account($params = array()) {
        return $this->request('v1/account', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_currencies($params = array()) {
        return $this->request('v1/currencies', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_deposits($params = array()) {
        return $this->request('v1/deposits', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_depositaddress($params = array()) {
        return $this->request('v1/depositAddress', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_ledger($params = array()) {
        return $this->request('v1/ledger', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_leveragesettings($params = array()) {
        return $this->request('v1/leverageSettings', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_mytrades($params = array()) {
        return $this->request('v1/myTrades', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_openorders($params = array()) {
        return $this->request('v1/openOrders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_tradingpositions($params = array()) {
        return $this->request('v1/tradingPositions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_tradingpositionshistory($params = array()) {
        return $this->request('v1/tradingPositionsHistory', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_transactions($params = array()) {
        return $this->request('v1/transactions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v1_withdrawals($params = array()) {
        return $this->request('v1/withdrawals', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_account($params = array()) {
        return $this->request('v2/account', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_currencies($params = array()) {
        return $this->request('v2/currencies', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_deposits($params = array()) {
        return $this->request('v2/deposits', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_depositaddress($params = array()) {
        return $this->request('v2/depositAddress', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_ledger($params = array()) {
        return $this->request('v2/ledger', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_leveragesettings($params = array()) {
        return $this->request('v2/leverageSettings', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_mytrades($params = array()) {
        return $this->request('v2/myTrades', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_openorders($params = array()) {
        return $this->request('v2/openOrders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_tradingpositions($params = array()) {
        return $this->request('v2/tradingPositions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_tradingpositionshistory($params = array()) {
        return $this->request('v2/tradingPositionsHistory', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_transactions($params = array()) {
        return $this->request('v2/transactions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_v2_withdrawals($params = array()) {
        return $this->request('v2/withdrawals', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_post_v1_order($params = array()) {
        return $this->request('v1/order', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v1_updatetradingposition($params = array()) {
        return $this->request('v1/updateTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v1_updatetradingorder($params = array()) {
        return $this->request('v1/updateTradingOrder', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v1_closetradingposition($params = array()) {
        return $this->request('v1/closeTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v2_order($params = array()) {
        return $this->request('v2/order', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v2_updatetradingposition($params = array()) {
        return $this->request('v2/updateTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v2_updatetradingorder($params = array()) {
        return $this->request('v2/updateTradingOrder', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_v2_closetradingposition($params = array()) {
        return $this->request('v2/closeTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_delete_v1_order($params = array()) {
        return $this->request('v1/order', 'private', 'DELETE', $params, null, null, array("cost" => 1));
    }
    public function private_delete_v2_order($params = array()) {
        return $this->request('v2/order', 'private', 'DELETE', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1Time($params = array()) {
        return $this->request('v1/time', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1ExchangeInfo($params = array()) {
        return $this->request('v1/exchangeInfo', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1Depth($params = array()) {
        return $this->request('v1/depth', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1AggTrades($params = array()) {
        return $this->request('v1/aggTrades', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1Klines($params = array()) {
        return $this->request('v1/klines', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV1Ticker24hr($params = array()) {
        return $this->request('v1/ticker/24hr', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Time($params = array()) {
        return $this->request('v2/time', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2ExchangeInfo($params = array()) {
        return $this->request('v2/exchangeInfo', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Depth($params = array()) {
        return $this->request('v2/depth', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2AggTrades($params = array()) {
        return $this->request('v2/aggTrades', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Klines($params = array()) {
        return $this->request('v2/klines', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetV2Ticker24hr($params = array()) {
        return $this->request('v2/ticker/24hr', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Assets($params = array()) {
        return $this->request('v1/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Candles($params = array()) {
        return $this->request('v1/candles', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Orderbook($params = array()) {
        return $this->request('v1/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Summary($params = array()) {
        return $this->request('v1/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Ticker($params = array()) {
        return $this->request('v1/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenAssets($params = array()) {
        return $this->request('v1/token/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenOrderbook($params = array()) {
        return $this->request('v1/token/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenSummary($params = array()) {
        return $this->request('v1/token/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenTicker($params = array()) {
        return $this->request('v1/token/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenTrades($params = array()) {
        return $this->request('v1/token/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoOHLC($params = array()) {
        return $this->request('v1/token_crypto/OHLC', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoAssets($params = array()) {
        return $this->request('v1/token_crypto/assets', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoOrderbook($params = array()) {
        return $this->request('v1/token_crypto/orderbook', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoSummary($params = array()) {
        return $this->request('v1/token_crypto/summary', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoTicker($params = array()) {
        return $this->request('v1/token_crypto/ticker', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1TokenCryptoTrades($params = array()) {
        return $this->request('v1/token_crypto/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function marketcapGetV1Trades($params = array()) {
        return $this->request('v1/trades', 'marketcap', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Account($params = array()) {
        return $this->request('v1/account', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Currencies($params = array()) {
        return $this->request('v1/currencies', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Deposits($params = array()) {
        return $this->request('v1/deposits', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1DepositAddress($params = array()) {
        return $this->request('v1/depositAddress', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Ledger($params = array()) {
        return $this->request('v1/ledger', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1LeverageSettings($params = array()) {
        return $this->request('v1/leverageSettings', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1MyTrades($params = array()) {
        return $this->request('v1/myTrades', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1OpenOrders($params = array()) {
        return $this->request('v1/openOrders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1TradingPositions($params = array()) {
        return $this->request('v1/tradingPositions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1TradingPositionsHistory($params = array()) {
        return $this->request('v1/tradingPositionsHistory', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Transactions($params = array()) {
        return $this->request('v1/transactions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV1Withdrawals($params = array()) {
        return $this->request('v1/withdrawals', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Account($params = array()) {
        return $this->request('v2/account', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Currencies($params = array()) {
        return $this->request('v2/currencies', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Deposits($params = array()) {
        return $this->request('v2/deposits', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2DepositAddress($params = array()) {
        return $this->request('v2/depositAddress', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Ledger($params = array()) {
        return $this->request('v2/ledger', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2LeverageSettings($params = array()) {
        return $this->request('v2/leverageSettings', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2MyTrades($params = array()) {
        return $this->request('v2/myTrades', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2OpenOrders($params = array()) {
        return $this->request('v2/openOrders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2TradingPositions($params = array()) {
        return $this->request('v2/tradingPositions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2TradingPositionsHistory($params = array()) {
        return $this->request('v2/tradingPositionsHistory', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Transactions($params = array()) {
        return $this->request('v2/transactions', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetV2Withdrawals($params = array()) {
        return $this->request('v2/withdrawals', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privatePostV1Order($params = array()) {
        return $this->request('v1/order', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV1UpdateTradingPosition($params = array()) {
        return $this->request('v1/updateTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV1UpdateTradingOrder($params = array()) {
        return $this->request('v1/updateTradingOrder', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV1CloseTradingPosition($params = array()) {
        return $this->request('v1/closeTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV2Order($params = array()) {
        return $this->request('v2/order', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV2UpdateTradingPosition($params = array()) {
        return $this->request('v2/updateTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV2UpdateTradingOrder($params = array()) {
        return $this->request('v2/updateTradingOrder', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostV2CloseTradingPosition($params = array()) {
        return $this->request('v2/closeTradingPosition', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privateDeleteV1Order($params = array()) {
        return $this->request('v1/order', 'private', 'DELETE', $params, null, null, array("cost" => 1));
    }
    public function privateDeleteV2Order($params = array()) {
        return $this->request('v2/order', 'private', 'DELETE', $params, null, null, array("cost" => 1));
    }
}
