# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCache, ArrayCacheBySymbolById
import hashlib
from ccxt.base.types import Balances, Int, Market, OrderBook, Str, Ticker, Trade
from ccxt.async_support.base.ws.client import Client
from typing import List
from ccxt.base.errors import ExchangeError


class bitopro(ccxt.async_support.bitopro):

    def describe(self):
        return self.deep_extend(super(bitopro, self).describe(), {
            'has': {
                'ws': True,
                'watchBalance': True,
                'watchMyTrades': True,
                'watchOHLCV': False,
                'watchOrderBook': True,
                'watchOrders': False,
                'watchTicker': True,
                'watchTickers': False,
                'watchTrades': True,
            },
            'urls': {
                'ws': {
                    'public': 'wss://stream.bitopro.com:443/ws/v1/pub',
                    'private': 'wss://stream.bitopro.com:443/ws/v1/pub/auth',
                },
            },
            'requiredCredentials': {
                'apiKey': True,
                'secret': True,
                'login': True,
            },
            'options': {
                'tradesLimit': 1000,
                'ordersLimit': 1000,
                'ws': {
                    'options': {
                        # headers is required for the authentication
                        'headers': {},
                    },
                },
            },
        })

    async def watch_public(self, path, messageHash, marketId):
        url = self.urls['ws']['public'] + '/' + path + '/' + marketId
        return await self.watch(url, messageHash, None, messageHash)

    async def watch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :see: https://github.com/bitoex/bitopro-offical-api-docs/blob/master/ws/public/order_book_stream.md
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int [limit]: the maximum amount of order book entries to return
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbols
        """
        if limit is not None:
            if (limit != 5) and (limit != 10) and (limit != 20) and (limit != 50) and (limit != 100) and (limit != 500) and (limit != 1000):
                raise ExchangeError(self.id + ' watchOrderBook limit argument must be None, 5, 10, 20, 50, 100, 500 or 1000')
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        messageHash = 'ORDER_BOOK' + ':' + symbol
        endPart = None
        if limit is None:
            endPart = market['id']
        else:
            endPart = market['id'] + ':' + limit
        orderbook = await self.watch_public('order-books', messageHash, endPart)
        return orderbook.limit()

    def handle_order_book(self, client: Client, message):
        #
        #     {
        #         "event": "ORDER_BOOK",
        #         "timestamp": 1650121915308,
        #         "datetime": "2022-04-16T15:11:55.308Z",
        #         "pair": "BTC_TWD",
        #         "limit": 5,
        #         "scale": 0,
        #         "bids": [
        #             {price: "1188178", amount: '0.0425', count: 1, total: "0.0425"},
        #         ],
        #         "asks": [
        #             {
        #                 "price": "1190740",
        #                 "amount": "0.40943964",
        #                 "count": 1,
        #                 "total": "0.40943964"
        #             },
        #         ]
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        market = self.safe_market(marketId, None, '_')
        symbol = market['symbol']
        event = self.safe_string(message, 'event')
        messageHash = event + ':' + symbol
        orderbook = self.safe_value(self.orderbooks, symbol)
        if orderbook is None:
            orderbook = self.order_book({})
        timestamp = self.safe_integer(message, 'timestamp')
        snapshot = self.parse_order_book(message, symbol, timestamp, 'bids', 'asks', 'price', 'amount')
        orderbook.reset(snapshot)
        client.resolve(orderbook, messageHash)

    async def watch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        """
        get the list of most recent trades for a particular symbol
        :see: https://github.com/bitoex/bitopro-offical-api-docs/blob/master/ws/public/trade_stream.md
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        messageHash = 'TRADE' + ':' + symbol
        trades = await self.watch_public('trades', messageHash, market['id'])
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_trade(self, client: Client, message):
        #
        #     {
        #         "event": "TRADE",
        #         "timestamp": 1650116346665,
        #         "datetime": "2022-04-16T13:39:06.665Z",
        #         "pair": "BTC_TWD",
        #         "data": [
        #             {
        #                 "event": '',
        #                 "datetime": '',
        #                 "pair": '',
        #                 "timestamp": 1650116227,
        #                 "price": "1189429",
        #                 "amount": "0.0153127",
        #                 "isBuyer": True
        #             },
        #         ]
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        market = self.safe_market(marketId, None, '_')
        symbol = market['symbol']
        event = self.safe_string(message, 'event')
        messageHash = event + ':' + symbol
        rawData = self.safe_value(message, 'data', [])
        trades = self.parse_trades(rawData, market)
        tradesCache = self.safe_value(self.trades, symbol)
        if tradesCache is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            tradesCache = ArrayCache(limit)
        for i in range(0, len(trades)):
            tradesCache.append(trades[i])
        self.trades[symbol] = tradesCache
        client.resolve(tradesCache, messageHash)

    async def watch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        """
        watches information on multiple trades made by the user
        :see: https://github.com/bitoex/bitopro-offical-api-docs/blob/master/ws/private/matches_stream.md
        :param str symbol: unified market symbol of the market trades were made in
        :param int [since]: the earliest time in ms to fetch trades for
        :param int [limit]: the maximum number of trade structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure
        """
        self.check_required_credentials()
        await self.load_markets()
        messageHash = 'USER_TRADE'
        if symbol is not None:
            market = self.market(symbol)
            messageHash = messageHash + ':' + market['symbol']
        url = self.urls['ws']['private'] + '/' + 'user-trades'
        self.authenticate(url)
        trades = await self.watch(url, messageHash, None, messageHash)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_my_trade(self, client: Client, message):
        #
        #     {
        #         "event": "USER_TRADE",
        #         "timestamp": 1694667358782,
        #         "datetime": "2023-09-14T12:55:58.782Z",
        #         "data": {
        #             "base": "usdt",
        #             "quote": "twd",
        #             "side": "ask",
        #             "price": "32.039",
        #             "volume": "1",
        #             "fee": "6407800",
        #             "feeCurrency": "twd",
        #             "transactionTimestamp": 1694667358,
        #             "eventTimestamp": 1694667358,
        #             "orderID": 390733918,
        #             "orderType": "LIMIT",
        #             "matchID": "bd07673a-94b1-419e-b5ee-d7b723261a5d",
        #             "isMarket": False,
        #             "isMaker": False
        #         }
        #     }
        #
        data = self.safe_value(message, 'data', {})
        baseId = self.safe_string(data, 'base')
        quoteId = self.safe_string(data, 'quote')
        base = self.safe_currency_code(baseId)
        quote = self.safe_currency_code(quoteId)
        symbol = self.symbol(base + '/' + quote)
        messageHash = self.safe_string(message, 'event')
        if self.myTrades is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            self.myTrades = ArrayCacheBySymbolById(limit)
        trades = self.myTrades
        parsed = self.parse_ws_trade(data)
        trades.append(parsed)
        client.resolve(trades, messageHash)
        client.resolve(trades, messageHash + ':' + symbol)

    def parse_ws_trade(self, trade: dict, market: Market = None) -> Trade:
        #
        #     {
        #         "base": "usdt",
        #         "quote": "twd",
        #         "side": "ask",
        #         "price": "32.039",
        #         "volume": "1",
        #         "fee": "6407800",
        #         "feeCurrency": "twd",
        #         "transactionTimestamp": 1694667358,
        #         "eventTimestamp": 1694667358,
        #         "orderID": 390733918,
        #         "orderType": "LIMIT",
        #         "matchID": "bd07673a-94b1-419e-b5ee-d7b723261a5d",
        #         "isMarket": False,
        #         "isMaker": False
        #     }
        #
        id = self.safe_string(trade, 'matchID')
        orderId = self.safe_string(trade, 'orderID')
        timestamp = self.safe_timestamp(trade, 'transactionTimestamp')
        baseId = self.safe_string(trade, 'base')
        quoteId = self.safe_string(trade, 'quote')
        base = self.safe_currency_code(baseId)
        quote = self.safe_currency_code(quoteId)
        symbol = self.symbol(base + '/' + quote)
        market = self.safe_market(symbol, market)
        price = self.safe_string(trade, 'price')
        type = self.safe_string_lower(trade, 'orderType')
        side = self.safe_string(trade, 'side')
        if side is not None:
            if side == 'ask':
                side = 'sell'
            elif side == 'bid':
                side = 'buy'
        amount = self.safe_string(trade, 'volume')
        fee = None
        feeAmount = self.safe_string(trade, 'fee')
        feeSymbol = self.safe_currency_code(self.safe_string(trade, 'feeCurrency'))
        if feeAmount is not None:
            fee = {
                'cost': feeAmount,
                'currency': feeSymbol,
                'rate': None,
            }
        isMaker = self.safe_value(trade, 'isMaker')
        takerOrMaker = None
        if isMaker is not None:
            if isMaker:
                takerOrMaker = 'maker'
            else:
                takerOrMaker = 'taker'
        return self.safe_trade({
            'id': id,
            'info': trade,
            'order': orderId,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'symbol': symbol,
            'takerOrMaker': takerOrMaker,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': None,
            'fee': fee,
        }, market)

    async def watch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://github.com/bitoex/bitopro-offical-api-docs/blob/master/ws/public/ticker_stream.md
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        messageHash = 'TICKER' + ':' + symbol
        return await self.watch_public('tickers', messageHash, market['id'])

    def handle_ticker(self, client: Client, message):
        #
        #     {
        #         "event": "TICKER",
        #         "timestamp": 1650119165710,
        #         "datetime": "2022-04-16T14:26:05.710Z",
        #         "pair": "BTC_TWD",
        #         "lastPrice": "1189110",
        #         "lastPriceUSD": "40919.1328",
        #         "lastPriceTWD": "1189110",
        #         "isBuyer": True,
        #         "priceChange24hr": "1.23",
        #         "volume24hr": "7.2090",
        #         "volume24hrUSD": "294985.5375",
        #         "volume24hrTWD": "8572279",
        #         "high24hr": "1193656",
        #         "low24hr": "1179321"
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        market = self.safe_market(marketId, None, '_')
        symbol = market['symbol']
        event = self.safe_string(message, 'event')
        messageHash = event + ':' + symbol
        result = self.parse_ticker(message)
        timestamp = self.safe_integer(message, 'timestamp')
        datetime = self.safe_string(message, 'datetime')
        result['timestamp'] = timestamp
        result['datetime'] = datetime
        self.tickers[symbol] = result
        client.resolve(result, messageHash)

    def authenticate(self, url):
        if (self.clients is not None) and (url in self.clients):
            return
        self.check_required_credentials()
        nonce = self.milliseconds()
        rawData = self.json({
            'nonce': nonce,
            'identity': self.login,
        })
        payload = self.string_to_base64(rawData)
        signature = self.hmac(self.encode(payload), self.encode(self.secret), hashlib.sha384)
        defaultOptions: dict = {
            'ws': {
                'options': {
                    'headers': {},
                },
            },
        }
        # self.options = self.extend(defaultOptions, self.options)
        self.extend_exchange_options(defaultOptions)
        originalHeaders = self.options['ws']['options']['headers']
        headers: dict = {
            'X-BITOPRO-API': 'ccxt',
            'X-BITOPRO-APIKEY': self.apiKey,
            'X-BITOPRO-PAYLOAD': payload,
            'X-BITOPRO-SIGNATURE': signature,
        }
        self.options['ws']['options']['headers'] = headers
        # instantiate client
        self.client(url)
        self.options['ws']['options']['headers'] = originalHeaders

    async def watch_balance(self, params={}) -> Balances:
        """
        watch balance and get the amount of funds available for trading or funds locked in orders
        :see: https://github.com/bitoex/bitopro-offical-api-docs/blob/master/ws/private/user_balance_stream.md
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `balance structure <https://docs.ccxt.com/#/?id=balance-structure>`
        """
        self.check_required_credentials()
        await self.load_markets()
        messageHash = 'ACCOUNT_BALANCE'
        url = self.urls['ws']['private'] + '/' + 'account-balance'
        self.authenticate(url)
        return await self.watch(url, messageHash, None, messageHash)

    def handle_balance(self, client: Client, message):
        #
        #     {
        #         "event": "ACCOUNT_BALANCE",
        #         "timestamp": 1650450505715,
        #         "datetime": "2022-04-20T10:28:25.715Z",
        #         "data": {
        #           "ADA": {
        #             "currency": "ADA",
        #             "amount": "0",
        #             "available": "0",
        #             "stake": "0",
        #             "tradable": True
        #           },
        #         }
        #     }
        #
        event = self.safe_string(message, 'event')
        data = self.safe_value(message, 'data')
        timestamp = self.safe_integer(message, 'timestamp')
        datetime = self.safe_string(message, 'datetime')
        currencies = list(data.keys())
        result: dict = {
            'info': data,
            'timestamp': timestamp,
            'datetime': datetime,
        }
        for i in range(0, len(currencies)):
            currency = self.safe_string(currencies, i)
            balance = self.safe_value(data, currency)
            currencyId = self.safe_string(balance, 'currency')
            code = self.safe_currency_code(currencyId)
            account = self.account()
            account['free'] = self.safe_string(balance, 'available')
            account['total'] = self.safe_string(balance, 'amount')
            result[code] = account
        self.balance = self.safe_balance(result)
        client.resolve(self.balance, event)

    def handle_message(self, client: Client, message):
        methods: dict = {
            'TRADE': self.handle_trade,
            'TICKER': self.handle_ticker,
            'ORDER_BOOK': self.handle_order_book,
            'ACCOUNT_BALANCE': self.handle_balance,
            'USER_TRADE': self.handle_my_trade,
        }
        event = self.safe_string(message, 'event')
        method = self.safe_value(methods, event)
        if method is not None:
            method(client, message)
