# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxtpro.base.exchange import Exchange
import ccxt.async_support as ccxt
from ccxtpro.base.cache import ArrayCache, ArrayCacheBySymbolById, ArrayCacheByTimestamp
import hashlib
from ccxt.base.precise import Precise


class phemex(Exchange, ccxt.phemex):

    def describe(self):
        return self.deep_extend(super(phemex, self).describe(), {
            'has': {
                'ws': True,
                'watchTicker': True,
                'watchTickers': False,  # for now
                'watchTrades': True,
                'watchMyTrades': True,
                'watchOrders': True,
                'watchOrderBook': True,
                'watchOHLCV': True,
            },
            'urls': {
                'test': {
                    'ws': 'wss://testnet.phemex.com/ws',
                },
                'api': {
                    'ws': 'wss://phemex.com/ws',
                },
            },
            'options': {
                'tradesLimit': 1000,
                'OHLCVLimit': 1000,
            },
            'streaming': {
                'keepAlive': 20000,
            },
        })

    def from_en(self, en, scale):
        if en is None:
            return None
        precise = Precise(en)
        precise.decimals = self.sum(precise.decimals, scale)
        precise.reduce()
        return str(precise)

    def from_ep(self, ep, market=None):
        if (ep is None) or (market is None):
            return ep
        return self.from_en(ep, self.safe_integer(market, 'priceScale'))

    def from_ev(self, ev, market=None):
        if (ev is None) or (market is None):
            return ev
        return self.from_en(ev, self.safe_integer(market, 'valueScale'))

    def from_er(self, er, market=None):
        if (er is None) or (market is None):
            return er
        return self.from_en(er, self.safe_integer(market, 'ratioScale'))

    def request_id(self):
        requestId = self.sum(self.safe_integer(self.options, 'requestId', 0), 1)
        self.options['requestId'] = requestId
        return requestId

    def parse_swap_ticker(self, ticker, market=None):
        #
        #     {
        #         close: 442800,
        #         fundingRate: 10000,
        #         high: 445400,
        #         indexPrice: 442621,
        #         low: 428400,
        #         markPrice: 442659,
        #         open: 432200,
        #         openInterest: 744183,
        #         predFundingRate: 10000,
        #         symbol: 'LTCUSD',
        #         turnover: 8133238294,
        #         volume: 934292
        #     }
        #
        marketId = self.safe_string(ticker, 'symbol')
        market = self.safe_market(marketId, market)
        symbol = market['symbol']
        timestamp = self.safe_integer_product(ticker, 'timestamp', 0.000001)
        lastString = self.from_ep(self.safe_string(ticker, 'close'), market)
        last = self.parse_number(lastString)
        quoteVolume = self.parse_number(self.from_ev(self.safe_string(ticker, 'turnover'), market))
        baseVolume = self.parse_number(self.from_ev(self.safe_string(ticker, 'volume'), market))
        change = None
        percentage = None
        average = None
        openString = self.omit_zero(self.from_ep(self.safe_string(ticker, 'open'), market))
        open = self.parse_number(openString)
        if (openString is not None) and (lastString is not None):
            change = self.parse_number(Precise.string_sub(lastString, openString))
            average = self.parse_number(Precise.string_div(Precise.string_add(lastString, openString), '2'))
            percentage = self.parse_number(Precise.string_mul(Precise.string_sub(Precise.string_div(lastString, openString), '1'), '100'))
        result = {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'high': self.parse_number(self.from_ep(self.safe_string(ticker, 'high'), market)),
            'low': self.parse_number(self.from_ep(self.safe_string(ticker, 'low'), market)),
            'bid': None,
            'bidVolume': None,
            'ask': None,
            'askVolume': None,
            'vwap': None,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': None,  # previous day close
            'change': change,
            'percentage': percentage,
            'average': average,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }
        return result

    def handle_ticker(self, client, message):
        #
        #     {
        #         spot_market24h: {
        #             askEp: 958148000000,
        #             bidEp: 957884000000,
        #             highEp: 962000000000,
        #             lastEp: 958220000000,
        #             lowEp: 928049000000,
        #             openEp: 935597000000,
        #             symbol: 'sBTCUSDT',
        #             turnoverEv: 146074214388978,
        #             volumeEv: 15492228900
        #         },
        #         timestamp: 1592847265888272100
        #     }
        #
        # swap
        #
        #     {
        #         market24h: {
        #             close: 442800,
        #             fundingRate: 10000,
        #             high: 445400,
        #             indexPrice: 442621,
        #             low: 428400,
        #             markPrice: 442659,
        #             open: 432200,
        #             openInterest: 744183,
        #             predFundingRate: 10000,
        #             symbol: 'LTCUSD',
        #             turnover: 8133238294,
        #             volume: 934292
        #         },
        #         timestamp: 1592845585373374500
        #     }
        #
        name = 'market24h'
        ticker = self.safe_value(message, name)
        result = None
        if ticker is None:
            name = 'spot_market24h'
            ticker = self.safe_value(message, name)
            result = self.parse_ticker(ticker)
        else:
            result = self.parse_swap_ticker(ticker)
        symbol = result['symbol']
        messageHash = name + ':' + symbol
        timestamp = self.safe_integer_product(message, 'timestamp', 0.000001)
        result['timestamp'] = timestamp
        result['datetime'] = self.iso8601(timestamp)
        self.tickers[symbol] = result
        client.resolve(result, messageHash)

    async def watch_balance(self, params={}):
        await self.load_markets()
        type, query = self.handle_market_type_and_params('watchBalance', None, params)
        messageHash = type + ':balance'
        return await self.subscribe_private(type, messageHash, query)

    def handle_balance(self, type, client, message):
        # spot
        #  [
        #     {
        #         balanceEv: 0,
        #         currency: 'BTC',
        #         lastUpdateTimeNs: '1650442638722099092',
        #         lockedTradingBalanceEv: 0,
        #         lockedWithdrawEv: 0,
        #         userID: 2647224
        #       },
        #       {
        #         balanceEv: 1154232337,
        #         currency: 'USDT',
        #         lastUpdateTimeNs: '1650442617610017597',
        #         lockedTradingBalanceEv: 0,
        #         lockedWithdrawEv: 0,
        #         userID: 2647224
        #       }
        #    ]
        #
        # swap
        #  [
        #       {
        #         accountBalanceEv: 0,
        #         accountID: 26472240001,
        #         bonusBalanceEv: 0,
        #         currency: 'BTC',
        #         totalUsedBalanceEv: 0,
        #         userID: 2647224
        #       }
        #  ]
        #
        for i in range(0, len(message)):
            balance = message[i]
            currencyId = self.safe_string(balance, 'currency')
            code = self.safe_currency_code(currencyId)
            currency = self.safe_value(self.currencies, code, {})
            scale = self.safe_integer(currency, 'valueScale', 8)
            account = self.account()
            usedEv = self.safe_string(balance, 'totalUsedBalanceEv')
            if usedEv is None:
                lockedTradingBalanceEv = self.safe_string(balance, 'lockedTradingBalanceEv')
                lockedWithdrawEv = self.safe_string(balance, 'lockedWithdrawEv')
                usedEv = Precise.string_add(lockedTradingBalanceEv, lockedWithdrawEv)
            totalEv = self.safe_string_2(balance, 'accountBalanceEv', 'balanceEv')
            account['used'] = self.from_en(usedEv, scale)
            account['total'] = self.from_en(totalEv, scale)
            self.balance[code] = account
            self.balance = self.safe_balance(self.balance)
        messageHash = type + ':balance'
        client.resolve(self.balance, messageHash)

    def handle_trades(self, client, message):
        #
        #     {
        #         sequence: 1795484727,
        #         symbol: 'sBTCUSDT',
        #         trades: [
        #             [1592891002064516600, 'Buy', 964020000000, 1431000],
        #             [1592890978987934500, 'Sell', 963704000000, 1401800],
        #             [1592890972918701800, 'Buy', 963938000000, 2018600],
        #         ],
        #         type: 'snapshot'
        #     }
        #
        name = 'trade'
        marketId = self.safe_string(message, 'symbol')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        messageHash = name + ':' + symbol
        stored = self.safe_value(self.trades, symbol)
        if stored is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCache(limit)
            self.trades[symbol] = stored
        trades = self.safe_value(message, 'trades', [])
        parsed = self.parse_trades(trades, market)
        for i in range(0, len(parsed)):
            stored.append(parsed[i])
        client.resolve(stored, messageHash)

    def handle_ohlcv(self, client, message):
        #
        #     {
        #         kline: [
        #             [1592905200, 60, 960688000000, 960709000000, 960709000000, 960400000000, 960400000000, 848100, 8146756046],
        #             [1592905140, 60, 960718000000, 960716000000, 960717000000, 960560000000, 960688000000, 4284900, 41163743512],
        #             [1592905080, 60, 960513000000, 960684000000, 960718000000, 960684000000, 960718000000, 4880500, 46887494349],
        #         ],
        #         sequence: 1804401474,
        #         symbol: 'sBTCUSDT',
        #         type: 'snapshot'
        #     }
        #
        name = 'kline'
        marketId = self.safe_string(message, 'symbol')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        candles = self.safe_value(message, name, [])
        first = self.safe_value(candles, 0, [])
        interval = self.safe_string(first, 1)
        timeframe = self.find_timeframe(interval)
        if timeframe is not None:
            messageHash = name + ':' + timeframe + ':' + symbol
            ohlcvs = self.parse_ohlcvs(candles, market)
            self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
            stored = self.safe_value(self.ohlcvs[symbol], timeframe)
            if stored is None:
                limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
                stored = ArrayCacheByTimestamp(limit)
                self.ohlcvs[symbol][timeframe] = stored
            for i in range(0, len(ohlcvs)):
                candle = ohlcvs[i]
                stored.append(candle)
            client.resolve(stored, messageHash)

    async def watch_ticker(self, symbol, params={}):
        await self.load_markets()
        market = self.market(symbol)
        name = 'spot_market24h' if market['spot'] else 'market24h'
        url = self.urls['api']['ws']
        requestId = self.request_id()
        subscriptionHash = name + '.subscribe'
        messageHash = name + ':' + symbol
        subscribe = {
            'method': subscriptionHash,
            'id': requestId,
            'params': [],
        }
        request = self.deep_extend(subscribe, params)
        return await self.watch(url, messageHash, request, subscriptionHash)

    async def watch_trades(self, symbol, since=None, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        requestId = self.request_id()
        name = 'trade'
        messageHash = name + ':' + symbol
        method = name + '.subscribe'
        subscribe = {
            'method': method,
            'id': requestId,
            'params': [
                market['id'],
            ],
        }
        request = self.deep_extend(subscribe, params)
        trades = await self.watch(url, messageHash, request, messageHash)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    async def watch_order_book(self, symbol, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        requestId = self.request_id()
        name = 'orderbook'
        messageHash = name + ':' + symbol
        method = name + '.subscribe'
        subscribe = {
            'method': method,
            'id': requestId,
            'params': [
                market['id'],
            ],
        }
        request = self.deep_extend(subscribe, params)
        orderbook = await self.watch(url, messageHash, request, messageHash)
        return orderbook.limit(limit)

    async def watch_ohlcv(self, symbol, timeframe='1m', since=None, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        requestId = self.request_id()
        name = 'kline'
        messageHash = name + ':' + timeframe + ':' + symbol
        method = name + '.subscribe'
        subscribe = {
            'method': method,
            'id': requestId,
            'params': [
                market['id'],
                self.safe_integer(self.timeframes, timeframe),
            ],
        }
        request = self.deep_extend(subscribe, params)
        ohlcv = await self.watch(url, messageHash, request, messageHash)
        if self.newUpdates:
            limit = ohlcv.getLimit(symbol, limit)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    def handle_delta(self, bookside, delta, market=None):
        bidAsk = self.parse_bid_ask(delta, 0, 1, market)
        bookside.storeArray(bidAsk)

    def handle_deltas(self, bookside, deltas, market=None):
        for i in range(0, len(deltas)):
            self.handle_delta(bookside, deltas[i], market)

    def handle_order_book(self, client, message):
        #
        #     {
        #         book: {
        #             asks: [
        #                 [960316000000, 6993800],
        #                 [960318000000, 13183000],
        #                 [960319000000, 9170200],
        #             ],
        #             bids: [
        #                 [959941000000, 8385300],
        #                 [959939000000, 10296600],
        #                 [959930000000, 3672400],
        #             ]
        #         },
        #         depth: 30,
        #         sequence: 1805784701,
        #         symbol: 'sBTCUSDT',
        #         timestamp: 1592908460404461600,
        #         type: 'snapshot'
        #     }
        #
        marketId = self.safe_string(message, 'symbol')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        type = self.safe_string(message, 'type')
        depth = self.safe_integer(message, 'depth')
        name = 'orderbook'
        messageHash = name + ':' + symbol
        nonce = self.safe_integer(message, 'sequence')
        timestamp = self.safe_integer_product(message, 'timestamp', 0.000001)
        if type == 'snapshot':
            book = self.safe_value(message, 'book', {})
            snapshot = self.parse_order_book(book, symbol, timestamp, 'bids', 'asks', 0, 1, market)
            snapshot['nonce'] = nonce
            orderbook = self.order_book(snapshot, depth)
            self.orderbooks[symbol] = orderbook
            client.resolve(orderbook, messageHash)
        else:
            orderbook = self.safe_value(self.orderbooks, symbol)
            if orderbook is not None:
                changes = self.safe_value(message, 'book', {})
                asks = self.safe_value(changes, 'asks', [])
                bids = self.safe_value(changes, 'bids', [])
                self.handle_deltas(orderbook['asks'], asks, market)
                self.handle_deltas(orderbook['bids'], bids, market)
                orderbook['nonce'] = nonce
                orderbook['timestamp'] = timestamp
                orderbook['datetime'] = self.iso8601(timestamp)
                self.orderbooks[symbol] = orderbook
                client.resolve(orderbook, messageHash)

    async def watch_my_trades(self, symbol=None, since=None, limit=None, params={}):
        await self.load_markets()
        messageHash = 'trades'
        market = None
        type = None
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
            messageHash = messageHash + ':' + market['symbol']
        type, params = self.handle_market_type_and_params('watchMyTrades', market, params)
        if symbol is None:
            messageHash = messageHash + ':' + type
        trades = await self.subscribe_private(type, messageHash, params)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(trades, symbol, since, limit, True)

    def handle_my_trades(self, client, message):
        #
        # [
        #    {
        #       "avgPriceEp":4138763000000,
        #       "baseCurrency":"BTC",
        #       "baseQtyEv":0,
        #       "clOrdID":"7956e0be-e8be-93a0-2887-ca504d85cda2",
        #       "execBaseQtyEv":30100,
        #       "execFeeEv":31,
        #       "execID":"d3b10cfa-84e3-5752-828e-78a79617e598",
        #       "execPriceEp":4138763000000,
        #       "execQuoteQtyEv":1245767663,
        #       "feeCurrency":"BTC",
        #       "lastLiquidityInd":"RemovedLiquidity",
        #       "ordType":"Market",
        #       "orderID":"34a4b1a8-ac3a-4580-b3e6-a6d039f27195",
        #       "priceEp":4549022000000,
        #       "qtyType":"ByQuote",
        #       "quoteCurrency":"USDT",
        #       "quoteQtyEv":1248000000,
        #       "side":"Buy",
        #       "symbol":"sBTCUSDT",
        #       "tradeType":"Trade",
        #       "transactTimeNs":"1650442617609928764",
        #       "userID":2647224
        #    }
        #  ]
        #
        channel = 'trades'
        tradesLength = len(message)
        if tradesLength == 0:
            return
        cachedTrades = self.myTrades
        if cachedTrades is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            cachedTrades = ArrayCacheBySymbolById(limit)
        parsed = self.parse_trades(message)
        marketIds = {}
        type = None
        for i in range(0, len(parsed)):
            trade = parsed[i]
            cachedTrades.append(trade)
            symbol = trade['symbol']
            market = self.market(symbol)
            if type is None:
                type = market['type']
            marketIds[symbol] = True
        keys = list(marketIds.keys())
        for i in range(0, len(keys)):
            market = keys[i]
            hash = channel + ':' + market
            client.resolve(cachedTrades, hash)
        # generic subscription
        messageHash = channel + ':' + type
        client.resolve(cachedTrades, messageHash)

    async def watch_orders(self, symbol=None, since=None, limit=None, params={}):
        await self.load_markets()
        messageHash = 'orders'
        market = None
        type = None
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
            messageHash = messageHash + ':' + market['symbol']
        type, params = self.handle_market_type_and_params('watchOrders', market, params)
        if symbol is None:
            messageHash = messageHash + ':' + type
        orders = await self.subscribe_private(type, messageHash, params)
        if self.newUpdates:
            limit = orders.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(orders, symbol, since, limit, True)

    def handle_orders(self, client, message):
        # spot update
        # {
        #        "closed":[
        #           {
        #              "action":"New",
        #              "avgPriceEp":4138763000000,
        #              "baseCurrency":"BTC",
        #              "baseQtyEv":0,
        #              "bizError":0,
        #              "clOrdID":"7956e0be-e8be-93a0-2887-ca504d85cda2",
        #              "createTimeNs":"1650442617606017583",
        #              "cumBaseQtyEv":30100,
        #              "cumFeeEv":31,
        #              "cumQuoteQtyEv":1245767663,
        #              "cxlRejReason":0,
        #              "feeCurrency":"BTC",
        #              "leavesBaseQtyEv":0,
        #              "leavesQuoteQtyEv":0,
        #              "ordStatus":"Filled",
        #              "ordType":"Market",
        #              "orderID":"34a4b1a8-ac3a-4580-b3e6-a6d039f27195",
        #              "pegOffsetValueEp":0,
        #              "priceEp":4549022000000,
        #              "qtyType":"ByQuote",
        #              "quoteCurrency":"USDT",
        #              "quoteQtyEv":1248000000,
        #              "side":"Buy",
        #              "stopPxEp":0,
        #              "symbol":"sBTCUSDT",
        #              "timeInForce":"ImmediateOrCancel",
        #              "tradeType":"Trade",
        #              "transactTimeNs":"1650442617609928764",
        #              "triggerTimeNs":0,
        #              "userID":2647224
        #           }
        #        ],
        #        "fills":[
        #           {
        #              "avgPriceEp":4138763000000,
        #              "baseCurrency":"BTC",
        #              "baseQtyEv":0,
        #              "clOrdID":"7956e0be-e8be-93a0-2887-ca504d85cda2",
        #              "execBaseQtyEv":30100,
        #              "execFeeEv":31,
        #              "execID":"d3b10cfa-84e3-5752-828e-78a79617e598",
        #              "execPriceEp":4138763000000,
        #              "execQuoteQtyEv":1245767663,
        #              "feeCurrency":"BTC",
        #              "lastLiquidityInd":"RemovedLiquidity",
        #              "ordType":"Market",
        #              "orderID":"34a4b1a8-ac3a-4580-b3e6-a6d039f27195",
        #              "priceEp":4549022000000,
        #              "qtyType":"ByQuote",
        #              "quoteCurrency":"USDT",
        #              "quoteQtyEv":1248000000,
        #              "side":"Buy",
        #              "symbol":"sBTCUSDT",
        #              "tradeType":"Trade",
        #              "transactTimeNs":"1650442617609928764",
        #              "userID":2647224
        #           }
        #        ],
        #        "open":[
        #           {
        #              "action":"New",
        #              "avgPriceEp":0,
        #              "baseCurrency":"LTC",
        #              "baseQtyEv":0,
        #              "bizError":0,
        #              "clOrdID":"2c0e5eb5-efb7-60d3-2e5f-df175df412ef",
        #              "createTimeNs":"1650446670073853755",
        #              "cumBaseQtyEv":0,
        #              "cumFeeEv":0,
        #              "cumQuoteQtyEv":0,
        #              "cxlRejReason":0,
        #              "feeCurrency":"LTC",
        #              "leavesBaseQtyEv":0,
        #              "leavesQuoteQtyEv":1000000000,
        #              "ordStatus":"New",
        #              "ordType":"Limit",
        #              "orderID":"d2aad92f-50f5-441a-957b-8184b146e3fb",
        #              "pegOffsetValueEp":0,
        #              "priceEp":5000000000,
        #              "qtyType":"ByQuote",
        #              "quoteCurrency":"USDT",
        #              "quoteQtyEv":1000000000,
        #              "side":"Buy",
        #            }
        #        ]
        #  },
        #
        trades = []
        parsedOrders = []
        if ('closed' in message) or ('fills' in message) or ('open' in message):
            closed = self.safe_value(message, 'closed', [])
            open = self.safe_value(message, 'open', [])
            orders = self.array_concat(open, closed)
            fills = self.safe_value(message, 'fills', [])
            trades = fills
            parsedOrders = self.parse_orders(orders)
        else:
            for i in range(0, len(message)):
                update = message[i]
                action = self.safe_string(update, 'action')
                if (action is not None) and (action != 'Cancel'):
                    # order + trade info together
                    trades.append(update)
                parsedOrder = self.parse_ws_swap_order(update)
                parsedOrders.append(parsedOrder)
        self.handle_my_trades(client, trades)
        limit = self.safe_integer(self.options, 'ordersLimit', 1000)
        marketIds = {}
        if self.orders is None:
            self.orders = ArrayCacheBySymbolById(limit)
        type = None
        stored = self.orders
        for i in range(0, len(parsedOrders)):
            parsed = parsedOrders[i]
            stored.append(parsed)
            symbol = parsed['symbol']
            market = self.market(symbol)
            if type is None:
                type = market['type']
            marketIds[symbol] = True
        keys = list(marketIds.keys())
        for i in range(0, len(keys)):
            messageHash = 'orders' + ':' + keys[i]
            client.resolve(self.orders, messageHash)
        # resolve generic subscription(spot or swap)
        messageHash = 'orders:' + type
        client.resolve(self.orders, messageHash)

    def parse_ws_swap_order(self, order, market=None):
        #
        # {
        #     "accountID":26472240002,
        #     "action":"Cancel",
        #     "actionBy":"ByUser",
        #     "actionTimeNs":"1650450096104760797",
        #     "addedSeq":26975849309,
        #     "bonusChangedAmountEv":0,
        #     "clOrdID":"d9675963-5e4e-6fc8-898a-ec8b934c1c61",
        #     "closedPnlEv":0,
        #     "closedSize":0,
        #     "code":0,
        #     "cumQty":0,
        #     "cumValueEv":0,
        #     "curAccBalanceEv":400079,
        #     "curAssignedPosBalanceEv":0,
        #     "curBonusBalanceEv":0,
        #     "curLeverageEr":0,
        #     "curPosSide":"None",
        #     "curPosSize":0,
        #     "curPosTerm":1,
        #     "curPosValueEv":0,
        #     "curRiskLimitEv":5000000000,
        #     "currency":"USD",
        #     "cxlRejReason":0,
        #     "displayQty":0,
        #     "execFeeEv":0,
        #     "execID":"00000000-0000-0000-0000-000000000000",
        #     "execPriceEp":0,
        #     "execQty":1,
        #     "execSeq":26975862338,
        #     "execStatus":"Canceled",
        #     "execValueEv":0,
        #     "feeRateEr":0,
        #     "leavesQty":0,
        #     "leavesValueEv":0,
        #     "message":"No error",
        #     "ordStatus":"Canceled",
        #     "ordType":"Limit",
        #     "orderID":"8141deb9-8f94-48f6-9421-a4e3a791537b",
        #     "orderQty":1,
        #     "pegOffsetValueEp":0,
        #     "priceEp":9521,
        #     "relatedPosTerm":1,
        #     "relatedReqNum":4,
        #     "side":"Buy",
        #     "slTrigger":"ByMarkPrice",
        #     "stopLossEp":0,
        #     "stopPxEp":0,
        #     "symbol":"ADAUSD",
        #     "takeProfitEp":0,
        #     "timeInForce":"GoodTillCancel",
        #     "tpTrigger":"ByLastPrice",
        #     "transactTimeNs":"1650450096108143014",
        #     "userID":2647224
        #  }
        #
        id = self.safe_string(order, 'orderID')
        clientOrderId = self.safe_string(order, 'clOrdID')
        if (clientOrderId is not None) and (len(clientOrderId) < 1):
            clientOrderId = None
        marketId = self.safe_string(order, 'symbol')
        market = self.safe_market(marketId, market)
        symbol = market['symbol']
        status = self.parse_order_status(self.safe_string(order, 'ordStatus'))
        side = self.safe_string_lower(order, 'side')
        type = self.parseOrderType(self.safe_string(order, 'ordType'))
        price = self.parse_number(self.from_ep(self.safe_string(order, 'priceEp'), market))
        amount = self.safe_string(order, 'orderQty')
        filled = self.safe_string(order, 'cumQty')
        remaining = self.safe_string(order, 'leavesQty')
        timestamp = self.safe_integer_product(order, 'actionTimeNs', 0.000001)
        costEv = self.safe_string(order, 'cumValueEv')
        cost = self.from_ev(costEv, market)
        lastTradeTimestamp = self.safe_integer_product(order, 'transactTimeNs', 0.000001)
        if lastTradeTimestamp == 0:
            lastTradeTimestamp = None
        timeInForce = self.parseTimeInForce(self.safe_string(order, 'timeInForce'))
        stopPrice = self.safe_string(order, 'stopPx')
        postOnly = (timeInForce == 'PO')
        return self.safe_order({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'datetime': self.iso8601(timestamp),
            'timestamp': timestamp,
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopPrice': stopPrice,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'cost': cost,
            'average': None,
            'status': status,
            'fee': None,
            'trades': None,
        }, market)

    def handle_message(self, client, message):
        # private spot update
        # {
        #     orders: {closed: [], fills: [], open: []},
        #     sequence: 40435835,
        #     timestamp: '1650443245600839241',
        #     type: 'snapshot',
        #     wallets: [
        #       {
        #         balanceEv: 0,
        #         currency: 'BTC',
        #         lastUpdateTimeNs: '1650442638722099092',
        #         lockedTradingBalanceEv: 0,
        #         lockedWithdrawEv: 0,
        #         userID: 2647224
        #       },
        #       {
        #         balanceEv: 1154232337,
        #         currency: 'USDT',
        #         lastUpdateTimeNs: '1650442617610017597',
        #         lockedTradingBalanceEv: 0,
        #         lockedWithdrawEv: 0,
        #         userID: 2647224
        #       }
        #     ]
        # }
        # private swap update
        # {
        #     sequence: 83839628,
        #     timestamp: '1650382581827447829',
        #     type: 'snapshot',
        #     accounts: [
        #       {
        #         accountBalanceEv: 0,
        #         accountID: 26472240001,
        #         bonusBalanceEv: 0,
        #         currency: 'BTC',
        #         totalUsedBalanceEv: 0,
        #         userID: 2647224
        #       }
        #     ],
        #     orders: [],
        #     positions: [
        #       {
        #         accountID: 26472240001,
        #         assignedPosBalanceEv: 0,
        #         avgEntryPriceEp: 0,
        #         bankruptCommEv: 0,
        #         bankruptPriceEp: 0,
        #         buyLeavesQty: 0,
        #         buyLeavesValueEv: 0,
        #         buyValueToCostEr: 1150750,
        #         createdAtNs: 0,
        #         crossSharedBalanceEv: 0,
        #         cumClosedPnlEv: 0,
        #         cumFundingFeeEv: 0,
        #         cumTransactFeeEv: 0,
        #         curTermRealisedPnlEv: 0,
        #         currency: 'BTC',
        #         dataVer: 2,
        #         deleveragePercentileEr: 0,
        #         displayLeverageEr: 10000000000,
        #         estimatedOrdLossEv: 0,
        #         execSeq: 0,
        #         freeCostEv: 0,
        #         freeQty: 0,
        #         initMarginReqEr: 1000000,
        #         lastFundingTime: '1640601827712091793',
        #         lastTermEndTime: 0,
        #         leverageEr: 0,
        #         liquidationPriceEp: 0,
        #         maintMarginReqEr: 500000,
        #         makerFeeRateEr: 0,
        #         markPriceEp: 507806777,
        #         orderCostEv: 0,
        #         posCostEv: 0,
        #         positionMarginEv: 0,
        #         positionStatus: 'Normal',
        #         riskLimitEv: 10000000000,
        #         sellLeavesQty: 0,
        #         sellLeavesValueEv: 0,
        #         sellValueToCostEr: 1149250,
        #         side: 'None',
        #         size: 0,
        #         symbol: 'BTCUSD',
        #         takerFeeRateEr: 0,
        #         term: 1,
        #         transactTimeNs: 0,
        #         unrealisedPnlEv: 0,
        #         updatedAtNs: 0,
        #         usedBalanceEv: 0,
        #         userID: 2647224,
        #         valueEv: 0
        #       }
        #     ]
        # }
        id = self.safe_integer(message, 'id')
        if id is not None:
            # not every method stores its subscription
            # as an object so we can't do indeById here
            subs = client.subscriptions
            values = list(subs.values())
            for i in range(0, len(values)):
                subscription = values[i]
                if subscription is not True:
                    subId = self.safe_integer(subscription, 'id')
                    if (subId is not None) and (subId == id):
                        method = self.safe_value(subscription, 'method')
                        if method is not None:
                            method(client, message)
                            return
        if ('market24h' in message) or ('spot_market24h' in message):
            return self.handle_ticker(client, message)
        elif 'trades' in message:
            return self.handle_trades(client, message)
        elif 'kline' in message:
            return self.handle_ohlcv(client, message)
        elif 'book' in message:
            return self.handle_order_book(client, message)
        if 'orders' in message:
            orders = self.safe_value(message, 'orders', {})
            self.handle_orders(client, orders)
        if ('accounts' in message) or ('wallets' in message):
            type = 'swap' if ('accounts' in message) else 'spot'
            accounts = self.safe_value_2(message, 'accounts', 'wallets', [])
            self.handle_balance(type, client, accounts)

    def handle_authenticate(self, client, message):
        #
        # {
        #     "error": null,
        #     "id": 1234,
        #     "result": {
        #       "status": "success"
        #     }
        # }
        #
        future = client.futures['authenticated']
        future.resolve(1)
        return message

    async def subscribe_private(self, type, messageHash, params={}):
        await self.load_markets()
        await self.authenticate()
        url = self.urls['api']['ws']
        requestId = self.seconds()
        channel = 'wo.subscribe' if (type == 'spot') else 'aop.subscribe'
        request = {
            'id': requestId,
            'method': channel,
            'params': [],
        }
        request = self.extend(request, params)
        subscription = {
            'id': requestId,
            'messageHash': messageHash,
        }
        return await self.watch(url, messageHash, request, channel, subscription)

    async def authenticate(self, params={}):
        self.check_required_credentials()
        url = self.urls['api']['ws']
        client = self.client(url)
        time = self.seconds()
        messageHash = 'authenticated'
        future = client.future(messageHash)
        authenticated = self.safe_value(client.subscriptions, messageHash)
        if authenticated is None:
            expiryDelta = self.safe_integer(self.options, 'expires', 120)
            expiration = self.seconds() + expiryDelta
            payload = self.apiKey + str(expiration)
            signature = self.hmac(self.encode(payload), self.encode(self.secret), hashlib.sha256)
            request = {
                'method': 'user.auth',
                'params': ['API', self.apiKey, signature, expiration],
                'id': time,
            }
            subscription = {
                'id': time,
                'method': self.handle_authenticate,
            }
            self.spawn(self.watch, url, messageHash, request, messageHash, subscription)
        return await future
