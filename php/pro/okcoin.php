<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ArgumentsRequired;
use ccxt\AuthenticationError;
use React\Async;

class okcoin extends \ccxt\async\okcoin {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchTicker' => true,
                'watchTickers' => false, // for now
                'watchOrderBook' => true,
                'watchOrders' => true,
                'watchTrades' => true,
                'watchBalance' => true,
                'watchOHLCV' => true,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => 'wss://real.okcoin.com:8443/ws/v3',
                ),
                'logo' => 'https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg',
                'www' => 'https://www.okcoin.com',
                'doc' => 'https://www.okcoin.com/docs/en/',
                'fees' => 'https://www.okcoin.com/coin-fees',
                'referral' => 'https://www.okcoin.com/account/register?flag=activity&channelId=600001513',
            ),
            'options' => array(
                'fetchMarkets' => array( 'spot' ),
                'watchOrders' => 'order', // or algo_order
                'watchOrderBook' => array(
                    'limit' => 400, // max
                    'type' => 'spot', // margin
                    'depth' => 'depth_l2_tbt', // depth5, depth
                ),
                'watchBalance' => 'spot', // margin, futures, swap
                'ws' => array(
                    'inflate' => true,
                ),
            ),
            'streaming' => array(
                // okex does not support built-in ws protocol-level ping-pong
                // instead it requires a custom text-based ping-pong
                'ping' => array($this, 'ping'),
                'keepAlive' => 20000,
            ),
        ));
    }

    public function subscribe($channel, $symbol, $params = array ()) {
        return Async\async(function () use ($channel, $symbol, $params) {
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $url = $this->urls['api']['ws'];
            $messageHash = $market['type'] . '/' . $channel . ':' . $market['id'];
            $request = array(
                'op' => 'subscribe',
                'args' => array( $messageHash ),
            );
            return Async\await($this->watch($url, $messageHash, $this->deep_extend($request, $params), $messageHash));
        }) ();
    }

    public function watch_trades(string $symbol, ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of most recent $trades for a particular $symbol
             * @param {string} $symbol unified $symbol of the market to fetch $trades for
             * @param {int} [$since] timestamp in ms of the earliest trade to fetch
             * @param {int} [$limit] the maximum amount of $trades to fetch
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {array[]} a list of {@link https://github.com/ccxt/ccxt/wiki/Manual#public-$trades trade structures}
             */
            Async\await($this->load_markets());
            $symbol = $this->symbol($symbol);
            $trades = Async\await($this->subscribe('trade', $symbol, $params));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($trades, $since, $limit, 'timestamp', true);
        }) ();
    }

    public function watch_orders(?string $symbol = null, ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on multiple orders made by the user
             * @param {string} $symbol unified market $symbol of the market orders were made in
             * @param {int} [$since] the earliest time in ms to fetch orders for
             * @param {int} [$limit] the maximum number of  orde structures to retrieve
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {array[]} a list of {@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure order structures}
             */
            Async\await($this->load_markets());
            Async\await($this->authenticate());
            if ($symbol !== null) {
                $symbol = $this->symbol($symbol);
            }
            $orderType = $this->safe_string($this->options, 'watchOrders', 'order');
            $trades = Async\await($this->subscribe($orderType, $symbol, $params));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($trades, $since, $limit, 'timestamp', true);
        }) ();
    }

    public function handle_orders(Client $client, $message, $subscription = null) {
        //
        // {
        //     $table => 'spot/order',
        //     data => array(
        //       {
        //         client_oid => '',
        //         created_at => '2022-03-04T16:44:58.530Z',
        //         event_code => '0',
        //         event_message => '',
        //         fee => '',
        //         fee_currency => '',
        //         filled_notional => '0',
        //         filled_size => '0',
        //         instrument_id => 'LTC-USD',
        //         last_amend_result => '',
        //         last_fill_id => '0',
        //         last_fill_px => '0',
        //         last_fill_qty => '0',
        //         last_fill_time => '1970-01-01T00:00:00.000Z',
        //         last_request_id => '',
        //         margin_trading => '1',
        //         notional => '',
        //         order_id => '8629537900471296',
        //         order_type => '0',
        //         price => '1500',
        //         rebate => '',
        //         rebate_currency => '',
        //         side => 'sell',
        //         size => '0.0133',
        //         state => '0',
        //         status => 'open',
        //         timestamp => '2022-03-04T16:44:58.530Z',
        //         type => 'limit'
        //       }
        //     )
        //   }
        //
        $table = $this->safe_string($message, 'table');
        $orders = $this->safe_value($message, 'data', array());
        $ordersLength = count($orders);
        if ($ordersLength > 0) {
            $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
            if ($this->orders === null) {
                $this->orders = new ArrayCacheBySymbolById ($limit);
            }
            $stored = $this->orders;
            $marketIds = array();
            $parsed = $this->parse_orders($orders);
            for ($i = 0; $i < count($parsed); $i++) {
                $order = $parsed[$i];
                $stored->append ($order);
                $symbol = $order['symbol'];
                $market = $this->market($symbol);
                $marketIds[$market['id']] = true;
            }
            $keys = is_array($marketIds) ? array_keys($marketIds) : array();
            for ($i = 0; $i < count($keys); $i++) {
                $messageHash = $table . ':' . $keys[$i];
                $client->resolve ($this->orders, $messageHash);
            }
        }
    }

    public function watch_ticker(string $symbol, $params = array ()) {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
             * @param {string} $symbol unified $symbol of the market to fetch the ticker for
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {array} a {@link https://github.com/ccxt/ccxt/wiki/Manual#ticker-structure ticker structure}
             */
            return Async\await($this->subscribe('ticker', $symbol, $params));
        }) ();
    }

    public function handle_trade(Client $client, $message) {
        //
        //     {
        //         $table => 'spot/trade',
        //         $data => array(
        //             {
        //                 side => 'buy',
        //                 trade_id => '30770973',
        //                 price => '4665.4',
        //                 size => '0.019',
        //                 instrument_id => 'BTC-USDT',
        //                 timestamp => '2020-03-16T13:41:46.526Z'
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        $tradesLimit = $this->safe_integer($this->options, 'tradesLimit', 1000);
        for ($i = 0; $i < count($data); $i++) {
            $trade = $this->parse_trade($data[$i]);
            $symbol = $trade['symbol'];
            $marketId = $this->safe_string($trade['info'], 'instrument_id');
            $messageHash = $table . ':' . $marketId;
            $stored = $this->safe_value($this->trades, $symbol);
            if ($stored === null) {
                $stored = new ArrayCache ($tradesLimit);
                $this->trades[$symbol] = $stored;
            }
            $stored->append ($trade);
            $client->resolve ($stored, $messageHash);
        }
        return $message;
    }

    public function handle_ticker(Client $client, $message) {
        //
        //     {
        //         $table => 'spot/ticker',
        //         $data => array(
        //             {
        //                 last => '4634.1',
        //                 open_24h => '5305.6',
        //                 best_bid => '4631.6',
        //                 high_24h => '5950',
        //                 low_24h => '4448.8',
        //                 base_volume_24h => '147913.11435388',
        //                 quote_volume_24h => '756850119.99108082',
        //                 best_ask => '4631.7',
        //                 instrument_id => 'BTC-USDT',
        //                 timestamp => '2020-03-16T13:16:25.677Z',
        //                 best_bid_size => '0.12348942',
        //                 best_ask_size => '0.00100014',
        //                 last_qty => '0.00331822'
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        for ($i = 0; $i < count($data); $i++) {
            $ticker = $this->parse_ticker($data[$i]);
            $symbol = $ticker['symbol'];
            $marketId = $this->safe_string($ticker['info'], 'instrument_id');
            $messageHash = $table . ':' . $marketId;
            $this->tickers[$symbol] = $ticker;
            $client->resolve ($ticker, $messageHash);
        }
        return $message;
    }

    public function watch_ohlcv(string $symbol, $timeframe = '1m', ?int $since = null, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            /**
             * watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
             * @param {string} $symbol unified $symbol of the market to fetch OHLCV data for
             * @param {string} $timeframe the length of time each candle represents
             * @param {int} [$since] timestamp in ms of the earliest candle to fetch
             * @param {int} [$limit] the maximum amount of candles to fetch
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {int[][]} A list of candles ordered, open, high, low, close, volume
             */
            Async\await($this->load_markets());
            $symbol = $this->symbol($symbol);
            $interval = $this->safe_string($this->timeframes, $timeframe, $timeframe);
            $name = 'candle' . $interval . 's';
            $ohlcv = Async\await($this->subscribe($name, $symbol, $params));
            if ($this->newUpdates) {
                $limit = $ohlcv->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($ohlcv, $since, $limit, 0, true);
        }) ();
    }

    public function handle_ohlcv(Client $client, $message) {
        //
        //     {
        //         $table => "spot/candle60s",
        //         $data => array(
        //             {
        //                 $candle => array(
        //                     "2020-03-16T14:29:00.000Z",
        //                     "4948.3",
        //                     "4966.7",
        //                     "4939.1",
        //                     "4945.3",
        //                     "238.36021657"
        //                 ),
        //                 instrument_id => "BTC-USDT"
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        $parts = explode('/', $table);
        $part1 = $this->safe_string($parts, 1);
        $interval = str_replace('candle', '', $part1);
        $interval = str_replace('s', '', $interval);
        // use a reverse lookup in a static map instead
        $timeframe = $this->find_timeframe($interval);
        for ($i = 0; $i < count($data); $i++) {
            $marketId = $this->safe_string($data[$i], 'instrument_id');
            $candle = $this->safe_value($data[$i], 'candle');
            $market = $this->safe_market($marketId);
            $symbol = $market['symbol'];
            $parsed = $this->parse_ohlcv($candle, $market);
            $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
            $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe);
            if ($stored === null) {
                $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
                $stored = new ArrayCacheByTimestamp ($limit);
                $this->ohlcvs[$symbol][$timeframe] = $stored;
            }
            $stored->append ($parsed);
            $messageHash = $table . ':' . $marketId;
            $client->resolve ($stored, $messageHash);
        }
    }

    public function watch_order_book(string $symbol, ?int $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             * @param {string} $symbol unified $symbol of the market to fetch the order book for
             * @param {int} [$limit] the maximum amount of order book entries to return
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {array} A dictionary of {@link https://github.com/ccxt/ccxt/wiki/Manual#order-book-structure order book structures} indexed by market symbols
             */
            $options = $this->safe_value($this->options, 'watchOrderBook', array());
            $depth = $this->safe_string($options, 'depth', 'depth_l2_tbt');
            $orderbook = Async\await($this->subscribe($depth, $symbol, $params));
            return $orderbook->limit ();
        }) ();
    }

    public function handle_delta($bookside, $delta) {
        $price = $this->safe_float($delta, 0);
        $amount = $this->safe_float($delta, 1);
        $bookside->store ($price, $amount);
    }

    public function handle_deltas($bookside, $deltas) {
        for ($i = 0; $i < count($deltas); $i++) {
            $this->handle_delta($bookside, $deltas[$i]);
        }
    }

    public function handle_order_book_message(Client $client, $message, $orderbook) {
        //
        //     {
        //         instrument_id => "BTC-USDT",
        //         $asks => [
        //             ["4568.5", "0.49723138", "2"],
        //             ["4568.7", "0.5013", "1"],
        //             ["4569.1", "0.4398", "1"],
        //         ],
        //         $bids => [
        //             ["4568.4", "0.84187666", "5"],
        //             ["4568.3", "0.75661506", "6"],
        //             ["4567.8", "2.01", "2"],
        //         ],
        //         $timestamp => "2020-03-16T11:11:43.388Z",
        //         checksum => 473370408
        //     }
        //
        $asks = $this->safe_value($message, 'asks', array());
        $bids = $this->safe_value($message, 'bids', array());
        $this->handle_deltas($orderbook['asks'], $asks);
        $this->handle_deltas($orderbook['bids'], $bids);
        $timestamp = $this->parse8601($this->safe_string($message, 'timestamp'));
        $orderbook['timestamp'] = $timestamp;
        $orderbook['datetime'] = $this->iso8601($timestamp);
        return $orderbook;
    }

    public function handle_order_book(Client $client, $message) {
        //
        // first $message (snapshot)
        //
        //     {
        //         $table => "spot/depth",
        //         $action => "partial",
        //         $data => [
        //             {
        //                 instrument_id => "BTC-USDT",
        //                 asks => [
        //                     ["4568.5", "0.49723138", "2"],
        //                     ["4568.7", "0.5013", "1"],
        //                     ["4569.1", "0.4398", "1"],
        //                 ],
        //                 bids => [
        //                     ["4568.4", "0.84187666", "5"],
        //                     ["4568.3", "0.75661506", "6"],
        //                     ["4567.8", "2.01", "2"],
        //                 ],
        //                 timestamp => "2020-03-16T11:11:43.388Z",
        //                 checksum => 473370408
        //             }
        //         ]
        //     }
        //
        // subsequent updates
        //
        //     {
        //         $table => "spot/depth",
        //         $action => "update",
        //         $data => [
        //             {
        //                 instrument_id =>   "BTC-USDT",
        //                 asks => [
        //                     ["4598.8", "0", "0"],
        //                     ["4599.1", "0", "0"],
        //                     ["4600.3", "0", "0"],
        //                 ],
        //                 bids => [
        //                     ["4598.5", "0.08", "1"],
        //                     ["4598.2", "0.0337323", "1"],
        //                     ["4598.1", "0.12681801", "3"],
        //                 ],
        //                 timestamp => "2020-03-16T11:20:35.139Z",
        //                 checksum => 740786981
        //             }
        //         ]
        //     }
        //
        $action = $this->safe_string($message, 'action');
        $data = $this->safe_value($message, 'data', array());
        $table = $this->safe_string($message, 'table');
        if ($action === 'partial') {
            for ($i = 0; $i < count($data); $i++) {
                $update = $data[$i];
                $marketId = $this->safe_string($update, 'instrument_id');
                $market = $this->safe_market($marketId);
                $symbol = $market['symbol'];
                $options = $this->safe_value($this->options, 'watchOrderBook', array());
                // default $limit is 400 bidasks
                $limit = $this->safe_integer($options, 'limit', 400);
                $orderbook = $this->order_book(array(), $limit);
                $this->orderbooks[$symbol] = $orderbook;
                $this->handle_order_book_message($client, $update, $orderbook);
                $messageHash = $table . ':' . $marketId;
                $client->resolve ($orderbook, $messageHash);
            }
        } else {
            for ($i = 0; $i < count($data); $i++) {
                $update = $data[$i];
                $marketId = $this->safe_string($update, 'instrument_id');
                $market = $this->safe_market($marketId);
                $symbol = $market['symbol'];
                if (is_array($this->orderbooks) && array_key_exists($symbol, $this->orderbooks)) {
                    $orderbook = $this->orderbooks[$symbol];
                    $this->handle_order_book_message($client, $update, $orderbook);
                    $messageHash = $table . ':' . $marketId;
                    $client->resolve ($orderbook, $messageHash);
                }
            }
        }
        return $message;
    }

    public function authenticate($params = array ()) {
        return Async\async(function () use ($params) {
            $this->check_required_credentials();
            $url = $this->urls['api']['ws'];
            $messageHash = 'login';
            $client = $this->client($url);
            $future = $this->safe_value($client->subscriptions, $messageHash);
            if ($future === null) {
                $future = $client->future ('authenticated');
                $timestamp = (string) $this->seconds();
                $method = 'GET';
                $path = '/users/self/verify';
                $auth = $timestamp . $method . $path;
                $signature = $this->hmac($this->encode($auth), $this->encode($this->secret), 'sha256', 'base64');
                $request = array(
                    'op' => $messageHash,
                    'args' => array(
                        $this->apiKey,
                        $this->password,
                        $timestamp,
                        $signature,
                    ),
                );
                $this->spawn(array($this, 'watch'), $url, $messageHash, $request, $messageHash, $future);
            }
            return Async\await($future);
        }) ();
    }

    public function watch_balance($params = array ()) {
        return Async\async(function () use ($params) {
            /**
             * watch balance and get the amount of funds available for trading or funds locked in orders
             * @param {array} [$params] extra parameters specific to the okcoin api endpoint
             * @return {array} a {@link https://github.com/ccxt/ccxt/wiki/Manual#balance-structure balance structure}
             */
            $defaultType = $this->safe_string_2($this->options, 'watchBalance', 'defaultType');
            $type = $this->safe_string($params, 'type', $defaultType);
            if ($type === null) {
                throw new ArgumentsRequired($this->id . " watchBalance requires a $type parameter (one of 'spot', 'margin', 'futures', 'swap')");
            }
            // $query = $this->omit($params, 'type');
            $negotiation = Async\await($this->authenticate());
            return Async\await($this->subscribe_to_user_account($negotiation, $params));
        }) ();
    }

    public function subscribe_to_user_account($negotiation, $params = array ()) {
        return Async\async(function () use ($negotiation, $params) {
            $defaultType = $this->safe_string_2($this->options, 'watchBalance', 'defaultType');
            $type = $this->safe_string($params, 'type', $defaultType);
            if ($type === null) {
                throw new ArgumentsRequired($this->id . " watchBalance requires a $type parameter (one of 'spot', 'margin', 'futures', 'swap')");
            }
            Async\await($this->load_markets());
            $currencyId = $this->safe_string($params, 'currency');
            $code = $this->safe_string($params, 'code', $this->safe_currency_code($currencyId));
            $currency = null;
            if ($code !== null) {
                $currency = $this->currency($code);
            }
            $symbol = $this->safe_string($params, 'symbol');
            $market = $this->market($symbol);
            $marketUndefined = ($market === null);
            $currencyUndefined = ($currency === null);
            if ($type === 'spot') {
                if ($currencyUndefined) {
                    throw new ArgumentsRequired($this->id . " watchBalance requires a 'currency' (id) or a unified 'code' parameter for " . $type . ' accounts');
                }
            } elseif (($type === 'margin') || ($type === 'swap') || ($type === 'option')) {
                if ($marketUndefined) {
                    throw new ArgumentsRequired($this->id . " watchBalance requires a 'instrument_id' (id) or a unified 'symbol' parameter for " . $type . ' accounts');
                }
            } elseif ($type === 'futures') {
                if ($currencyUndefined && $marketUndefined) {
                    throw new ArgumentsRequired($this->id . " watchBalance requires a 'currency' (id), or unified 'code', or 'instrument_id' (id), or unified 'symbol' parameter for " . $type . ' accounts');
                }
            }
            $suffix = null;
            if (!$currencyUndefined) {
                $suffix = $currency['id'];
            } elseif (!$marketUndefined) {
                $suffix = $market['id'];
            }
            $accountType = ($type === 'margin') ? 'spot' : $type;
            $account = ($type === 'margin') ? 'margin_account' : 'account';
            $messageHash = $accountType . '/' . $account;
            $subscriptionHash = $messageHash . ':' . $suffix;
            $url = $this->urls['api']['ws'];
            $request = array(
                'op' => 'subscribe',
                'args' => array( $subscriptionHash ),
            );
            $query = $this->omit($params, array( 'currency', 'code', 'instrument_id', 'symbol', 'type' ));
            return Async\await($this->watch($url, $messageHash, $this->deep_extend($request, $query), $subscriptionHash));
        }) ();
    }

    public function handle_balance(Client $client, $message) {
        //
        // spot
        //
        //     {
        //         $table => 'spot/account',
        //         $data => array(
        //             {
        //                 available => '11.044827320825',
        //                 currency => 'USDT',
        //                 id => '',
        //                 $balance => '11.044827320825',
        //                 hold => '0'
        //             }
        //         )
        //     }
        //
        // margin
        //
        //     {
        //         $table => "spot/margin_account",
        //         $data => array(
        //             {
        //                 maint_margin_ratio => "0.08",
        //                 liquidation_price => "0",
        //                 'currency:USDT' => array( available => "0", $balance => "0", borrowed => "0", hold => "0", lending_fee => "0" ),
        //                 tiers => "1",
        //                 instrument_id =>   "ETH-USDT",
        //                 'currency:ETH' => array( available => "0", $balance => "0", borrowed => "0", hold => "0", lending_fee => "0" )
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $parts = explode('/', $table);
        $data = $this->safe_value($message, 'data', array());
        $this->balance['info'] = $data;
        $type = $this->safe_string($parts, 0);
        if ($type === 'spot') {
            $part1 = $this->safe_string($parts, 1);
            if ($part1 === 'margin_account') {
                $type = 'margin';
            }
        }
        for ($i = 0; $i < count($data); $i++) {
            $balance = $this->parseBalanceByType ($type, $data);
            $oldBalance = $this->safe_value($this->balance, $type, array());
            $newBalance = $this->deep_extend($oldBalance, $balance);
            $this->balance[$type] = $this->safe_balance($newBalance);
            $client->resolve ($this->balance[$type], $table);
        }
    }

    public function handle_subscription_status(Client $client, $message) {
        //
        //     array("event":"subscribe","channel":"spot/depth:BTC-USDT")
        //
        // $channel = $this->safe_string($message, 'channel');
        // $client->subscriptions[$channel] = $message;
        return $message;
    }

    public function handle_authenticate(Client $client, $message) {
        //
        //     array( event => 'login', success => true )
        //
        $client->resolve ($message, 'authenticated');
        return $message;
    }

    public function ping($client) {
        // okex does not support built-in ws protocol-level ping-pong
        // instead it requires custom text-based ping-pong
        return 'ping';
    }

    public function handle_pong(Client $client, $message) {
        $client->lastPong = $this->milliseconds();
        return $message;
    }

    public function handle_error_message(Client $client, $message) {
        //
        //     array( event => 'error', $message => 'Invalid sign', $errorCode => 30013 )
        //     array("event":"error","message":"Unrecognized request => array(\"event\":\"subscribe\",\"channel\":\"spot/depth:BTC-USDT\")","errorCode":30039)
        //     array( event => 'error', $message => "Channel spot/order doesn't exist", $errorCode => 30040 )
        //
        $errorCode = $this->safe_string($message, 'errorCode');
        try {
            if ($errorCode !== null) {
                $feedback = $this->id . ' ' . $this->json($message);
                $this->throw_exactly_matched_exception($this->exceptions['exact'], $errorCode, $feedback);
                $messageString = $this->safe_value($message, 'message');
                if ($messageString !== null) {
                    $this->throw_broadly_matched_exception($this->exceptions['broad'], $messageString, $feedback);
                }
            }
        } catch (Exception $e) {
            if ($e instanceof AuthenticationError) {
                $client->reject ($e, 'authenticated');
                $method = 'login';
                if (is_array($client->subscriptions) && array_key_exists($method, $client->subscriptions)) {
                    unset($client->subscriptions[$method]);
                }
                return false;
            }
        }
        return $message;
    }

    public function handle_message(Client $client, $message) {
        if (!$this->handle_error_message($client, $message)) {
            return;
        }
        //
        //     array("event":"error","message":"Unrecognized request => array(\"event\":\"subscribe\",\"channel\":\"spot/depth:BTC-USDT\")","errorCode":30039)
        //     array("event":"subscribe","channel":"spot/depth:BTC-USDT")
        //     {
        //         $table => "spot/depth",
        //         action => "partial",
        //         data => [
        //             {
        //                 instrument_id =>   "BTC-USDT",
        //                 asks => [
        //                     ["5301.8", "0.03763319", "1"],
        //                     ["5302.4", "0.00305", "2"],
        //                 ],
        //                 bids => [
        //                     ["5301.7", "0.58911427", "6"],
        //                     ["5301.6", "0.01222922", "4"],
        //                 ],
        //                 timestamp => "2020-03-16T03:25:00.440Z",
        //                 checksum => -2088736623
        //             }
        //         ]
        //     }
        // {
        //     "table":"spot/order",
        //     "data":array(
        //         {
        //             "client_oid":"",
        //             "filled_notional":"0",
        //             "filled_size":"0",
        //             "instrument_id":"ETC-USDT",
        //             "last_fill_px":"0",
        //             "last_fill_qty":"0",
        //             "last_fill_time":"1970-01-01T00:00:00.000Z",
        //             "margin_trading":"1",
        //             "notional":"",
        //             "order_id":"3576398568830976",
        //             "order_type":"0",
        //             "price":"5.826",
        //             "side":"buy",
        //             "size":"0.1",
        //             "state":"0",
        //             "status":"open",
        //             "fee_currency":"ETC",
        //             "fee":"-0.01",
        //             "rebate_currency":"open",
        //             "rebate":"0.05",
        //             "timestamp":"2019-09-24T06:45:11.394Z",
        //             "type":"limit",
        //             "created_at":"2019-09-24T06:45:11.394Z"
        //         }
        //     )
        // }
        //
        if ($message === 'pong') {
            return $this->handle_pong($client, $message);
        }
        $table = $this->safe_string($message, 'table');
        if ($table === null) {
            $event = $this->safe_string($message, 'event');
            if ($event !== null) {
                $methods = array(
                    // 'info' => $this->handleSystemStatus,
                    // 'book' => 'handleOrderBook',
                    'login' => array($this, 'handle_authenticate'),
                    'subscribe' => array($this, 'handle_subscription_status'),
                );
                $method = $this->safe_value($methods, $event);
                if ($method === null) {
                    return $message;
                } else {
                    return $method($client, $message);
                }
            }
        } else {
            $parts = explode('/', $table);
            $name = $this->safe_string($parts, 1);
            $methods = array(
                'depth' => array($this, 'handle_order_book'),
                'depth5' => array($this, 'handle_order_book'),
                'depth_l2_tbt' => array($this, 'handle_order_book'),
                'ticker' => array($this, 'handle_ticker'),
                'trade' => array($this, 'handle_trade'),
                'account' => array($this, 'handle_balance'),
                'margin_account' => array($this, 'handle_balance'),
                'order' => array($this, 'handle_orders'),
                // ...
            );
            $method = $this->safe_value($methods, $name);
            if (mb_strpos($name, 'candle') !== false) {
                $method = array($this, 'handle_ohlcv');
            }
            if ($method === null) {
                return $message;
            } else {
                return $method($client, $message);
            }
        }
    }
}
