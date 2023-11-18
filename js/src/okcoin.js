//  ---------------------------------------------------------------------------
import Exchange from './abstract/okcoin.js';
import { ExchangeError, ExchangeNotAvailable, OnMaintenance, ArgumentsRequired, BadRequest, AccountSuspended, InvalidAddress, PermissionDenied, NetworkError, InsufficientFunds, InvalidNonce, CancelPending, InvalidOrder, OrderNotFound, AuthenticationError, RequestTimeout, AccountNotEnabled, BadSymbol, RateLimitExceeded } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
//  ---------------------------------------------------------------------------
/**
 * @class okcoin
 * @extends Exchange
 */
export default class okcoin extends Exchange {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'okcoin',
            'name': 'OKCoin',
            'countries': ['CN', 'US'],
            'version': 'v5',
            // cheapest endpoint is 100 requests per 2 seconds
            // 50 requests per second => 1000 / 50 = 20ms
            'rateLimit': 20,
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': true,
                'option': undefined,
                'cancelOrder': true,
                'createOrder': true,
                'fetchBalance': true,
                'fetchClosedOrders': true,
                'fetchCurrencies': true,
                'fetchDepositAddress': true,
                'fetchDeposits': true,
                'fetchLedger': true,
                'fetchMarkets': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': undefined,
                'fetchOrderTrades': true,
                'fetchPosition': false,
                'fetchPositions': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTransactions': undefined,
                'fetchWithdrawals': true,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1H',
                '2h': '2H',
                '4h': '4H',
                '6h': '6H',
                '12h': '12H',
                '1d': '1D',
                '1w': '1W',
                '1M': '1M',
                '3M': '3M',
            },
            'hostname': 'okcoin.com',
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/51840849/87295551-102fbf00-c50e-11ea-90a9-462eebba5829.jpg',
                'api': {
                    'rest': 'https://www.{hostname}',
                },
                'www': 'https://www.okcoin.com',
                'doc': 'https://www.okcoin.com/docs/en/',
                'fees': 'https://www.okcoin.com/coin-fees',
                'referral': 'https://www.okcoin.com/account/register?flag=activity&channelId=600001513',
                'test': {
                    'rest': 'https://testnet.okex.com',
                },
            },
            'api': {
                'public': {
                    'get': {
                        'market/tickers': 1,
                        'market/ticker': 1,
                        'market/books': 1 / 2,
                        'market/candles': 1 / 2,
                        'market/history-candles': 1 / 2,
                        'market/trades': 1 / 5,
                        'market/history-trades': 2,
                        'market/platform-24-volume': 10,
                        'market/open-oracle': 50,
                        'market/exchange-rate': 20,
                        'public/instruments': 1,
                        'public/time': 2,
                    },
                },
                'private': {
                    'get': {
                        // trade
                        'trade/order': 1 / 3,
                        'trade/orders-pending': 1 / 3,
                        'trade/orders-history': 1 / 2,
                        'trade/orders-history-archive': 1 / 2,
                        'trade/fills': 1 / 3,
                        'trade/fills-history': 2.2,
                        'trade/fills-archive': 2,
                        'trade/order-algo': 1,
                        'trade/orders-algo-pending': 1,
                        'trade/orders-algo-history': 1,
                        // rfq
                        'otc/rfq/trade': 4,
                        'otc/rfq/history': 4,
                        // account
                        'account/balance': 2,
                        'account/bills': 5 / 3,
                        'account/bills-archive': 5 / 3,
                        'account/config': 4,
                        'account/max-size': 4,
                        'account/max-avail-size': 4,
                        'account/trade-fee': 4,
                        'account/max-withdrawal': 4,
                        // funding or assets
                        'asset/currencies': 5 / 3,
                        'asset/balances': 5 / 3,
                        'asset/asset-valuation': 10,
                        'asset/transfer-state': 10,
                        'asset/bills': 5 / 3,
                        'asset/deposit-lightning': 5,
                        'asset/deposit-address': 5 / 3,
                        'asset/deposit-history': 5 / 3,
                        'asset/withdrawal-history': 5 / 3,
                        'asset/deposit-withdraw-status': 20,
                        // fiat
                        'fiat/deposit-history': 5 / 3,
                        'fiat-withdraw-history': 5 / 3,
                        'fiat-channel': 5 / 3,
                        // sub-account
                        'users/subaccount/list': 10,
                        'users/subaccount/apiKey': 10,
                        'account/subaccount/balances': 10,
                        'asset/subaccount/balances': 10,
                        'asset/subaccount/bills': 10,
                    },
                    'post': {
                        // trade
                        'trade/order': 1 / 3,
                        'trade/batch-orders': 1 / 15,
                        'trade/cancel-order': 1 / 3,
                        'trade/cancel-batch-orders': 1 / 15,
                        'trade/amend-order': 1 / 3,
                        'trade/amend-batch-orders': 1 / 150,
                        'trade/order-algo': 1,
                        'trade/cancel-algos': 1,
                        'trade/cancel-advance-algos': 1,
                        // rfq
                        'otc/rfq/quote': 4,
                        'otc/rfq/trade': 4,
                        // funding
                        'asset/transfer': 4,
                        'asset/withdrawal': 4,
                        'asset/withdrawal-lightning': 4,
                        'asset/withdrawal-cancel': 4,
                        // fiat
                        'fiat/deposit': 5 / 3,
                        'fiat/cancel-deposit': 5 / 3,
                        'fiat/withdrawal': 5 / 3,
                        'fiat/cancel-withdrawal': 5 / 3,
                        // sub-account
                        'asset/subaccount/transfer': 10,
                    },
                },
            },
            'fees': {
                'trading': {
                    'taker': 0.002,
                    'maker': 0.001,
                },
                'spot': {
                    'taker': 0.0015,
                    'maker': 0.0010,
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true,
            },
            'exceptions': {
                'exact': {
                    // Public error codes from 50000-53999
                    // General Class
                    '1': ExchangeError,
                    '2': ExchangeError,
                    '50000': BadRequest,
                    '50001': OnMaintenance,
                    '50002': BadRequest,
                    '50004': RequestTimeout,
                    '50005': ExchangeNotAvailable,
                    '50006': BadRequest,
                    '50007': AccountSuspended,
                    '50008': AuthenticationError,
                    '50009': AccountSuspended,
                    '50010': ExchangeError,
                    '50011': RateLimitExceeded,
                    '50012': ExchangeError,
                    '50013': ExchangeNotAvailable,
                    '50014': BadRequest,
                    '50015': ExchangeError,
                    '50016': ExchangeError,
                    '50017': ExchangeError,
                    '50018': ExchangeError,
                    '50019': ExchangeError,
                    '50020': ExchangeError,
                    '50021': ExchangeError,
                    '50022': ExchangeError,
                    '50023': ExchangeError,
                    '50024': BadRequest,
                    '50025': ExchangeError,
                    '50026': ExchangeNotAvailable,
                    '50027': PermissionDenied,
                    '50028': ExchangeError,
                    '50044': BadRequest,
                    // API Class
                    '50100': ExchangeError,
                    '50101': AuthenticationError,
                    '50102': InvalidNonce,
                    '50103': AuthenticationError,
                    '50104': AuthenticationError,
                    '50105': AuthenticationError,
                    '50106': AuthenticationError,
                    '50107': AuthenticationError,
                    '50108': ExchangeError,
                    '50109': ExchangeError,
                    '50110': PermissionDenied,
                    '50111': AuthenticationError,
                    '50112': AuthenticationError,
                    '50113': AuthenticationError,
                    '50114': AuthenticationError,
                    '50115': BadRequest,
                    // Trade Class
                    '51000': BadRequest,
                    '51001': BadSymbol,
                    '51002': BadSymbol,
                    '51003': BadRequest,
                    '51004': InvalidOrder,
                    '51005': InvalidOrder,
                    '51006': InvalidOrder,
                    '51007': InvalidOrder,
                    '51008': InsufficientFunds,
                    '51009': AccountSuspended,
                    '51010': AccountNotEnabled,
                    '51011': InvalidOrder,
                    '51012': BadSymbol,
                    '51014': BadSymbol,
                    '51015': BadSymbol,
                    '51016': InvalidOrder,
                    '51017': ExchangeError,
                    '51018': ExchangeError,
                    '51019': ExchangeError,
                    '51020': InvalidOrder,
                    '51023': ExchangeError,
                    '51024': AccountSuspended,
                    '51025': ExchangeError,
                    '51026': BadSymbol,
                    '51046': InvalidOrder,
                    '51047': InvalidOrder,
                    '51031': InvalidOrder,
                    '51100': InvalidOrder,
                    '51102': InvalidOrder,
                    '51103': InvalidOrder,
                    '51108': InvalidOrder,
                    '51109': InvalidOrder,
                    '51110': InvalidOrder,
                    '51111': BadRequest,
                    '51112': InvalidOrder,
                    '51113': RateLimitExceeded,
                    '51115': InvalidOrder,
                    '51116': InvalidOrder,
                    '51117': InvalidOrder,
                    '51118': InvalidOrder,
                    '51119': InsufficientFunds,
                    '51120': InvalidOrder,
                    '51121': InvalidOrder,
                    '51122': InvalidOrder,
                    '51124': InvalidOrder,
                    '51125': InvalidOrder,
                    '51126': InvalidOrder,
                    '51127': InsufficientFunds,
                    '51128': InvalidOrder,
                    '51129': InvalidOrder,
                    '51130': BadSymbol,
                    '51131': InsufficientFunds,
                    '51132': InvalidOrder,
                    '51133': InvalidOrder,
                    '51134': InvalidOrder,
                    '51135': InvalidOrder,
                    '51136': InvalidOrder,
                    '51137': InvalidOrder,
                    '51138': InvalidOrder,
                    '51139': InvalidOrder,
                    '51156': BadRequest,
                    '51159': BadRequest,
                    '51162': InvalidOrder,
                    '51163': InvalidOrder,
                    '51166': InvalidOrder,
                    '51174': InvalidOrder,
                    '51201': InvalidOrder,
                    '51202': InvalidOrder,
                    '51203': InvalidOrder,
                    '51204': InvalidOrder,
                    '51205': InvalidOrder,
                    '51250': InvalidOrder,
                    '51251': InvalidOrder,
                    '51252': InvalidOrder,
                    '51253': InvalidOrder,
                    '51254': InvalidOrder,
                    '51255': InvalidOrder,
                    '51256': InvalidOrder,
                    '51257': InvalidOrder,
                    '51258': InvalidOrder,
                    '51259': InvalidOrder,
                    '51260': InvalidOrder,
                    '51261': InvalidOrder,
                    '51262': InvalidOrder,
                    '51263': InvalidOrder,
                    '51264': InvalidOrder,
                    '51265': InvalidOrder,
                    '51267': InvalidOrder,
                    '51268': InvalidOrder,
                    '51269': InvalidOrder,
                    '51270': InvalidOrder,
                    '51271': InvalidOrder,
                    '51272': InvalidOrder,
                    '51273': InvalidOrder,
                    '51274': InvalidOrder,
                    '51275': InvalidOrder,
                    '51276': InvalidOrder,
                    '51277': InvalidOrder,
                    '51278': InvalidOrder,
                    '51279': InvalidOrder,
                    '51280': InvalidOrder,
                    '51321': InvalidOrder,
                    '51322': InvalidOrder,
                    '51323': BadRequest,
                    '51324': BadRequest,
                    '51325': InvalidOrder,
                    '51327': InvalidOrder,
                    '51328': InvalidOrder,
                    '51329': InvalidOrder,
                    '51330': InvalidOrder,
                    '51400': OrderNotFound,
                    '51401': OrderNotFound,
                    '51402': OrderNotFound,
                    '51403': InvalidOrder,
                    '51404': InvalidOrder,
                    '51405': ExchangeError,
                    '51406': ExchangeError,
                    '51407': BadRequest,
                    '51408': ExchangeError,
                    '51409': ExchangeError,
                    '51410': CancelPending,
                    '51500': ExchangeError,
                    '51501': ExchangeError,
                    '51502': InsufficientFunds,
                    '51503': ExchangeError,
                    '51506': ExchangeError,
                    '51508': ExchangeError,
                    '51509': ExchangeError,
                    '51510': ExchangeError,
                    '51511': ExchangeError,
                    '51600': ExchangeError,
                    '51601': ExchangeError,
                    '51602': ExchangeError,
                    '51603': OrderNotFound,
                    '51732': AuthenticationError,
                    '51733': AuthenticationError,
                    '51734': AuthenticationError,
                    '51735': ExchangeError,
                    '51736': InsufficientFunds,
                    // Data class
                    '52000': ExchangeError,
                    // SPOT/MARGIN error codes 54000-54999
                    '54000': ExchangeError,
                    '54001': ExchangeError,
                    // FUNDING error codes 58000-58999
                    '58000': ExchangeError,
                    '58001': AuthenticationError,
                    '58002': PermissionDenied,
                    '58003': ExchangeError,
                    '58004': AccountSuspended,
                    '58005': ExchangeError,
                    '58006': ExchangeError,
                    '58007': ExchangeError,
                    '58100': ExchangeError,
                    '58101': AccountSuspended,
                    '58102': RateLimitExceeded,
                    '58103': ExchangeError,
                    '58104': ExchangeError,
                    '58105': ExchangeError,
                    '58106': ExchangeError,
                    '58107': ExchangeError,
                    '58108': ExchangeError,
                    '58109': ExchangeError,
                    '58110': ExchangeError,
                    '58111': ExchangeError,
                    '58112': ExchangeError,
                    '58114': ExchangeError,
                    '58115': ExchangeError,
                    '58116': ExchangeError,
                    '58117': ExchangeError,
                    '58125': BadRequest,
                    '58126': BadRequest,
                    '58127': BadRequest,
                    '58128': BadRequest,
                    '58200': ExchangeError,
                    '58201': ExchangeError,
                    '58202': ExchangeError,
                    '58203': InvalidAddress,
                    '58204': AccountSuspended,
                    '58205': ExchangeError,
                    '58206': ExchangeError,
                    '58207': InvalidAddress,
                    '58208': ExchangeError,
                    '58209': ExchangeError,
                    '58210': ExchangeError,
                    '58211': ExchangeError,
                    '58212': ExchangeError,
                    '58213': AuthenticationError,
                    '58221': BadRequest,
                    '58222': BadRequest,
                    '58224': BadRequest,
                    '58227': BadRequest,
                    '58228': BadRequest,
                    '58229': InsufficientFunds,
                    '58300': ExchangeError,
                    '58350': InsufficientFunds,
                    // Account error codes 59000-59999
                    '59000': ExchangeError,
                    '59001': ExchangeError,
                    '59100': ExchangeError,
                    '59101': ExchangeError,
                    '59102': ExchangeError,
                    '59103': InsufficientFunds,
                    '59104': ExchangeError,
                    '59105': ExchangeError,
                    '59106': ExchangeError,
                    '59107': ExchangeError,
                    '59108': InsufficientFunds,
                    '59109': ExchangeError,
                    '59128': InvalidOrder,
                    '59200': InsufficientFunds,
                    '59201': InsufficientFunds,
                    '59216': BadRequest,
                    '59300': ExchangeError,
                    '59301': ExchangeError,
                    '59313': ExchangeError,
                    '59401': ExchangeError,
                    '59500': ExchangeError,
                    '59501': ExchangeError,
                    '59502': ExchangeError,
                    '59503': ExchangeError,
                    '59504': ExchangeError,
                    '59505': ExchangeError,
                    '59506': ExchangeError,
                    '59507': ExchangeError,
                    '59508': AccountSuspended,
                    // WebSocket error Codes from 60000-63999
                    '60001': AuthenticationError,
                    '60002': AuthenticationError,
                    '60003': AuthenticationError,
                    '60004': AuthenticationError,
                    '60005': AuthenticationError,
                    '60006': InvalidNonce,
                    '60007': AuthenticationError,
                    '60008': AuthenticationError,
                    '60009': AuthenticationError,
                    '60010': AuthenticationError,
                    '60011': AuthenticationError,
                    '60012': BadRequest,
                    '60013': BadRequest,
                    '60014': RateLimitExceeded,
                    '60015': NetworkError,
                    '60016': ExchangeNotAvailable,
                    '60017': BadRequest,
                    '60018': BadRequest,
                    '60019': BadRequest,
                    '63999': ExchangeError,
                    '70010': BadRequest,
                    '70013': BadRequest,
                    '70016': BadRequest, // Please specify your instrument settings for at least one instType.
                },
                'broad': {
                    'Internal Server Error': ExchangeNotAvailable,
                    'server error': ExchangeNotAvailable, // {"code":500,"data":{},"detailMsg":"","error_code":"500","error_message":"server error 1236805249","msg":"server error 1236805249"}
                },
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'fetchOHLCV': {
                    'type': 'Candles', // Candles or HistoryCandles
                },
                'createMarketBuyOrderRequiresPrice': true,
                'fetchMarkets': ['spot'],
                'defaultType': 'spot',
                'accountsByType': {
                    'classic': '1',
                    'spot': '1',
                    'funding': '6',
                    'main': '6',
                    'unified': '18',
                },
                'accountsById': {
                    '1': 'spot',
                    '6': 'funding',
                    '18': 'unified',
                },
                'auth': {
                    'time': 'public',
                    'currencies': 'private',
                    'instruments': 'public',
                    'rate': 'public',
                    '{instrument_id}/constituents': 'public',
                },
                'warnOnFetchCurrenciesWithoutAuthorization': false,
                'defaultNetwork': 'ERC20',
                'networks': {
                    'ERC20': 'Ethereum',
                },
            },
            'commonCurrencies': {
                // OKEX refers to ERC20 version of Aeternity (AEToken)
                'AE': 'AET',
                'BOX': 'DefiBox',
                'HOT': 'Hydro Protocol',
                'HSR': 'HC',
                'MAG': 'Maggie',
                'SBTC': 'Super Bitcoin',
                'TRADE': 'Unitrade',
                'YOYO': 'YOYOW',
                'WIN': 'WinToken', // https://github.com/ccxt/ccxt/issues/5701
            },
        });
    }
    async fetchTime(params = {}) {
        /**
         * @method
         * @name okcoin#fetchTime
         * @description fetches the current integer timestamp in milliseconds from the exchange server
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {int} the current integer timestamp in milliseconds from the exchange server
         */
        const response = await this.publicGetPublicTime(params);
        //
        //     {
        //         "iso": "2015-01-07T23:47:25.201Z",
        //         "epoch": 1420674445.201
        //     }
        //
        return this.parse8601(this.safeString(response, 'iso'));
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name okcoin#fetchMarkets
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-public-data-get-instruments
         * @description retrieves data on all markets for okcoin
         * @param {object} [params] extra parameters specific to the exchange api endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const request = {
            'instType': 'SPOT',
        };
        const response = await this.publicGetPublicInstruments(this.extend(request, params));
        const markets = this.safeValue(response, 'data', []);
        return this.parseMarkets(markets);
    }
    parseMarket(market) {
        //
        // spot markets
        //
        //     {
        //         "base_currency": "EOS",
        //         "instrument_id": "EOS-OKB",
        //         "min_size": "0.01",
        //         "quote_currency": "OKB",
        //         "size_increment": "0.000001",
        //         "tick_size": "0.0001"
        //     }
        //
        const id = this.safeString(market, 'instId');
        let type = this.safeStringLower(market, 'instType');
        if (type === 'futures') {
            type = 'future';
        }
        const spot = (type === 'spot');
        const future = (type === 'future');
        const swap = (type === 'swap');
        const option = (type === 'option');
        const contract = swap || future || option;
        const baseId = this.safeString(market, 'baseCcy');
        const quoteId = this.safeString(market, 'quoteCcy');
        const base = this.safeCurrencyCode(baseId);
        const quote = this.safeCurrencyCode(quoteId);
        const symbol = base + '/' + quote;
        const tickSize = this.safeString(market, 'tickSz');
        const fees = this.safeValue2(this.fees, type, 'trading', {});
        let maxLeverage = this.safeString(market, 'lever', '1');
        maxLeverage = Precise.stringMax(maxLeverage, '1');
        const maxSpotCost = this.safeNumber(market, 'maxMktSz');
        return this.extend(fees, {
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': undefined,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': undefined,
            'type': type,
            'spot': spot,
            'margin': spot && (Precise.stringGt(maxLeverage, '1')),
            'swap': false,
            'future': false,
            'option': false,
            'active': true,
            'contract': false,
            'linear': undefined,
            'inverse': undefined,
            'contractSize': contract ? this.safeNumber(market, 'ctVal') : undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'created': this.safeInteger(market, 'listTime'),
            'precision': {
                'amount': this.safeNumber(market, 'lotSz'),
                'price': this.parseNumber(tickSize),
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber('1'),
                    'max': this.parseNumber(maxLeverage),
                },
                'amount': {
                    'min': this.safeNumber(market, 'minSz'),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': contract ? undefined : maxSpotCost,
                },
            },
            'info': market,
        });
    }
    safeNetwork(networkId) {
        const networksById = {
            'Bitcoin': 'BTC',
            'Omni': 'OMNI',
            'TRON': 'TRC20',
        };
        return this.safeString(networksById, networkId, networkId);
    }
    async fetchCurrencies(params = {}) {
        /**
         * @method
         * @name okcoin#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} an associative dictionary of currencies
         */
        if (!this.checkRequiredCredentials(false)) {
            if (this.options['warnOnFetchCurrenciesWithoutAuthorization']) {
                throw new ExchangeError(this.id + ' fetchCurrencies() is a private API endpoint that requires authentication with API keys. Set the API keys on the exchange instance or exchange.options["warnOnFetchCurrenciesWithoutAuthorization"] = false to suppress this warning message.');
            }
            return undefined;
        }
        else {
            const response = await this.privateGetAssetCurrencies(params);
            const data = this.safeValue(response, 'data', []);
            const result = {};
            const dataByCurrencyId = this.groupBy(data, 'ccy');
            const currencyIds = Object.keys(dataByCurrencyId);
            for (let i = 0; i < currencyIds.length; i++) {
                const currencyId = currencyIds[i];
                const currency = this.safeCurrency(currencyId);
                const code = currency['code'];
                const chains = dataByCurrencyId[currencyId];
                const networks = {};
                let currencyActive = false;
                let depositEnabled = false;
                let withdrawEnabled = false;
                let maxPrecision = undefined;
                for (let j = 0; j < chains.length; j++) {
                    const chain = chains[j];
                    const canDeposit = this.safeValue(chain, 'canDep');
                    depositEnabled = (canDeposit) ? canDeposit : depositEnabled;
                    const canWithdraw = this.safeValue(chain, 'canWd');
                    withdrawEnabled = (canWithdraw) ? canWithdraw : withdrawEnabled;
                    const canInternal = this.safeValue(chain, 'canInternal');
                    const active = (canDeposit && canWithdraw && canInternal) ? true : false;
                    currencyActive = (active) ? active : currencyActive;
                    const networkId = this.safeString(chain, 'chain');
                    if ((networkId !== undefined) && (networkId.indexOf('-') >= 0)) {
                        const parts = networkId.split('-');
                        const chainPart = this.safeString(parts, 1, networkId);
                        const networkCode = this.safeNetwork(chainPart);
                        const precision = this.parsePrecision(this.safeString(chain, 'wdTickSz'));
                        if (maxPrecision === undefined) {
                            maxPrecision = precision;
                        }
                        else {
                            maxPrecision = Precise.stringMin(maxPrecision, precision);
                        }
                        networks[networkCode] = {
                            'id': networkId,
                            'network': networkCode,
                            'active': active,
                            'deposit': canDeposit,
                            'withdraw': canWithdraw,
                            'fee': this.safeNumber(chain, 'minFee'),
                            'precision': this.parseNumber(precision),
                            'limits': {
                                'withdraw': {
                                    'min': this.safeNumber(chain, 'minWd'),
                                    'max': this.safeNumber(chain, 'maxWd'),
                                },
                            },
                            'info': chain,
                        };
                    }
                }
                const firstChain = this.safeValue(chains, 0);
                result[code] = {
                    'info': chains,
                    'code': code,
                    'id': currencyId,
                    'name': this.safeString(firstChain, 'name'),
                    'active': currencyActive,
                    'deposit': depositEnabled,
                    'withdraw': withdrawEnabled,
                    'fee': undefined,
                    'precision': this.parseNumber(maxPrecision),
                    'limits': {
                        'amount': {
                            'min': undefined,
                            'max': undefined,
                        },
                    },
                    'networks': networks,
                };
            }
            return result;
        }
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchOrderBook
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-order-book
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instId': market['id'],
        };
        limit = (limit === undefined) ? 20 : limit;
        if (limit !== undefined) {
            request['sz'] = limit; // max 400
        }
        const response = await this.publicGetMarketBooks(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "asks": [
        //                     ["0.07228","4.211619","0","2"], // price, amount, liquidated orders, total open orders
        //                     ["0.0723","299.880364","0","2"],
        //                     ["0.07231","3.72832","0","1"],
        //                 ],
        //                 "bids": [
        //                     ["0.07221","18.5","0","1"],
        //                     ["0.0722","18.5","0","1"],
        //                     ["0.07219","0.505407","0","1"],
        //                 ],
        //                 "ts": "1621438475342"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const first = this.safeValue(data, 0, {});
        const timestamp = this.safeInteger(first, 'ts');
        return this.parseOrderBook(first, symbol, timestamp);
    }
    parseTicker(ticker, market = undefined) {
        //
        //     {
        //         "instType": "SPOT",
        //         "instId": "ETH-BTC",
        //         "last": "0.07319",
        //         "lastSz": "0.044378",
        //         "askPx": "0.07322",
        //         "askSz": "4.2",
        //         "bidPx": "0.0732",
        //         "bidSz": "6.050058",
        //         "open24h": "0.07801",
        //         "high24h": "0.07975",
        //         "low24h": "0.06019",
        //         "volCcy24h": "11788.887619",
        //         "vol24h": "167493.829229",
        //         "ts": "1621440583784",
        //         "sodUtc0": "0.07872",
        //         "sodUtc8": "0.07345"
        //     }
        //
        const timestamp = this.safeInteger(ticker, 'ts');
        const marketId = this.safeString(ticker, 'instId');
        market = this.safeMarket(marketId, market, '-');
        const symbol = market['symbol'];
        const last = this.safeString(ticker, 'last');
        const open = this.safeString(ticker, 'open24h');
        const spot = this.safeValue(market, 'spot', false);
        const quoteVolume = spot ? this.safeString(ticker, 'volCcy24h') : undefined;
        const baseVolume = this.safeString(ticker, 'vol24h');
        const high = this.safeString(ticker, 'high24h');
        const low = this.safeString(ticker, 'low24h');
        return this.safeTicker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': high,
            'low': low,
            'bid': this.safeString(ticker, 'bidPx'),
            'bidVolume': this.safeString(ticker, 'bidSz'),
            'ask': this.safeString(ticker, 'askPx'),
            'askVolume': this.safeString(ticker, 'askSz'),
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name okcoin#fetchTicker
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-ticker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a [ticker structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#ticker-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instId': market['id'],
        };
        const response = await this.publicGetMarketTicker(this.extend(request, params));
        const data = this.safeValue(response, 'data', []);
        const first = this.safeValue(data, 0, {});
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "instType": "SPOT",
        //                 "instId": "ETH-BTC",
        //                 "last": "0.07319",
        //                 "lastSz": "0.044378",
        //                 "askPx": "0.07322",
        //                 "askSz": "4.2",
        //                 "bidPx": "0.0732",
        //                 "bidSz": "6.050058",
        //                 "open24h": "0.07801",
        //                 "high24h": "0.07975",
        //                 "low24h": "0.06019",
        //                 "volCcy24h": "11788.887619",
        //                 "vol24h": "167493.829229",
        //                 "ts": "1621440583784",
        //                 "sodUtc0": "0.07872",
        //                 "sodUtc8": "0.07345"
        //             }
        //         ]
        //     }
        //
        return this.parseTicker(first, market);
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchTickers
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-tickers
         * @description fetches price tickers for multiple markets, statistical calculations with the information calculated over the past 24 hours each market
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#ticker-structure}
         */
        symbols = this.marketSymbols(symbols);
        const request = {
            'instType': 'SPOT',
        };
        const response = await this.publicGetMarketTickers(this.extend(request, params));
        const data = this.safeValue(response, 'data', []);
        return this.parseTickers(data, symbols, params);
    }
    parseTrade(trade, market = undefined) {
        //
        // public fetchTrades
        //
        //     {
        //         "instId": "ETH-BTC",
        //         "side": "sell",
        //         "sz": "0.119501",
        //         "px": "0.07065",
        //         "tradeId": "15826757",
        //         "ts": "1621446178316"
        //     }
        //
        // private fetchMyTrades
        //
        //     {
        //         "side": "buy",
        //         "fillSz": "0.007533",
        //         "fillPx": "2654.98",
        //         "fee": "-0.000007533",
        //         "ordId": "317321390244397056",
        //         "instType": "SPOT",
        //         "instId": "ETH-USDT",
        //         "clOrdId": "",
        //         "posSide": "net",
        //         "billId": "317321390265368576",
        //         "tag": "0",
        //         "execType": "T",
        //         "tradeId": "107601752",
        //         "feeCcy": "ETH",
        //         "ts": "1621927314985"
        //     }
        //
        const id = this.safeString(trade, 'tradeId');
        const marketId = this.safeString(trade, 'instId');
        market = this.safeMarket(marketId, market, '-');
        const symbol = market['symbol'];
        const timestamp = this.safeInteger(trade, 'ts');
        const price = this.safeString2(trade, 'fillPx', 'px');
        const amount = this.safeString2(trade, 'fillSz', 'sz');
        const side = this.safeString(trade, 'side');
        const orderId = this.safeString(trade, 'ordId');
        const feeCostString = this.safeString(trade, 'fee');
        let fee = undefined;
        if (feeCostString !== undefined) {
            const feeCostSigned = Precise.stringNeg(feeCostString);
            const feeCurrencyId = this.safeString(trade, 'feeCcy');
            const feeCurrencyCode = this.safeCurrencyCode(feeCurrencyId);
            fee = {
                'cost': feeCostSigned,
                'currency': feeCurrencyCode,
            };
        }
        let takerOrMaker = this.safeString(trade, 'execType');
        if (takerOrMaker === 'T') {
            takerOrMaker = 'taker';
        }
        else if (takerOrMaker === 'M') {
            takerOrMaker = 'maker';
        }
        return this.safeTrade({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'id': id,
            'order': orderId,
            'type': undefined,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': fee,
        }, market);
    }
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchTrades
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-trades
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-trades-history
         * @description get the list of most recent trades for a particular symbol
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#public-trades}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        if ((limit === undefined) || (limit > 100)) {
            limit = 100; // maximum = default = 100
        }
        const request = {
            'instId': market['id'],
        };
        let method = undefined;
        [method, params] = this.handleOptionAndParams(params, 'fetchTrades', 'method', 'publicGetMarketTrades');
        let response = undefined;
        if (method === 'publicGetMarketTrades') {
            response = await this.publicGetMarketTrades(this.extend(request, params));
        }
        else {
            response = await this.publicGetMarketHistoryTrades(this.extend(request, params));
        }
        const data = this.safeValue(response, 'data', []);
        return this.parseTrades(data, market, since, limit);
    }
    parseOHLCV(ohlcv, market = undefined) {
        //
        //     [
        //         "1678928760000", // timestamp
        //         "24341.4", // open
        //         "24344", // high
        //         "24313.2", // low
        //         "24323", // close
        //         "628", // contract volume
        //         "2.5819", // base volume
        //         "62800", // quote volume
        //         "0" // candlestick state
        //     ]
        //
        return [
            this.safeInteger(ohlcv, 0),
            this.safeNumber(ohlcv, 1),
            this.safeNumber(ohlcv, 2),
            this.safeNumber(ohlcv, 3),
            this.safeNumber(ohlcv, 4),
            this.safeNumber(ohlcv, 5),
        ];
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchOHLCV
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-candlesticks
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-market-data-get-candlesticks-history
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const duration = this.parseTimeframe(timeframe);
        const options = this.safeValue(this.options, 'fetchOHLCV', {});
        let bar = this.safeString(this.timeframes, timeframe, timeframe);
        const timezone = this.safeString(options, 'timezone', 'UTC');
        if ((timezone === 'UTC') && (duration >= 21600)) { // if utc and timeframe >= 6h
            bar += timezone.toLowerCase();
        }
        const request = {
            'instId': market['id'],
            'bar': bar,
            'limit': limit,
        };
        let method = undefined;
        [method, params] = this.handleOptionAndParams(params, 'fetchOHLCV', 'method', 'publicGetMarketCandles');
        let response = undefined;
        if (method === 'publicGetMarketCandles') {
            response = await this.publicGetMarketCandles(this.extend(request, params));
        }
        else {
            response = await this.publicGetMarketHistoryCandles(this.extend(request, params));
        }
        const data = this.safeValue(response, 'data', []);
        return this.parseOHLCVs(data, market, timeframe, since, limit);
    }
    parseAccountBalance(response) {
        //
        // account
        //
        //     [
        //         {
        //             "balance":  0,
        //             "available":  0,
        //             "currency": "BTC",
        //             "hold":  0
        //         },
        //         {
        //             "balance":  0,
        //             "available":  0,
        //             "currency": "ETH",
        //             "hold":  0
        //         }
        //     ]
        //
        // spot
        //
        //     [
        //         {
        //             "frozen": "0",
        //             "hold": "0",
        //             "id": "2149632",
        //             "currency": "BTC",
        //             "balance": "0.0000000497717339",
        //             "available": "0.0000000497717339",
        //             "holds": "0"
        //         },
        //         {
        //             "frozen": "0",
        //             "hold": "0",
        //             "id": "2149632",
        //             "currency": "ICN",
        //             "balance": "0.00000000925",
        //             "available": "0.00000000925",
        //             "holds": "0"
        //         }
        //     ]
        //
        const result = {
            'info': response,
            'timestamp': undefined,
            'datetime': undefined,
        };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString(balance, 'currency');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['total'] = this.safeString(balance, 'balance');
            account['used'] = this.safeString(balance, 'hold');
            account['free'] = this.safeString(balance, 'available');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name okcoin#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a [balance structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#balance-structure}
         */
        await this.loadMarkets();
        const [marketType, query] = this.handleMarketTypeAndParams('fetchBalance', undefined, params);
        const request = {
        // 'ccy': 'BTC,ETH', // comma-separated list of currency ids
        };
        let response = undefined;
        if (marketType === 'funding') {
            response = await this.privateGetAssetBalances(this.extend(request, query));
        }
        else {
            response = await this.privateGetAccountBalance(this.extend(request, query));
        }
        //
        //  {
        //         "code": "0",
        //         "data": [
        //             {
        //                 "category": "1",
        //                 "delivery": "",
        //                 "exercise": "",
        //                 "instType": "SPOT",
        //                 "level": "Lv1",
        //                 "maker": "-0.0008",
        //                 "taker": "-0.001",
        //                 "ts": "1639043138472"
        //             }
        //         ],
        //         "msg": ""
        //     }
        //
        if (marketType === 'funding') {
            return this.parseFundingBalance(response);
        }
        else {
            return this.parseTradingBalance(response);
        }
    }
    parseTradingBalance(response) {
        const result = { 'info': response };
        const data = this.safeValue(response, 'data', []);
        const first = this.safeValue(data, 0, {});
        const timestamp = this.safeInteger(first, 'uTime');
        const details = this.safeValue(first, 'details', []);
        for (let i = 0; i < details.length; i++) {
            const balance = details[i];
            const currencyId = this.safeString(balance, 'ccy');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            // it may be incorrect to use total, free and used for swap accounts
            const eq = this.safeString(balance, 'eq');
            const availEq = this.safeString(balance, 'availEq');
            if ((eq === undefined) || (availEq === undefined)) {
                account['free'] = this.safeString(balance, 'availBal');
                account['used'] = this.safeString(balance, 'frozenBal');
            }
            else {
                account['total'] = eq;
                account['free'] = availEq;
            }
            result[code] = account;
        }
        result['timestamp'] = timestamp;
        result['datetime'] = this.iso8601(timestamp);
        return this.safeBalance(result);
    }
    parseFundingBalance(response) {
        const result = { 'info': response };
        const data = this.safeValue(response, 'data', []);
        for (let i = 0; i < data.length; i++) {
            const balance = data[i];
            const currencyId = this.safeString(balance, 'ccy');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            // it may be incorrect to use total, free and used for swap accounts
            account['total'] = this.safeString(balance, 'bal');
            account['free'] = this.safeString(balance, 'availBal');
            account['used'] = this.safeString(balance, 'frozenBal');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#createOrder
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-place-order
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-place-algo-order
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-place-multiple-orders
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-advance-algo-order
         * @description create a trade order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @param {bool} [params.reduceOnly] MARGIN orders only, or swap/future orders in net mode
         * @param {bool} [params.postOnly] true to place a post only order
         * @param {float} [params.triggerPrice] conditional orders only, the price at which the order is to be triggered
         * @param {object} [params.takeProfit] *takeProfit object in params* containing the triggerPrice at which the attached take profit order will be triggered (perpetual swap markets only)
         * @param {float} [params.takeProfit.triggerPrice] take profit trigger price
         * @param {float} [params.takeProfit.price] used for take profit limit orders, not used for take profit market price orders
         * @param {string} [params.takeProfit.type] 'market' or 'limit' used to specify the take profit price type
         * @param {object} [params.stopLoss] *stopLoss object in params* containing the triggerPrice at which the attached stop loss order will be triggered (perpetual swap markets only)
         * @param {float} [params.stopLoss.triggerPrice] stop loss trigger price
         * @param {float} [params.stopLoss.price] used for stop loss limit orders, not used for stop loss market price orders
         * @param {string} [params.stopLoss.type] 'market' or 'limit' used to specify the stop loss price type
         * @returns {object} an [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        let request = this.createOrderRequest(symbol, type, side, amount, price, params);
        let method = this.safeString(this.options, 'createOrder', 'privatePostTradeBatchOrders');
        const requestOrdType = this.safeString(request, 'ordType');
        if ((requestOrdType === 'trigger') || (requestOrdType === 'conditional') || (type === 'oco') || (type === 'move_order_stop') || (type === 'iceberg') || (type === 'twap')) {
            method = 'privatePostTradeOrderAlgo';
        }
        if ((method !== 'privatePostTradeOrder') && (method !== 'privatePostTradeOrderAlgo') && (method !== 'privatePostTradeBatchOrders')) {
            throw new ExchangeError(this.id + ' createOrder() this.options["createOrder"] must be either privatePostTradeBatchOrders or privatePostTradeOrder or privatePostTradeOrderAlgo');
        }
        if (method === 'privatePostTradeBatchOrders') {
            // keep the request body the same
            // submit a single order in an array to the batch order endpoint
            // because it has a lower ratelimit
            request = [request];
        }
        const response = await this[method](request);
        const data = this.safeValue(response, 'data', []);
        const first = this.safeValue(data, 0);
        const order = this.parseOrder(first, market);
        order['type'] = type;
        order['side'] = side;
        return order;
    }
    createOrderRequest(symbol, type, side, amount, price = undefined, params = {}) {
        const market = this.market(symbol);
        const request = {
            'instId': market['id'],
            // 'ccy': currency['id'], // only applicable to cross MARGIN orders in single-currency margin
            // 'clOrdId': clientOrderId, // up to 32 characters, must be unique
            // 'tag': tag, // up to 8 characters
            'side': side,
            // 'posSide': 'long', // long, short, // required in the long/short mode, and can only be long or short (only for future or swap)
            'ordType': type,
            // 'ordType': type, // privatePostTradeOrder: market, limit, post_only, fok, ioc, optimal_limit_ioc
            // 'ordType': type, // privatePostTradeOrderAlgo: conditional, oco, trigger, move_order_stop, iceberg, twap
            'sz': this.amountToPrecision(symbol, amount),
            // 'px': this.priceToPrecision (symbol, price), // limit orders only
            // 'reduceOnly': false,
            //
            // 'triggerPx': 10, // stopPrice (trigger orders)
            // 'orderPx': 10, // Order price if -1, the order will be executed at the market price. (trigger orders)
            // 'triggerPxType': 'last', // Conditional default is last, mark or index (trigger orders)
            //
            // 'tpTriggerPx': 10, // takeProfitPrice (conditional orders)
            // 'tpTriggerPxType': 'last', // Conditional default is last, mark or index (conditional orders)
            // 'tpOrdPx': 10, // Order price for Take-Profit orders, if -1 will be executed at market price (conditional orders)
            //
            // 'slTriggerPx': 10, // stopLossPrice (conditional orders)
            // 'slTriggerPxType': 'last', // Conditional default is last, mark or index (conditional orders)
            // 'slOrdPx': 10, // Order price for Stop-Loss orders, if -1 will be executed at market price (conditional orders)
        };
        const triggerPrice = this.safeValueN(params, ['triggerPrice', 'stopPrice', 'triggerPx']);
        const timeInForce = this.safeString(params, 'timeInForce', 'GTC');
        const takeProfitPrice = this.safeValue2(params, 'takeProfitPrice', 'tpTriggerPx');
        const tpOrdPx = this.safeValue(params, 'tpOrdPx', price);
        const tpTriggerPxType = this.safeString(params, 'tpTriggerPxType', 'last');
        const stopLossPrice = this.safeValue2(params, 'stopLossPrice', 'slTriggerPx');
        const slOrdPx = this.safeValue(params, 'slOrdPx', price);
        const slTriggerPxType = this.safeString(params, 'slTriggerPxType', 'last');
        const clientOrderId = this.safeString2(params, 'clOrdId', 'clientOrderId');
        const stopLoss = this.safeValue(params, 'stopLoss');
        const stopLossDefined = (stopLoss !== undefined);
        const takeProfit = this.safeValue(params, 'takeProfit');
        const takeProfitDefined = (takeProfit !== undefined);
        const defaultMarginMode = this.safeString2(this.options, 'defaultMarginMode', 'marginMode', 'cross');
        let marginMode = this.safeString2(params, 'marginMode', 'tdMode'); // cross or isolated, tdMode not ommited so as to be extended into the request
        let margin = false;
        if ((marginMode !== undefined) && (marginMode !== 'cash')) {
            margin = true;
        }
        else {
            marginMode = defaultMarginMode;
            margin = this.safeValue(params, 'margin', false);
        }
        if (margin) {
            const defaultCurrency = (side === 'buy') ? market['quote'] : market['base'];
            const currency = this.safeString(params, 'ccy', defaultCurrency);
            request['ccy'] = this.safeCurrencyCode(currency);
        }
        const tradeMode = margin ? marginMode : 'cash';
        request['tdMode'] = tradeMode;
        const isMarketOrder = type === 'market';
        let postOnly = false;
        [postOnly, params] = this.handlePostOnly(isMarketOrder, type === 'post_only', params);
        params = this.omit(params, ['currency', 'ccy', 'marginMode', 'timeInForce', 'stopPrice', 'triggerPrice', 'clientOrderId', 'stopLossPrice', 'takeProfitPrice', 'slOrdPx', 'tpOrdPx', 'margin', 'stopLoss', 'takeProfit']);
        const ioc = (timeInForce === 'IOC') || (type === 'ioc');
        const fok = (timeInForce === 'FOK') || (type === 'fok');
        const trigger = (triggerPrice !== undefined) || (type === 'trigger');
        const conditional = (stopLossPrice !== undefined) || (takeProfitPrice !== undefined) || (type === 'conditional');
        const marketIOC = (isMarketOrder && ioc) || (type === 'optimal_limit_ioc');
        const defaultTgtCcy = this.safeString(this.options, 'tgtCcy', 'base_ccy');
        const tgtCcy = this.safeString(params, 'tgtCcy', defaultTgtCcy);
        if ((!margin)) {
            request['tgtCcy'] = tgtCcy;
        }
        if (isMarketOrder || marketIOC) {
            request['ordType'] = 'market';
            if ((side === 'buy')) {
                // spot market buy: "sz" can refer either to base currency units or to quote currency units
                // see documentation: https://www.okx.com/docs-v5/en/#rest-api-trade-place-order
                if (tgtCcy === 'quote_ccy') {
                    // quote_ccy: sz refers to units of quote currency
                    let notional = this.safeNumber2(params, 'cost', 'sz');
                    const createMarketBuyOrderRequiresPrice = this.safeValue(this.options, 'createMarketBuyOrderRequiresPrice', true);
                    if (createMarketBuyOrderRequiresPrice) {
                        if (price !== undefined) {
                            if (notional === undefined) {
                                const amountString = this.numberToString(amount);
                                const priceString = this.numberToString(price);
                                const quoteAmount = Precise.stringMul(amountString, priceString);
                                notional = this.parseNumber(quoteAmount);
                            }
                        }
                        else if (notional === undefined) {
                            throw new InvalidOrder(this.id + " createOrder() requires the price argument with market buy orders to calculate total order cost (amount to spend), where cost = amount * price. Supply a price argument to createOrder() call if you want the cost to be calculated for you from price and amount, or, alternatively, add .options['createMarketBuyOrderRequiresPrice'] = false and supply the total cost value in the 'amount' argument or in the 'cost' unified extra parameter or in exchange-specific 'sz' extra parameter (the exchange-specific behaviour)");
                        }
                    }
                    else {
                        notional = (notional === undefined) ? amount : notional;
                    }
                    request['sz'] = this.costToPrecision(symbol, notional);
                    params = this.omit(params, ['cost', 'sz']);
                }
            }
        }
        else {
            if ((!trigger) && (!conditional)) {
                request['px'] = this.priceToPrecision(symbol, price);
            }
        }
        if (postOnly) {
            request['ordType'] = 'post_only';
        }
        else if (ioc && !marketIOC) {
            request['ordType'] = 'ioc';
        }
        else if (fok) {
            request['ordType'] = 'fok';
        }
        else if (stopLossDefined || takeProfitDefined) {
            if (stopLossDefined) {
                const stopLossTriggerPrice = this.safeValueN(stopLoss, ['triggerPrice', 'stopPrice', 'slTriggerPx']);
                if (stopLossTriggerPrice === undefined) {
                    throw new InvalidOrder(this.id + ' createOrder() requires a trigger price in params["stopLoss"]["triggerPrice"], or params["stopLoss"]["stopPrice"], or params["stopLoss"]["slTriggerPx"] for a stop loss order');
                }
                request['slTriggerPx'] = this.priceToPrecision(symbol, stopLossTriggerPrice);
                const stopLossLimitPrice = this.safeValueN(stopLoss, ['price', 'stopLossPrice', 'slOrdPx']);
                const stopLossOrderType = this.safeString(stopLoss, 'type');
                if (stopLossOrderType !== undefined) {
                    const stopLossLimitOrderType = (stopLossOrderType === 'limit');
                    const stopLossMarketOrderType = (stopLossOrderType === 'market');
                    if ((!stopLossLimitOrderType) && (!stopLossMarketOrderType)) {
                        throw new InvalidOrder(this.id + ' createOrder() params["stopLoss"]["type"] must be either "limit" or "market"');
                    }
                    else if (stopLossLimitOrderType) {
                        if (stopLossLimitPrice === undefined) {
                            throw new InvalidOrder(this.id + ' createOrder() requires a limit price in params["stopLoss"]["price"] or params["stopLoss"]["slOrdPx"] for a stop loss limit order');
                        }
                        else {
                            request['slOrdPx'] = this.priceToPrecision(symbol, stopLossLimitPrice);
                        }
                    }
                    else if (stopLossOrderType === 'market') {
                        request['slOrdPx'] = '-1';
                    }
                }
                else if (stopLossLimitPrice !== undefined) {
                    request['slOrdPx'] = this.priceToPrecision(symbol, stopLossLimitPrice); // limit sl order
                }
                else {
                    request['slOrdPx'] = '-1'; // market sl order
                }
                const stopLossTriggerPriceType = this.safeString2(stopLoss, 'triggerPriceType', 'slTriggerPxType', 'last');
                if (stopLossTriggerPriceType !== undefined) {
                    if ((stopLossTriggerPriceType !== 'last') && (stopLossTriggerPriceType !== 'index') && (stopLossTriggerPriceType !== 'mark')) {
                        throw new InvalidOrder(this.id + ' createOrder() stop loss trigger price type must be one of "last", "index" or "mark"');
                    }
                    request['slTriggerPxType'] = stopLossTriggerPriceType;
                }
            }
            if (takeProfitDefined) {
                const takeProfitTriggerPrice = this.safeValueN(takeProfit, ['triggerPrice', 'stopPrice', 'tpTriggerPx']);
                if (takeProfitTriggerPrice === undefined) {
                    throw new InvalidOrder(this.id + ' createOrder() requires a trigger price in params["takeProfit"]["triggerPrice"], or params["takeProfit"]["stopPrice"], or params["takeProfit"]["tpTriggerPx"] for a take profit order');
                }
                request['tpTriggerPx'] = this.priceToPrecision(symbol, takeProfitTriggerPrice);
                const takeProfitLimitPrice = this.safeValueN(takeProfit, ['price', 'takeProfitPrice', 'tpOrdPx']);
                const takeProfitOrderType = this.safeString(takeProfit, 'type');
                if (takeProfitOrderType !== undefined) {
                    const takeProfitLimitOrderType = (takeProfitOrderType === 'limit');
                    const takeProfitMarketOrderType = (takeProfitOrderType === 'market');
                    if ((!takeProfitLimitOrderType) && (!takeProfitMarketOrderType)) {
                        throw new InvalidOrder(this.id + ' createOrder() params["takeProfit"]["type"] must be either "limit" or "market"');
                    }
                    else if (takeProfitLimitOrderType) {
                        if (takeProfitLimitPrice === undefined) {
                            throw new InvalidOrder(this.id + ' createOrder() requires a limit price in params["takeProfit"]["price"] or params["takeProfit"]["tpOrdPx"] for a take profit limit order');
                        }
                        else {
                            request['tpOrdPx'] = this.priceToPrecision(symbol, takeProfitLimitPrice);
                        }
                    }
                    else if (takeProfitOrderType === 'market') {
                        request['tpOrdPx'] = '-1';
                    }
                }
                else if (takeProfitLimitPrice !== undefined) {
                    request['tpOrdPx'] = this.priceToPrecision(symbol, takeProfitLimitPrice); // limit tp order
                }
                else {
                    request['tpOrdPx'] = '-1'; // market tp order
                }
                const takeProfitTriggerPriceType = this.safeString2(takeProfit, 'triggerPriceType', 'tpTriggerPxType', 'last');
                if (takeProfitTriggerPriceType !== undefined) {
                    if ((takeProfitTriggerPriceType !== 'last') && (takeProfitTriggerPriceType !== 'index') && (takeProfitTriggerPriceType !== 'mark')) {
                        throw new InvalidOrder(this.id + ' createOrder() take profit trigger price type must be one of "last", "index" or "mark"');
                    }
                    request['tpTriggerPxType'] = takeProfitTriggerPriceType;
                }
            }
        }
        else if (trigger) {
            request['ordType'] = 'trigger';
            request['triggerPx'] = this.priceToPrecision(symbol, triggerPrice);
            request['orderPx'] = isMarketOrder ? '-1' : this.priceToPrecision(symbol, price);
        }
        else if (conditional) {
            request['ordType'] = 'conditional';
            const twoWayCondition = ((takeProfitPrice !== undefined) && (stopLossPrice !== undefined));
            // if TP and SL are sent together
            // as ordType 'conditional' only stop-loss order will be applied
            if (twoWayCondition) {
                request['ordType'] = 'oco';
            }
            if (takeProfitPrice !== undefined) {
                request['tpTriggerPx'] = this.priceToPrecision(symbol, takeProfitPrice);
                request['tpOrdPx'] = (tpOrdPx === undefined) ? '-1' : this.priceToPrecision(symbol, tpOrdPx);
                request['tpTriggerPxType'] = tpTriggerPxType;
            }
            if (stopLossPrice !== undefined) {
                request['slTriggerPx'] = this.priceToPrecision(symbol, stopLossPrice);
                request['slOrdPx'] = (slOrdPx === undefined) ? '-1' : this.priceToPrecision(symbol, slOrdPx);
                request['slTriggerPxType'] = slTriggerPxType;
            }
        }
        if (clientOrderId === undefined) {
            const brokerId = this.safeString(this.options, 'brokerId');
            if (brokerId !== undefined) {
                request['clOrdId'] = brokerId + this.uuid16();
                request['tag'] = brokerId;
            }
        }
        else {
            request['clOrdId'] = clientOrderId;
            params = this.omit(params, ['clOrdId', 'clientOrderId']);
        }
        return this.extend(request, params);
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#cancelOrder
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-order
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-algo-order
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-advance-algo-order
         * @description cancels an open order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @param {bool} [params.stop] True if cancel trigger or conditional orders
         * @param {bool} [params.advanced] True if canceling advanced orders only
         * @returns {object} An [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        this.checkRequiredSymbol('cancelOrder', symbol);
        await this.loadMarkets();
        const stop = this.safeValue2(params, 'stop', 'trigger');
        const advanced = this.safeValue(params, 'advanced');
        if (stop || advanced) {
            const orderInner = await this.cancelOrders([id], symbol, params);
            return this.safeValue(orderInner, 0);
        }
        const market = this.market(symbol);
        const request = {
            'instId': market['id'],
            // 'ordId': id, // either ordId or clOrdId is required
            // 'clOrdId': clientOrderId,
        };
        const clientOrderId = this.safeString2(params, 'clOrdId', 'clientOrderId');
        if (clientOrderId !== undefined) {
            request['clOrdId'] = clientOrderId;
        }
        else {
            request['ordId'] = id.toString();
        }
        const query = this.omit(params, ['clOrdId', 'clientOrderId']);
        const response = await this.privatePostTradeCancelOrder(this.extend(request, query));
        // {"code":"0","data":[{"clOrdId":"","ordId":"317251910906576896","sCode":"0","sMsg":""}],"msg":""}
        const data = this.safeValue(response, 'data', []);
        const order = this.safeValue(data, 0);
        return this.parseOrder(order, market);
    }
    parseIds(ids) {
        /**
         * @ignore
         * @method
         * @name okx#parseIds
         * @param {string[]|string} ids order ids
         * @returns {string[]} list of order ids
         */
        if (typeof ids === 'string') {
            return ids.split(',');
        }
        else {
            return ids;
        }
    }
    async cancelOrders(ids, symbol = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#cancelOrders
         * @description cancel multiple orders
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-multiple-orders
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-algo-order
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-cancel-advance-algo-order
         * @param {string[]} ids order ids
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the okx api endpoint
         * @returns {object} an list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        this.checkRequiredSymbol('cancelOrders', symbol);
        await this.loadMarkets();
        const stop = this.safeValue2(params, 'stop', 'trigger');
        const advanced = this.safeValue(params, 'advanced');
        params = this.omit(params, ['stop', 'trigger', 'advanced']);
        const market = this.market(symbol);
        const request = [];
        const clientOrderIds = this.parseIds(this.safeValue2(params, 'clOrdId', 'clientOrderId'));
        const algoIds = this.parseIds(this.safeValue(params, 'algoId'));
        if (clientOrderIds === undefined) {
            ids = this.parseIds(ids);
            if (algoIds !== undefined) {
                for (let i = 0; i < algoIds.length; i++) {
                    request.push({
                        'algoId': algoIds[i],
                        'instId': market['id'],
                    });
                }
            }
            for (let i = 0; i < ids.length; i++) {
                if (stop || advanced) {
                    request.push({
                        'algoId': ids[i],
                        'instId': market['id'],
                    });
                }
                else {
                    request.push({
                        'ordId': ids[i],
                        'instId': market['id'],
                    });
                }
            }
        }
        else {
            for (let i = 0; i < clientOrderIds.length; i++) {
                request.push({
                    'instId': market['id'],
                    'clOrdId': clientOrderIds[i],
                });
            }
        }
        let response = undefined;
        if (stop) {
            response = await this.privatePostTradeCancelAlgos(request);
        }
        else if (advanced) {
            response = await this.privatePostTradeCancelAdvanceAlgos(request);
        }
        else {
            response = await this.privatePostTradeCancelBatchOrders(request); // * dont extend with params, otherwise ARRAY will be turned into OBJECT
        }
        //
        //     {
        //         "code": "0",
        //         "data": [
        //             {
        //                 "clOrdId": "e123456789ec4dBC1123456ba123b45e",
        //                 "ordId": "405071912345641543",
        //                 "sCode": "0",
        //                 "sMsg": ""
        //             },
        //             ...
        //         ],
        //         "msg": ""
        //     }
        //
        //
        const ordersData = this.safeValue(response, 'data', []);
        return this.parseOrders(ordersData, market, undefined, undefined, params);
    }
    parseOrderStatus(status) {
        const statuses = {
            'canceled': 'canceled',
            'live': 'open',
            'partially_filled': 'open',
            'filled': 'closed',
            'effective': 'closed',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrder(order, market = undefined) {
        //
        // createOrder
        //
        //     {
        //         "clOrdId": "oktswap6",
        //         "ordId": "312269865356374016",
        //         "tag": "",
        //         "sCode": "0",
        //         "sMsg": ""
        //     }
        //
        // editOrder
        //
        //     {
        //         "clOrdId": "e847386590ce4dBCc1a045253497a547",
        //         "ordId": "559176536793178112",
        //         "reqId": "",
        //         "sCode": "0",
        //         "sMsg": ""
        //     }
        //
        // Spot and Swap fetchOrder, fetchOpenOrders
        //
        //     {
        //         "accFillSz": "0",
        //         "avgPx": "",
        //         "cTime": "1621910749815",
        //         "category": "normal",
        //         "ccy": "",
        //         "clOrdId": "",
        //         "fee": "0",
        //         "feeCcy": "ETH",
        //         "fillPx": "",
        //         "fillSz": "0",
        //         "fillTime": "",
        //         "instId": "ETH-USDT",
        //         "instType": "SPOT",
        //         "lever": "",
        //         "ordId": "317251910906576896",
        //         "ordType": "limit",
        //         "pnl": "0",
        //         "posSide": "net",
        //         "px": "2000",
        //         "rebate": "0",
        //         "rebateCcy": "USDT",
        //         "side": "buy",
        //         "slOrdPx": "",
        //         "slTriggerPx": "",
        //         "state": "live",
        //         "sz": "0.001",
        //         "tag": "",
        //         "tdMode": "cash",
        //         "tpOrdPx": "",
        //         "tpTriggerPx": "",
        //         "tradeId": "",
        //         "uTime": "1621910749815"
        //     }
        //
        // Algo Order fetchOpenOrders, fetchCanceledOrders, fetchClosedOrders
        //
        //     {
        //         "activePx": "",
        //         "activePxType": "",
        //         "actualPx": "",
        //         "actualSide": "buy",
        //         "actualSz": "0",
        //         "algoId": "431375349042380800",
        //         "cTime": "1649119897778",
        //         "callbackRatio": "",
        //         "callbackSpread": "",
        //         "ccy": "",
        //         "ctVal": "0.01",
        //         "instId": "BTC-USDT-SWAP",
        //         "instType": "SWAP",
        //         "last": "46538.9",
        //         "lever": "125",
        //         "moveTriggerPx": "",
        //         "notionalUsd": "467.059",
        //         "ordId": "",
        //         "ordPx": "50000",
        //         "ordType": "trigger",
        //         "posSide": "long",
        //         "pxLimit": "",
        //         "pxSpread": "",
        //         "pxVar": "",
        //         "side": "buy",
        //         "slOrdPx": "",
        //         "slTriggerPx": "",
        //         "slTriggerPxType": "",
        //         "state": "live",
        //         "sz": "1",
        //         "szLimit": "",
        //         "tag": "",
        //         "tdMode": "isolated",
        //         "tgtCcy": "",
        //         "timeInterval": "",
        //         "tpOrdPx": "",
        //         "tpTriggerPx": "",
        //         "tpTriggerPxType": "",
        //         "triggerPx": "50000",
        //         "triggerPxType": "last",
        //         "triggerTime": "",
        //         "uly": "BTC-USDT"
        //     }
        //
        const id = this.safeString2(order, 'algoId', 'ordId');
        const timestamp = this.safeInteger(order, 'cTime');
        const lastUpdateTimestamp = this.safeInteger(order, 'uTime');
        const lastTradeTimestamp = this.safeInteger(order, 'fillTime');
        const side = this.safeString(order, 'side');
        let type = this.safeString(order, 'ordType');
        let postOnly = undefined;
        let timeInForce = undefined;
        if (type === 'post_only') {
            postOnly = true;
            type = 'limit';
        }
        else if (type === 'fok') {
            timeInForce = 'FOK';
            type = 'limit';
        }
        else if (type === 'ioc') {
            timeInForce = 'IOC';
            type = 'limit';
        }
        const marketId = this.safeString(order, 'instId');
        market = this.safeMarket(marketId, market);
        const symbol = this.safeSymbol(marketId, market, '-');
        const filled = this.safeString(order, 'accFillSz');
        const price = this.safeString2(order, 'px', 'ordPx');
        const average = this.safeString(order, 'avgPx');
        const status = this.parseOrderStatus(this.safeString(order, 'state'));
        const feeCostString = this.safeString(order, 'fee');
        let amount = undefined;
        let cost = undefined;
        // spot market buy: "sz" can refer either to base currency units or to quote currency units
        // see documentation: https://www.okx.com/docs-v5/en/#rest-api-trade-place-order
        const defaultTgtCcy = this.safeString(this.options, 'tgtCcy', 'base_ccy');
        const tgtCcy = this.safeString(order, 'tgtCcy', defaultTgtCcy);
        if ((side === 'buy') && (type === 'market') && (tgtCcy === 'quote_ccy')) {
            // "sz" refers to the cost
            cost = this.safeString(order, 'sz');
        }
        else {
            // "sz" refers to the trade currency amount
            amount = this.safeString(order, 'sz');
        }
        let fee = undefined;
        if (feeCostString !== undefined) {
            const feeCostSigned = Precise.stringNeg(feeCostString);
            const feeCurrencyId = this.safeString(order, 'feeCcy');
            const feeCurrencyCode = this.safeCurrencyCode(feeCurrencyId);
            fee = {
                'cost': this.parseNumber(feeCostSigned),
                'currency': feeCurrencyCode,
            };
        }
        let clientOrderId = this.safeString(order, 'clOrdId');
        if ((clientOrderId !== undefined) && (clientOrderId.length < 1)) {
            clientOrderId = undefined; // fix empty clientOrderId string
        }
        const stopLossPrice = this.safeNumber2(order, 'slTriggerPx', 'slOrdPx');
        const takeProfitPrice = this.safeNumber2(order, 'tpTriggerPx', 'tpOrdPx');
        const stopPrice = this.safeNumberN(order, ['triggerPx', 'moveTriggerPx']);
        const reduceOnlyRaw = this.safeString(order, 'reduceOnly');
        let reduceOnly = false;
        if (reduceOnly !== undefined) {
            reduceOnly = (reduceOnlyRaw === 'true');
        }
        return this.safeOrder({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'lastUpdateTimestamp': lastUpdateTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'side': side,
            'price': price,
            'stopLossPrice': stopLossPrice,
            'takeProfitPrice': takeProfitPrice,
            'stopPrice': stopPrice,
            'triggerPrice': stopPrice,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': undefined,
            'reduceOnly': reduceOnly,
        }, market);
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchOrder
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-order-details
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-algo-order-list
         * @description fetches information on an order made by the user
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} An [order structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instId': market['id'],
            // 'clOrdId': 'abcdef12345', // optional, [a-z0-9]{1,32}
            // 'ordId': id,
        };
        const clientOrderId = this.safeString2(params, 'clOrdId', 'clientOrderId');
        const stop = this.safeValue(params, 'stop');
        if (stop) {
            if (clientOrderId !== undefined) {
                request['algoClOrdId'] = clientOrderId;
            }
            else {
                request['algoId'] = id;
            }
        }
        else {
            this.checkRequiredSymbol('fetchOrder', symbol);
            if (clientOrderId !== undefined) {
                request['clOrdId'] = clientOrderId;
            }
            else {
                request['ordId'] = id;
            }
        }
        const query = this.omit(params, ['clientOrderId', 'stop']);
        let response = undefined;
        if (stop) {
            response = await this.privateGetTradeOrderAlgo(this.extend(request, query));
        }
        else {
            response = await this.privateGetTradeOrder(this.extend(request, query));
        }
        const data = this.safeValue(response, 'data', []);
        const order = this.safeValue(data, 0);
        return this.parseOrder(order);
    }
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchOpenOrders
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-order-list
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-algo-order-list
         * @description fetch all unfilled currently open orders
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch open orders for
         * @param {int} [limit] the maximum number of  open orders structures to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @param {bool} [params.stop] True if fetching trigger or conditional orders
         * @param {string} [params.ordType] "conditional", "oco", "trigger", "move_order_stop", "iceberg", or "twap"
         * @returns {Order[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets();
        const request = {
        // 'instId': market['id'],
        // 'ordType': 'limit', // market, limit, post_only, fok, ioc, comma-separated, stop orders: conditional, oco, trigger, move_order_stop, iceberg, or twap
        // 'state': 'live', // live, partially_filled
        // 'after': orderId,
        // 'before': orderId,
        // 'limit': limit, // default 100, max 100
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instId'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        const ordType = this.safeString(params, 'ordType');
        const stop = this.safeValue(params, 'stop') || (this.safeString(params, 'ordType') !== undefined);
        if (stop && (ordType === undefined)) {
            request['ordType'] = 'trigger'; // default to trigger
        }
        params = this.omit(params, ['stop']);
        let response = undefined;
        if (stop) {
            response = await this.privateGetTradeOrdersAlgoPending(this.extend(request, params));
        }
        else {
            response = await this.privateGetTradeOrdersPending(this.extend(request, params));
        }
        const data = this.safeValue(response, 'data', []);
        return this.parseOrders(data, market, since, limit);
    }
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchClosedOrders
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-algo-order-history
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-order-history-last-3-months
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-order-history-last-7-days
         * @description fetches information on multiple closed orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of  orde structures to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @param {bool} [params.stop] True if fetching trigger or conditional orders
         * @param {string} [params.ordType] "conditional", "oco", "trigger", "move_order_stop", "iceberg", or "twap"
         * @returns {Order[]} a list of [order structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#order-structure}
         */
        await this.loadMarkets();
        const request = {
            'instType': 'SPOT',
        };
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instId'] = market['id'];
        }
        const ordType = this.safeString(params, 'ordType');
        const stop = this.safeValue(params, 'stop') || (this.safeString(params, 'ordType') !== undefined);
        if (stop && (ordType === undefined)) {
            request['ordType'] = 'trigger'; // default to trigger
        }
        params = this.omit(params, ['stop']);
        let response = undefined;
        if (stop) {
            response = await this.privateGetTradeOrdersAlgoHistory(this.extend(request, params));
        }
        else {
            let method = undefined;
            [method, params] = this.handleOptionAndParams(params, 'fetchClosedOrders', 'method', 'privateGetTradeOrdersHistory');
            if (method === 'privateGetTradeOrdersHistory') {
                response = await this.privateGetTradeOrdersHistory(this.extend(request, params));
            }
            else {
                response = await this.privateGetTradeOrdersHistoryArchive(this.extend(request, params));
            }
        }
        //     {
        //         "code": "0",
        //         "data": [
        //             {
        //                 "accFillSz": "0",
        //                 "avgPx": "",
        //                 "cTime": "1621910749815",
        //                 "category": "normal",
        //                 "ccy": "",
        //                 "clOrdId": "",
        //                 "fee": "0",
        //                 "feeCcy": "ETH",
        //                 "fillPx": "",
        //                 "fillSz": "0",
        //                 "fillTime": "",
        //                 "instId": "ETH-USDT",
        //                 "instType": "SPOT",
        //                 "lever": "",
        //                 "ordId": "317251910906576896",
        //                 "ordType": "limit",
        //                 "pnl": "0",
        //                 "posSide": "net",
        //                 "px":"20 00",
        //                 "rebate": "0",
        //                 "rebateCcy": "USDT",
        //                 "side": "buy",
        //                 "slOrdPx": "",
        //                 "slTriggerPx": "",
        //                 "state": "live",
        //                 "sz":"0. 001",
        //                 "tag": "",
        //                 "tdMode": "cash",
        //                 "tpOrdPx": "",
        //                 "tpTriggerPx": "",
        //                 "tradeId": "",
        //                 "uTime": "1621910749815"
        //             }
        //         ],
        //         "msg":""
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseOrders(data, market, since, limit);
    }
    parseDepositAddress(depositAddress, currency = undefined) {
        //
        //     {
        //         "addr": "okbtothemoon",
        //         "memo": "971668", // may be missing
        //         "tag":"52055", // may be missing
        //         "pmtId": "", // may be missing
        //         "ccy": "BTC",
        //         "to": "6", // 1 SPOT, 3 FUTURES, 6 FUNDING, 9 SWAP, 12 OPTION, 18 Unified account
        //         "selected": true
        //     }
        //
        //     {
        //         "ccy":"usdt-erc20",
        //         "to":"6",
        //         "addr":"0x696abb81974a8793352cbd33aadcf78eda3cfdfa",
        //         "selected":true
        //     }
        //
        //     {
        //        "chain": "ETH-OKExChain",
        //        "addrEx": { "comment": "6040348" }, // some currencies like TON may have this field,
        //        "ctAddr": "72315c",
        //        "ccy": "ETH",
        //        "to": "6",
        //        "addr": "0x1c9f2244d1ccaa060bd536827c18925db10db102",
        //        "selected": true
        //     }
        //
        const address = this.safeString(depositAddress, 'addr');
        let tag = this.safeStringN(depositAddress, ['tag', 'pmtId', 'memo']);
        if (tag === undefined) {
            const addrEx = this.safeValue(depositAddress, 'addrEx', {});
            tag = this.safeString(addrEx, 'comment');
        }
        const currencyId = this.safeString(depositAddress, 'ccy');
        currency = this.safeCurrency(currencyId, currency);
        const code = currency['code'];
        const chain = this.safeString(depositAddress, 'chain');
        const networkId = chain.replace(currencyId + '-', '');
        const network = this.networkIdToCode(networkId);
        // inconsistent naming responses from exchange
        // with respect to network naming provided in currency info vs address chain-names and ids
        //
        // response from address endpoint:
        //      {
        //          "chain": "USDT-Polygon",
        //          "ctAddr": "",
        //          "ccy": "USDT",
        //          "to":"6" ,
        //          "addr": "0x1903441e386cc49d937f6302955b5feb4286dcfa",
        //          "selected": true
        //      }
        // network information from currency['networks'] field:
        // Polygon: {
        //        "info": {
        //            "canDep": false,
        //            "canInternal": false,
        //            "canWd": false,
        //            "ccy": "USDT",
        //            "chain": "USDT-Polygon-Bridge",
        //            "mainNet": false,
        //            "maxFee": "26.879528",
        //            "minFee": "13.439764",
        //            "minWd": "0.001",
        //            "name": ''
        //        },
        //        "id": "USDT-Polygon-Bridge",
        //        "network": "Polygon",
        //        "active": false,
        //        "deposit": false,
        //        "withdraw": false,
        //        "fee": 13.439764,
        //        "precision": undefined,
        //        "limits": {
        //            "withdraw": {
        //                "min": 0.001,
        //                "max": undefined
        //            }
        //        }
        //     },
        //
        this.checkAddress(address);
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'network': network,
            'info': depositAddress,
        };
    }
    async fetchDepositAddress(code, params = {}) {
        /**
         * @method
         * @name okx#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @see https://www.okx.com/docs-v5/en/#funding-account-rest-api-get-deposit-address
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the okx api endpoint
         * @returns {object} an [address structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#address-structure}
         */
        await this.loadMarkets();
        const defaultNetwork = this.safeString(this.options, 'defaultNetwork', 'ERC20');
        const networkId = this.safeString(params, 'network', defaultNetwork);
        const networkCode = this.networkIdToCode(networkId);
        params = this.omit(params, 'network');
        const response = await this.fetchDepositAddressesByNetwork(code, params);
        const result = this.safeValue(response, networkCode);
        if (result === undefined) {
            throw new InvalidAddress(this.id + ' fetchDepositAddress() cannot find ' + networkCode + ' deposit address for ' + code);
        }
        return result;
    }
    async fetchDepositAddressesByNetwork(code, params = {}) {
        /**
         * @method
         * @name okx#fetchDepositAddressesByNetwork
         * @description fetch a dictionary of addresses for a currency, indexed by network
         * @see https://www.okx.com/docs-v5/en/#funding-account-rest-api-get-deposit-address
         * @param {string} code unified currency code of the currency for the deposit address
         * @param {object} [params] extra parameters specific to the okx api endpoint
         * @returns {object} a dictionary of [address structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#address-structure} indexed by the network
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'ccy': currency['id'],
        };
        const response = await this.privateGetAssetDepositAddress(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "addr": "okbtothemoon",
        //                 "memo": "971668", // may be missing
        //                 "tag":"52055", // may be missing
        //                 "pmtId": "", // may be missing
        //                 "ccy": "BTC",
        //                 "to": "6", // 1 SPOT, 3 FUTURES, 6 FUNDING, 9 SWAP, 12 OPTION, 18 Unified account
        //                 "selected": true
        //             },
        //             // {"ccy":"usdt-erc20","to":"6","addr":"0x696abb81974a8793352cbd33aadcf78eda3cfdfa","selected":true},
        //             // {"ccy":"usdt-trc20","to":"6","addr":"TRrd5SiSZrfQVRKm4e9SRSbn2LNTYqCjqx","selected":true},
        //             // {"ccy":"usdt_okexchain","to":"6","addr":"0x696abb81974a8793352cbd33aadcf78eda3cfdfa","selected":true},
        //             // {"ccy":"usdt_kip20","to":"6","addr":"0x696abb81974a8793352cbd33aadcf78eda3cfdfa","selected":true},
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const filtered = this.filterBy(data, 'selected', true);
        const parsed = this.parseDepositAddresses(filtered, [currency['code']], false);
        return this.indexBy(parsed, 'network');
    }
    async transfer(code, amount, fromAccount, toAccount, params = {}) {
        /**
         * @method
         * @name okcoin#transfer
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-funding-funds-transfer
         * @description transfer currency internally between wallets on the same account
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a [transfer structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#transfer-structure}
         */
        await this.loadMarkets();
        const currency = this.currency(code);
        const accountsByType = this.safeValue(this.options, 'accountsByType', {});
        const fromId = this.safeString(accountsByType, fromAccount, fromAccount);
        const toId = this.safeString(accountsByType, toAccount, toAccount);
        const request = {
            'ccy': currency['id'],
            'amt': this.currencyToPrecision(code, amount),
            'type': '0',
            'from': fromId,
            'to': toId, // beneficiary account, 6: Funding account, 18: Trading account
            // 'subAcct': 'sub-account-name', // optional, only required when type is 1, 2 or 4
            // 'loanTrans': false, // Whether or not borrowed coins can be transferred out under Multi-currency margin and Portfolio margin. The default is false
            // 'clientId': 'client-supplied id', // A combination of case-sensitive alphanumerics, all numbers, or all letters of up to 32 characters
            // 'omitPosRisk': false, // Ignore position risk. Default is false. Applicable to Portfolio margin
        };
        if (fromId === 'master') {
            request['type'] = '1';
            request['subAcct'] = toId;
            request['from'] = this.safeString(params, 'from', '6');
            request['to'] = this.safeString(params, 'to', '6');
        }
        else if (toId === 'master') {
            request['type'] = '2';
            request['subAcct'] = fromId;
            request['from'] = this.safeString(params, 'from', '6');
            request['to'] = this.safeString(params, 'to', '6');
        }
        const response = await this.privatePostAssetTransfer(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "transId": "754147",
        //                 "ccy": "USDT",
        //                 "from": "6",
        //                 "amt": "0.1",
        //                 "to": "18"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const rawTransfer = this.safeValue(data, 0, {});
        return this.parseTransfer(rawTransfer, currency);
    }
    parseTransfer(transfer, currency = undefined) {
        //
        // transfer
        //
        //     {
        //         "transId": "754147",
        //         "ccy": "USDT",
        //         "from": "6",
        //         "amt": "0.1",
        //         "to": "18"
        //     }
        //
        // fetchTransfer
        //
        //     {
        //         "amt": "5",
        //         "ccy": "USDT",
        //         "from": "18",
        //         "instId": "",
        //         "state": "success",
        //         "subAcct": "",
        //         "to": "6",
        //         "toInstId": "",
        //         "transId": "464424732",
        //         "type": "0"
        //     }
        //
        // fetchTransfers
        //
        //     {
        //         "bal": "70.6874353780312913",
        //         "balChg": "-4.0000000000000000", // negative means "to funding", positive meand "from funding"
        //         "billId": "588900695232225299",
        //         "ccy": "USDT",
        //         "execType": "",
        //         "fee": "",
        //         "from": "18",
        //         "instId": "",
        //         "instType": "",
        //         "mgnMode": "",
        //         "notes": "To Funding Account",
        //         "ordId": "",
        //         "pnl": "",
        //         "posBal": "",
        //         "posBalChg": "",
        //         "price": "0",
        //         "subType": "12",
        //         "sz": "-4",
        //         "to": "6",
        //         "ts": "1686676866989",
        //         "type": "1"
        //     }
        //
        const id = this.safeString2(transfer, 'transId', 'billId');
        const currencyId = this.safeString(transfer, 'ccy');
        const code = this.safeCurrencyCode(currencyId, currency);
        let amount = this.safeNumber(transfer, 'amt');
        const fromAccountId = this.safeString(transfer, 'from');
        const toAccountId = this.safeString(transfer, 'to');
        const accountsById = this.safeValue(this.options, 'accountsById', {});
        const timestamp = this.safeInteger(transfer, 'ts', this.milliseconds());
        const balanceChange = this.safeString(transfer, 'sz');
        if (balanceChange !== undefined) {
            amount = this.parseNumber(Precise.stringAbs(balanceChange));
        }
        return {
            'info': transfer,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'currency': code,
            'amount': amount,
            'fromAccount': this.safeString(accountsById, fromAccountId),
            'toAccount': this.safeString(accountsById, toAccountId),
            'status': this.parseTransferStatus(this.safeString(transfer, 'state')),
        };
    }
    parseTransferStatus(status) {
        const statuses = {
            'success': 'ok',
        };
        return this.safeString(statuses, status, status);
    }
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#withdraw
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-funding-withdrawal
         * @description make a withdrawal
         * @param {string} code unified currency code
         * @param {float} amount the amount to withdraw
         * @param {string} address the address to withdraw to
         * @param {string} tag
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a [transaction structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#transaction-structure}
         */
        [tag, params] = this.handleWithdrawTagAndParams(tag, params);
        this.checkAddress(address);
        await this.loadMarkets();
        const currency = this.currency(code);
        if ((tag !== undefined) && (tag.length > 0)) {
            address = address + ':' + tag;
        }
        const request = {
            'ccy': currency['id'],
            'toAddr': address,
            'dest': '4',
            'amt': this.numberToString(amount),
        };
        let network = this.safeString(params, 'network'); // this line allows the user to specify either ERC20 or ETH
        if (network !== undefined) {
            const networks = this.safeValue(this.options, 'networks', {});
            network = this.safeString(networks, network.toUpperCase(), network); // handle ETH>ERC20 alias
            request['chain'] = currency['id'] + '-' + network;
            params = this.omit(params, 'network');
        }
        let fee = this.safeString(params, 'fee');
        if (fee === undefined) {
            const targetNetwork = this.safeValue(currency['networks'], this.networkIdToCode(network), {});
            fee = this.safeString(targetNetwork, 'fee');
            if (fee === undefined) {
                throw new ArgumentsRequired(this.id + ' withdraw() requires a "fee" string parameter, network transaction fee must be ≥ 0. Withdrawals to OKCoin or OKX are fee-free, please set "0". Withdrawing to external digital asset address requires network transaction fee.');
            }
        }
        request['fee'] = this.numberToString(fee); // withdrawals to OKCoin or OKX are fee-free, please set 0
        const response = await this.privatePostAssetWithdrawal(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "amt": "0.1",
        //                 "wdId": "67485",
        //                 "ccy": "BTC"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        const transaction = this.safeValue(data, 0);
        return this.parseTransaction(transaction, currency);
    }
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchDeposits
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-funding-get-deposit-history
         * @description fetch all deposits made to an account
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch deposits for
         * @param {int} [limit] the maximum number of deposits structures to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#transaction-structure}
         */
        await this.loadMarkets();
        let request = {
        // 'ccy': currency['id'],
        // 'state': 2, // 0 waiting for confirmation, 1 deposit credited, 2 deposit successful
        // 'after': since,
        // 'before' this.milliseconds (),
        // 'limit': limit, // default 100, max 100
        };
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
            request['ccy'] = currency['id'];
        }
        if (since !== undefined) {
            request['before'] = Math.max(since - 1, 0);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        [request, params] = this.handleUntilOption('after', request, params);
        const response = await this.privateGetAssetDepositHistory(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "amt": "0.01044408",
        //                 "txId": "1915737_3_0_0_asset",
        //                 "ccy": "BTC",
        //                 "from": "13801825426",
        //                 "to": "",
        //                 "ts": "1597026383085",
        //                 "state": "2",
        //                 "depId": "4703879"
        //             },
        //             {
        //                 "amt": "491.6784211",
        //                 "txId": "1744594_3_184_0_asset",
        //                 "ccy": "OKB",
        //                 "from": "",
        //                 "to": "",
        //                 "ts": "1597026383085",
        //                 "state": "2",
        //                 "depId": "4703809"
        //             },
        //             {
        //                 "amt": "223.18782496",
        //                 "txId": "6d892c669225b1092c780bf0da0c6f912fc7dc8f6b8cc53b003288624c",
        //                 "ccy": "USDT",
        //                 "from": "",
        //                 "to": "39kK4XvgEuM7rX9frgyHoZkWqx4iKu1spD",
        //                 "ts": "1597026383085",
        //                 "state": "2",
        //                 "depId": "4703779"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseTransactions(data, currency, since, limit, params);
    }
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchWithdrawals
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-funding-get-withdrawal-history
         * @description fetch all withdrawals made from an account
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch withdrawals for
         * @param {int} [limit] the maximum number of withdrawals structures to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#transaction-structure}
         */
        await this.loadMarkets();
        let request = {
        // 'ccy': currency['id'],
        // 'state': 2, // -3: pending cancel, -2 canceled, -1 failed, 0, pending, 1 sending, 2 sent, 3 awaiting email verification, 4 awaiting manual verification, 5 awaiting identity verification
        // 'after': since,
        // 'before': this.milliseconds (),
        // 'limit': limit, // default 100, max 100
        };
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
            request['ccy'] = currency['id'];
        }
        if (since !== undefined) {
            request['before'] = Math.max(since - 1, 0);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 100
        }
        [request, params] = this.handleUntilOption('after', request, params);
        const response = await this.privateGetAssetWithdrawalHistory(this.extend(request, params));
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "amt": "0.094",
        //                 "wdId": "4703879",
        //                 "fee": "0.01000000eth",
        //                 "txId": "0x62477bac6509a04512819bb1455e923a60dea5966c7caeaa0b24eb8fb0432b85",
        //                 "ccy": "ETH",
        //                 "from": "13426335357",
        //                 "to": "0xA41446125D0B5b6785f6898c9D67874D763A1519",
        //                 "ts": "1597026383085",
        //                 "state": "2"
        //             },
        //             {
        //                 "amt": "0.01",
        //                 "wdId": "4703879",
        //                 "fee": "0.00000000btc",
        //                 "txId": "",
        //                 "ccy": "BTC",
        //                 "from": "13426335357",
        //                 "to": "13426335357",
        //                 "ts": "1597026383085",
        //                 "state": "2"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseTransactions(data, currency, since, limit, params);
    }
    parseTransactionStatus(status) {
        //
        // deposit statuses
        //
        //     {
        //         "0": "waiting for confirmation",
        //         "1": "confirmation account",
        //         "2": "recharge success"
        //     }
        //
        // withdrawal statues
        //
        //     {
        //        '-3': "pending cancel",
        //        "-2": "cancelled",
        //        "-1": "failed",
        //         "0": "pending",
        //         "1": "sending",
        //         "2": "sent",
        //         "3": "email confirmation",
        //         "4": "manual confirmation",
        //         "5": "awaiting identity confirmation"
        //     }
        //
        const statuses = {
            '-3': 'pending',
            '-2': 'canceled',
            '-1': 'failed',
            '0': 'pending',
            '1': 'pending',
            '2': 'ok',
            '3': 'pending',
            '4': 'pending',
            '5': 'pending',
        };
        return this.safeString(statuses, status, status);
    }
    parseTransaction(transaction, currency = undefined) {
        //
        // withdraw
        //
        //     {
        //         "amt": "0.1",
        //         "wdId": "67485",
        //         "ccy": "BTC"
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //         "amt": "0.094",
        //         "wdId": "4703879",
        //         "fee": "0.01000000eth",
        //         "txId": "0x62477bac6509a04512819bb1455e923a60dea5966c7caeaa0b24eb8fb0432b85",
        //         "ccy": "ETH",
        //         "from": "13426335357",
        //         "to": "0xA41446125D0B5b6785f6898c9D67874D763A1519",
        //         "tag",
        //         "pmtId",
        //         "memo",
        //         "ts": "1597026383085",
        //         "state": "2"
        //     }
        //
        // fetchDeposits
        //
        //     {
        //         "amt": "0.01044408",
        //         "txId": "1915737_3_0_0_asset",
        //         "ccy": "BTC",
        //         "from": "13801825426",
        //         "to": "",
        //         "ts": "1597026383085",
        //         "state": "2",
        //         "depId": "4703879"
        //     }
        //
        let type = undefined;
        let id = undefined;
        const withdrawalId = this.safeString(transaction, 'wdId');
        const addressFrom = this.safeString(transaction, 'from');
        const addressTo = this.safeString(transaction, 'to');
        const address = addressTo;
        let tagTo = this.safeString2(transaction, 'tag', 'memo');
        tagTo = this.safeString2(transaction, 'pmtId', tagTo);
        if (withdrawalId !== undefined) {
            type = 'withdrawal';
            id = withdrawalId;
        }
        else {
            // the payment_id will appear on new deposits but appears to be removed from the response after 2 months
            id = this.safeString(transaction, 'depId');
            type = 'deposit';
        }
        const currencyId = this.safeString(transaction, 'ccy');
        const code = this.safeCurrencyCode(currencyId);
        const amount = this.safeNumber(transaction, 'amt');
        const status = this.parseTransactionStatus(this.safeString(transaction, 'state'));
        const txid = this.safeString(transaction, 'txId');
        const timestamp = this.safeInteger(transaction, 'ts');
        let feeCost = undefined;
        if (type === 'deposit') {
            feeCost = 0;
        }
        else {
            feeCost = this.safeNumber(transaction, 'fee');
        }
        // todo parse tags
        return {
            'info': transaction,
            'id': id,
            'currency': code,
            'amount': amount,
            'network': undefined,
            'addressFrom': addressFrom,
            'addressTo': addressTo,
            'address': address,
            'tagFrom': undefined,
            'tagTo': tagTo,
            'tag': tagTo,
            'status': status,
            'type': type,
            'updated': undefined,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'comment': undefined,
            'internal': undefined,
            'fee': {
                'currency': code,
                'cost': feeCost,
            },
        };
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchMyTrades
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-transaction-details-last-3-days
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-trade-get-transaction-details-last-3-months
         * @description fetch all trades made by the user
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades structures to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#trade-structure}
         */
        await this.loadMarkets();
        const request = {
            'instType': 'SPOT',
        };
        if ((limit !== undefined) && (limit > 100)) {
            limit = 100;
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instId'] = market['id'];
        }
        let method = undefined;
        [method, params] = this.handleOptionAndParams(params, 'fetchMyTrades', 'method', 'privateGetTradeFillsHistory');
        let response = undefined;
        if (method === 'privateGetTradeFillsHistory') {
            response = await this.privateGetTradeFillsHistory(this.extend(request, params));
        }
        else {
            response = await this.privateGetTradeFills(this.extend(request, params));
        }
        const data = this.safeValue(response, 'data', []);
        return this.parseTrades(data, market, since, limit);
    }
    async fetchOrderTrades(id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchOrderTrades
         * @description fetch all the trades made from a single order
         * @param {string} id order id
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades to retrieve
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object[]} a list of [trade structures]{@link https://github.com/ccxt/ccxt/wiki/Manual#trade-structure}
         */
        const request = {
            // 'instrument_id': market['id'],
            'order_id': id,
            // 'after': '1', // return the page after the specified page number
            // 'before': '1', // return the page before the specified page number
            // 'limit': limit, // optional, number of results per request, default = maximum = 100
        };
        return await this.fetchMyTrades(symbol, since, limit, this.extend(request, params));
    }
    async fetchLedger(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name okcoin#fetchLedger
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-funding-asset-bills-details
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-account-get-bills-details-last-7-days
         * @see https://www.okcoin.com/docs-v5/en/#rest-api-account-get-bills-details-last-3-months
         * @description fetch the history of changes, actions done by the user or operations that altered balance of the user
         * @param {string} code unified currency code, default is undefined
         * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
         * @param {int} [limit] max number of ledger entrys to return, default is undefined
         * @param {object} [params] extra parameters specific to the okcoin api endpoint
         * @returns {object} a [ledger structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#ledger-structure}
         */
        await this.loadMarkets();
        let method = undefined;
        [method, params] = this.handleOptionAndParams(params, 'fetchLedger', 'method', 'privateGetAccountBills');
        let request = {
        // 'instType': undefined, // 'SPOT', 'MARGIN', 'SWAP', 'FUTURES", 'OPTION'
        // 'ccy': undefined, // currency['id'],
        // 'ctType': undefined, // 'linear', 'inverse', only applicable to FUTURES/SWAP
        // 'type': varies depending the 'method' endpoint :
        //     - https://www.okx.com/docs-v5/en/#rest-api-account-get-bills-details-last-7-days
        //     - https://www.okx.com/docs-v5/en/#rest-api-funding-asset-bills-details
        //     - https://www.okx.com/docs-v5/en/#rest-api-account-get-bills-details-last-3-months
        // 'after': 'id', // return records earlier than the requested bill id
        // 'before': 'id', // return records newer than the requested bill id
        // 'limit': 100, // default 100, max 100
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency(code);
            request['ccy'] = currency['id'];
        }
        [request, params] = this.handleUntilOption('end', request, params);
        const response = await this[method](this.extend(request, params));
        //
        // privateGetAccountBills, privateGetAccountBillsArchive
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "bal": "0.0000819307998198",
        //                 "balChg": "-664.2679586599999802",
        //                 "billId": "310394313544966151",
        //                 "ccy": "USDT",
        //                 "fee": "0",
        //                 "from": "",
        //                 "instId": "LTC-USDT",
        //                 "instType": "SPOT",
        //                 "mgnMode": "cross",
        //                 "notes": "",
        //                 "ordId": "310394313519800320",
        //                 "pnl": "0",
        //                 "posBal": "0",
        //                 "posBalChg": "0",
        //                 "subType": "2",
        //                 "sz": "664.26795866",
        //                 "to": "",
        //                 "ts": "1620275771196",
        //                 "type": "2"
        //             }
        //         ]
        //     }
        //
        // privateGetAssetBills
        //
        //     {
        //         "code": "0",
        //         "msg": "",
        //         "data": [
        //             {
        //                 "billId": "12344",
        //                 "ccy": "BTC",
        //                 "balChg": "2",
        //                 "bal": "12",
        //                 "type": "1",
        //                 "ts": "1597026383085"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue(response, 'data', []);
        return this.parseLedger(data, currency, since, limit);
    }
    parseLedgerEntryType(type) {
        const types = {
            '1': 'transfer',
            '2': 'trade',
            '3': 'trade',
            '4': 'rebate',
            '5': 'trade',
            '6': 'transfer',
            '7': 'trade',
            '8': 'fee',
            '9': 'trade',
            '10': 'trade',
            '11': 'trade', // system token conversion
        };
        return this.safeString(types, type, type);
    }
    parseLedgerEntry(item, currency = undefined) {
        //
        // privateGetAccountBills, privateGetAccountBillsArchive
        //
        //     {
        //         "bal": "0.0000819307998198",
        //         "balChg": "-664.2679586599999802",
        //         "billId": "310394313544966151",
        //         "ccy": "USDT",
        //         "fee": "0",
        //         "from": "",
        //         "instId": "LTC-USDT",
        //         "instType": "SPOT",
        //         "mgnMode": "cross",
        //         "notes": "",
        //         "ordId": "310394313519800320",
        //         "pnl": "0",
        //         "posBal": "0",
        //         "posBalChg": "0",
        //         "subType": "2",
        //         "sz": "664.26795866",
        //         "to": "",
        //         "ts": "1620275771196",
        //         "type": "2"
        //     }
        //
        // privateGetAssetBills
        //
        //     {
        //         "billId": "12344",
        //         "ccy": "BTC",
        //         "balChg": "2",
        //         "bal": "12",
        //         "type": "1",
        //         "ts": "1597026383085"
        //     }
        //
        const id = this.safeString(item, 'billId');
        const account = undefined;
        const referenceId = this.safeString(item, 'ordId');
        const referenceAccount = undefined;
        const type = this.parseLedgerEntryType(this.safeString(item, 'type'));
        const code = this.safeCurrencyCode(this.safeString(item, 'ccy'), currency);
        const amountString = this.safeString(item, 'balChg');
        const amount = this.parseNumber(amountString);
        const timestamp = this.safeInteger(item, 'ts');
        const feeCostString = this.safeString(item, 'fee');
        let fee = undefined;
        if (feeCostString !== undefined) {
            fee = {
                'cost': this.parseNumber(Precise.stringNeg(feeCostString)),
                'currency': code,
            };
        }
        const before = undefined;
        const afterString = this.safeString(item, 'bal');
        const after = this.parseNumber(afterString);
        const status = 'ok';
        const marketId = this.safeString(item, 'instId');
        const symbol = this.safeSymbol(marketId, undefined, '-');
        return {
            'id': id,
            'info': item,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'account': account,
            'referenceId': referenceId,
            'referenceAccount': referenceAccount,
            'type': type,
            'currency': code,
            'symbol': symbol,
            'amount': amount,
            'before': before,
            'after': after,
            'status': status,
            'fee': fee,
        };
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const isArray = Array.isArray(params);
        const request = '/api/' + this.version + '/' + this.implodeParams(path, params);
        const query = this.omit(params, this.extractParams(path));
        let url = this.implodeHostname(this.urls['api']['rest']) + request;
        if (api === 'public') {
            if (Object.keys(query).length) {
                url += '?' + this.urlencode(query);
            }
        }
        else if (api === 'private') {
            this.checkRequiredCredentials();
            const timestamp = this.iso8601(this.milliseconds());
            headers = {
                'OK-ACCESS-KEY': this.apiKey,
                'OK-ACCESS-PASSPHRASE': this.password,
                'OK-ACCESS-TIMESTAMP': timestamp,
                // 'OK-FROM': '',
                // 'OK-TO': '',
                // 'OK-LIMIT': '',
            };
            let auth = timestamp + method + request;
            if (method === 'GET') {
                if (Object.keys(query).length) {
                    const urlencodedQuery = '?' + this.urlencode(query);
                    url += urlencodedQuery;
                    auth += urlencodedQuery;
                }
            }
            else {
                if (isArray || Object.keys(query).length) {
                    body = this.json(query);
                    auth += body;
                }
                headers['Content-Type'] = 'application/json';
            }
            const signature = this.hmac(this.encode(auth), this.encode(this.secret), sha256, 'base64');
            headers['OK-ACCESS-SIGN'] = signature;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    parseBalanceByType(type, response) {
        if (type === 'funding') {
            return this.parseFundingBalance(response);
        }
        else {
            return this.parseTradingBalance(response);
        }
    }
    handleErrors(httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return undefined; // fallback to default error handler
        }
        //
        //    {
        //        "code": "1",
        //        "data": [
        //            {
        //                "clOrdId": "",
        //                "ordId": "",
        //                "sCode": "51119",
        //                "sMsg": "Order placement failed due to insufficient balance. ",
        //                "tag": ""
        //            }
        //        ],
        //        "msg": ""
        //    },
        //    {
        //        "code": "58001",
        //        "data": [],
        //        "msg": "Incorrect trade password"
        //    }
        //
        const code = this.safeString(response, 'code');
        if (code !== '0') {
            const feedback = this.id + ' ' + body;
            const data = this.safeValue(response, 'data', []);
            for (let i = 0; i < data.length; i++) {
                const error = data[i];
                const errorCode = this.safeString(error, 'sCode');
                const message = this.safeString(error, 'sMsg');
                this.throwExactlyMatchedException(this.exceptions['exact'], errorCode, feedback);
                this.throwBroadlyMatchedException(this.exceptions['broad'], message, feedback);
            }
            this.throwExactlyMatchedException(this.exceptions['exact'], code, feedback);
            throw new ExchangeError(feedback); // unknown message
        }
        return undefined;
    }
}
