from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_get_last_trades_by_currency = publicGetGetLastTradesByCurrency = Entry('get_last_trades_by_currency', 'public', 'GET', {})
    public_get_get_last_trades_by_instrument = publicGetGetLastTradesByInstrument = Entry('get_last_trades_by_instrument', 'public', 'GET', {})
    public_get_get_order_book = publicGetGetOrderBook = Entry('get_order_book', 'public', 'GET', {})
    public_get_tickers = publicGetTickers = Entry('tickers', 'public', 'GET', {})
    public_get_get_instruments = publicGetGetInstruments = Entry('get_instruments', 'public', 'GET', {})
    public_get_get_tradingview_chart_data = publicGetGetTradingviewChartData = Entry('get_tradingview_chart_data', 'public', 'GET', {})
    public_get_cmc_spot_summary = publicGetCmcSpotSummary = Entry('cmc_spot_summary', 'public', 'GET', {})
    public_get_cmc_spot_ticker = publicGetCmcSpotTicker = Entry('cmc_spot_ticker', 'public', 'GET', {})
    public_get_cmc_spot_orderbook = publicGetCmcSpotOrderbook = Entry('cmc_spot_orderbook', 'public', 'GET', {})
    public_get_cmc_market_trades = publicGetCmcMarketTrades = Entry('cmc_market_trades', 'public', 'GET', {})
    public_get_cmc_contracts = publicGetCmcContracts = Entry('cmc_contracts', 'public', 'GET', {})
    public_get_cmc_contract_orderbook = publicGetCmcContractOrderbook = Entry('cmc_contract_orderbook', 'public', 'GET', {})
    public_get_coin_gecko_spot_pairs = publicGetCoinGeckoSpotPairs = Entry('coin_gecko_spot_pairs', 'public', 'GET', {})
    public_get_coin_gecko_spot_ticker = publicGetCoinGeckoSpotTicker = Entry('coin_gecko_spot_ticker', 'public', 'GET', {})
    public_get_coin_gecko_spot_orderbook = publicGetCoinGeckoSpotOrderbook = Entry('coin_gecko_spot_orderbook', 'public', 'GET', {})
    public_get_coin_gecko_market_trades = publicGetCoinGeckoMarketTrades = Entry('coin_gecko_market_trades', 'public', 'GET', {})
    public_get_coin_gecko_contracts = publicGetCoinGeckoContracts = Entry('coin_gecko_contracts', 'public', 'GET', {})
    public_get_coin_gecko_contract_orderbook = publicGetCoinGeckoContractOrderbook = Entry('coin_gecko_contract_orderbook', 'public', 'GET', {})
    public_get_get_perpetual_leverage_bracket = publicGetGetPerpetualLeverageBracket = Entry('get_perpetual_leverage_bracket', 'public', 'GET', {})
    public_get_get_perpetual_leverage_bracket_all = publicGetGetPerpetualLeverageBracketAll = Entry('get_perpetual_leverage_bracket_all', 'public', 'GET', {})
    public_post_auth = publicPostAuth = Entry('auth', 'public', 'POST', {})
    private_get_get_deposit_record = privateGetGetDepositRecord = Entry('get_deposit_record', 'private', 'GET', {})
    private_get_get_withdraw_record = privateGetGetWithdrawRecord = Entry('get_withdraw_record', 'private', 'GET', {})
    private_get_get_position = privateGetGetPosition = Entry('get_position', 'private', 'GET', {})
    private_get_get_positions = privateGetGetPositions = Entry('get_positions', 'private', 'GET', {})
    private_get_get_open_orders_by_currency = privateGetGetOpenOrdersByCurrency = Entry('get_open_orders_by_currency', 'private', 'GET', {})
    private_get_get_open_orders_by_instrument = privateGetGetOpenOrdersByInstrument = Entry('get_open_orders_by_instrument', 'private', 'GET', {})
    private_get_get_order_history_by_currency = privateGetGetOrderHistoryByCurrency = Entry('get_order_history_by_currency', 'private', 'GET', {})
    private_get_get_order_history_by_instrument = privateGetGetOrderHistoryByInstrument = Entry('get_order_history_by_instrument', 'private', 'GET', {})
    private_get_get_order_state = privateGetGetOrderState = Entry('get_order_state', 'private', 'GET', {})
    private_get_get_user_trades_by_currency = privateGetGetUserTradesByCurrency = Entry('get_user_trades_by_currency', 'private', 'GET', {})
    private_get_get_user_trades_by_instrument = privateGetGetUserTradesByInstrument = Entry('get_user_trades_by_instrument', 'private', 'GET', {})
    private_get_get_user_trades_by_order = privateGetGetUserTradesByOrder = Entry('get_user_trades_by_order', 'private', 'GET', {})
    private_get_get_perpetual_user_config = privateGetGetPerpetualUserConfig = Entry('get_perpetual_user_config', 'private', 'GET', {})
    private_post_logout = privatePostLogout = Entry('logout', 'private', 'POST', {})
    private_post_get_assets_info = privatePostGetAssetsInfo = Entry('get_assets_info', 'private', 'POST', {})
    private_post_add_withdraw_address = privatePostAddWithdrawAddress = Entry('add_withdraw_address', 'private', 'POST', {})
    private_post_buy = privatePostBuy = Entry('buy', 'private', 'POST', {})
    private_post_sell = privatePostSell = Entry('sell', 'private', 'POST', {})
    private_post_cancel = privatePostCancel = Entry('cancel', 'private', 'POST', {})
    private_post_cancel_all_by_currency = privatePostCancelAllByCurrency = Entry('cancel_all_by_currency', 'private', 'POST', {})
    private_post_cancel_all_by_instrument = privatePostCancelAllByInstrument = Entry('cancel_all_by_instrument', 'private', 'POST', {})
    private_post_close_position = privatePostClosePosition = Entry('close_position', 'private', 'POST', {})
    private_post_adjust_perpetual_leverage = privatePostAdjustPerpetualLeverage = Entry('adjust_perpetual_leverage', 'private', 'POST', {})
    private_post_adjust_perpetual_margin_type = privatePostAdjustPerpetualMarginType = Entry('adjust_perpetual_margin_type', 'private', 'POST', {})
    private_post_submit_transfer = privatePostSubmitTransfer = Entry('submit_transfer', 'private', 'POST', {})
