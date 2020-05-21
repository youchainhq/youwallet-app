/**
 * Created by greason on 2019/4/9.
 */

export default (configs = {
  app: {
    version: "1.0.0"
  },

  event: {
    EVENT_TRANSITION_START: "event_transition_start",
    EVENT_SHOW_VERIFY_MODAL: "EVENT_SHOW_VERIFY_MODAL",
    EVENT_REFRESH_CURRENT_ADDRESS: "EVENT_REFRESH_CURRENT_ADDRESS"
  },

  url: {
    chainExplorer: "https://test-explorer.iyouchain.com"
  },

  ycGas: 2600000,
  ycGasPrice: 100000000000,
  youChainProvider: {
    unit: "YOU",
    test: {
      type: "test",
      chain: "youchain",
      httpHosts: ["http://test-node.iyouchain.com"],
      wsHosts: ["wss://test-node.iyouchain.com/ws"]
    },
    main: {
      type: "main",
      chain: "youchain",
      httpHosts: ["https://mainnet-node.iyouchain.com"],
      wsHosts: ["ws://mainnet-ws.iyouchain.com"]
    },
    selfRpc: {
      type: "selfRpc",
      chain: "youchain",
      httpHosts: [],
      wsHosts: []
    }
  },

  regulars: {
    url: /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,
    chain: {
      amount: /^\d+(\.\d{0,18})?$/,
      num: /^[1-9]\d*$/,
      keyPassword: /^((?=.*?[a-zA-z])(?=.*?[0-9]))[A-Za-z0-9]{6,20}$/
    }
  }
});
