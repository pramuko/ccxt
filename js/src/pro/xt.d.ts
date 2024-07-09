import xtRest from '../xt.js';
import { Balances, Dict, Int, Market, OHLCV, Order, OrderBook, Str, Strings, Ticker, Tickers, Trade } from '../base/types.js';
import Client from '../base/ws/Client.js';
export default class xt extends xtRest {
    describe(): any;
    getListenKey(isContract: boolean): Promise<any>;
    getCacheIndex(orderbook: any, cache: any): any;
    handleDelta(orderbook: any, delta: any): void;
    subscribe(name: string, access: string, methodName: string, market?: Market, symbols?: string[], params?: {}): Promise<any>;
    watchTicker(symbol: string, params?: {}): Promise<Ticker>;
    watchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    watchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    watchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    watchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    watchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    watchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    watchBalance(params?: {}): Promise<Balances>;
    handleTicker(client: Client, message: Dict): Dict;
    handleTickers(client: Client, message: Dict): Dict;
    handleOHLCV(client: Client, message: Dict): Dict;
    handleTrade(client: Client, message: Dict): Dict;
    handleOrderBook(client: Client, message: Dict): void;
    parseWsOrderTrade(trade: Dict, market?: Market): Trade;
    parseWsOrder(order: Dict, market?: Market): Order;
    handleOrder(client: Client, message: Dict): Dict;
    handleBalance(client: Client, message: Dict): void;
    handleMyTrades(client: Client, message: Dict): void;
    handleMessage(client: Client, message: any): void;
    ping(client: Client): string;
    handleErrorMessage(client: Client, message: Dict): void;
}
