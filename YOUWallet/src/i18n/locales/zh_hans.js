/**
 * Created by greason on 2019/4/9.
 */

export default {
  common: {
    confirm: "确定",
    cancel: "取消",
    delete: "删除",
    "save-photo": "保存图片",
    "save-successful": "保存成功",
    "save-failed": "保存失败",
    "copy-successful": "复制成功",
    copy: "复制",
    "copy-content": "已复制内容",
    album: "相册",
    "update-successful": "更新成功",

    "confirm-edit": "确认修改",
    "input-title": "请输入"
  },

  startup: {
    "app-name": "YouchainUtils",
    "create-wallet": "创建钱包",
    "import-wallet": "导入钱包",
    welcome: "欢迎使用YOUWallet",
    "introduce-title":
      "YOUWallet 允许你保存YOU和其他代币，并可以在Dapp 中使用 YOUWallet",
    introduce: "《服务说明》",
    "introduce-content": " "
  },

  tab: {
    wallet: "钱包",
    portal: "我的"
  },

  scanner: {
    title: "扫描二维码",
    result: "扫描结果",
    "error-title": "二维码无法识别"
  },

  placeholder: {
    nodata: "这里空空如也~"
  },

  loading: {
    "refreshable-title-pull": "下拉刷新",
    "refreshable-title-release": "松手刷新",
    "refreshable-title-refreshing": "加载中",
    "waiting-spinner-text": "", //加载中
    "all-loaded-text": "我是有底线的 ^_^"
  },

  wallet: {
    create: {
      "create-title": "创建新钱包",
      "create-notice":
        "密码用于保护私钥和交易授权，请输入英文+字母等高强度密码。该密码无法找回，请务必牢记，建议设置密码提示信息",
      "wallet-name": "钱包名称",
      "wallet-ps": "密码",
      "wallet-ps-notice": "密码提示（非必填）",
      "service-agree": "我已仔细阅读并同意",
      "service-agree-notice": "请同意服务说明",
      "create-submit": "创建",
      "create-success": "创建成功",
      "create-failed": "创建失败",
      "wallet-address": "钱包地址",
      "wallet-backup": "备份钱包",
      "wallet-enter": "进入钱包",
      "password-tips": "(数字+字母)密码长度6~20位",

      mnemonic: "助记词",
      "mnemonic-notice":
        "请复制下方助记词，并将在下一步中按顺序确认这些助记词(点击复制）",
      "mnemonic-copy": "复制成功",
      "mnemonic-confirm": "确认你的助记词",
      "mnemonic-confirm-notice": "请按正确的顺序确认助记词",
      "mnemonic-error": "顺序错误"
    },

    network: {
      choose: "选择网络",
      content: [
        { key: "main", value: "有链主网络" },
        { key: "test", value: "有链测试网络" },
        { key: "selfRpc", value: "自定义 RPC" }
      ],
      mainNetworkNotice: "主网待启动，敬请期待",
      selfRpc: {
        input: "请输入Rpc",
        title: "自定义Rpc",
        name: "网络名称: ",
        url: "Rpc url: "
      }
    },

    balance: "<p><a>{{first}}</a><b>{{second}}</b></p>",
    "target-address": "对方账户",
    "address-input-placeholder": "请输入账号",
    amount: "金额",
    "my-amount": "我的余额({{unit}})",
    "amount-input-placeholder": "0",
    "execute-num": "连续执行次数",
    "use-tips":
      "说明：公链内测入口内发起的资金流动不会影响有令App账户真实" +
      "资产及余额；有令App原转账入口发起的资金流动会同步到公链；" +
      "内测版存在服务不稳定风险，敬请谅解",

    import: {
      "import-title": "导入钱包",
      "import-notice":
        "YOUWallet 钱包导入，需要同时提供加密密码及加密后私钥或keystore，缺一不可；或者提供助记词",
      "import-type": "选择类型",
      types: [
        { key: "key", value: "私钥" },
        { key: "keystore", value: "Keystore" },
        { key: "mnemonic", value: "助记词" }
      ],
      mnemonic: {
        error: "助记词错误",
        placeholder: "请输入12个助记词，以空格隔开"
      },

      "import-password": "密码",
      "wallet-exist": "钱包地址已存在",
      "wallet-not-exist": "钱包地址不存在",
      "import-successful": "成功导入钱包",
      "import-failed": "导入钱包失败"
    },
    pay: {
      "forgot-password": "忘记密码？",
      processing: "处理中 ...",
      "input-title": "输入支付密码",
      "password-error": "密码错误",
      "input-password": "请输入密码"
    },

    "address-error": "地址格式非法",
    "transaction-sending": "区块打包中…",
    "transaction-estimateGas": "预计交易Gas: {{estimateGas}}",
    "transaction-error": "转账失败",
    "transaction-success": "转账成功"
  },

  portal: {
    "change-wallet": "切换钱包",
    "user-name": "YOUChain主钱包",
    "wallet-address": "钱包地址",
    "wallet-change-pw": "修改支付密码",
    "my-bill": "我的账单",
    "chain-explorer": "区块链浏览器",
    "export-secret": "导出私钥",
    "export-keystore": "导出Keystore",
    "show-mnemonic": "助记词",
    share: "分享给好友",
    "waiting-for": "待实现",
    help: "帮助",

    mnemonic: {
      show: "查看助记词需验证密码",
      notice: "不要对任何人展示助记词以免账户被盗取(点击复制)"
    },

    chain: {
      "wrong-password": "请输入数字+字母组成的密码，密码长度6~20位",
      "error-password": "密码错误",
      "error-content": "{{type}}错误",
      changePw: {
        title: "修改支付密码",
        "pay-password-new": "新支付密码",
        "pay-password-not-same": "两次支付密码不一致",
        "password-confirm": "确认密码"
      },

      transaction: {
        title: "我的账单",
        amount: "余额：",
        detail: {
          title: "账单详情",
          pay: "支付",
          received: "收到",
          sending: "发送中",
          success: "交易成功",
          from: "发送方",
          to: "接收方",
          time: "创建时间",
          txHash: "TxHash"
        }
      },
      key: {
        title: "导出私钥",
        key: "私钥",
        qrcode: "二维码",
        notice:
          "安全警告：私钥经过加密导出后，仍需妥善保存和转移，黑客获取加密后的私钥仍可进行破解",
        "placeholder-key": "请输入支付密码",
        tips:
          "本软件不保存导出记录，退出再次打开此页面将重新进入加密流程，请您务必记保存好加密文件及密码",
        "password-tips":
          "为加强密码强度，请输入数字+字母组成的密码，密码长度6~20位",
        copy: "复制加密私钥",
        "input-password": "请输入加密密码",
        info: {
          key: [
            {
              title: "离线保存",
              content:
                "请抄写加密后的私钥进行保存，或复制粘贴加密后的私钥到安全、离线的地方保存。切勿保存到邮箱、记事本、网盘、聊天工具等，非常危险"
            },
            {
              title: "请勿使用网络传输",
              content:
                "请勿通过网络工具传输加密后的私钥，一旦被黑客获取将造成不可挽回的财产损失。建议离线设备通过二维码方式传输"
            },
            {
              title: "秘密保险箱保存",
              content:
                "如需在线保存，则建议使用安全等级更高的 1Password 等密码保管软件保存加密后的私钥"
            },
            {
              title: "导入钱包时需要提供加密后私钥及当次加密使用的密码",
              content:
                "导出的私钥在导入过程中，需要输入导出时对私钥进行加密的密码，如忘记密码，则无法进行导入，可再次进行加密导出"
            }
          ],
          code: [
            {
              title: "仅供直接扫码",
              content:
                "二维码禁止保存、截图、以及拍照。仅供用户在安全环境下直接扫描来方便的导入钱包"
            },
            {
              title: "在安全环境下使用",
              content:
                "请在确保四周无人及无摄像头的情况下使用。二维码一旦被他人获取将造成不可挽回的损失"
            },
            {
              title: "导入过程扫描二维码并输入密码",
              content:
                "导出的私钥二维码在导入扫描后，需要输入导出时对私钥进行加密的密码，如忘记密码，则无法进行导入，可再次进行加密导出"
            }
          ]
        }
      },
      keystore: {
        title: "导出Keystore",
        notice:
          "安全警告：Keystore经过加密导出后，仍需妥善保存和转移，黑客获取加密后的私钥仍可进行破解",
        "placeholder-key": "请输入支付密码",
        tips:
          "本软件不保存导出记录，退出再次打开此页面将重新进入加密流程，请您务必记保存好加密文件及密码",
        copy: "复制Keystore",
        download: "下载Keystore",
        "download-success": "文件保存至：{{value}}",
        "download-failed": "保存失败",
        "input-password": "请输入Keystore密码",
        "export-notice": "导出中",
        info: {
          key: [
            {
              title: "离线保存",
              content:
                "请抄写加密后的Keystore进行保存，或复制粘贴加密后的私钥到安全、离线的地方保存。切勿保存到邮箱、记事本、网盘、聊天工具等，非常危险"
            },
            {
              title: "请勿使用网络传输",
              content:
                "请勿通过网络工具传输加密后的Keystore，一旦被黑客获取将造成不可挽回的财产损失。建议离线设备通过二维码方式传输"
            },
            {
              title: "秘密保险箱保存",
              content:
                "如需在线保存，则建议使用安全等级更高的 1Password 等密码保管软件保存加密后的Keystore"
            },
            {
              title: "导入钱包时需要提供加密后Keystore及当次加密使用的密码",
              content:
                "导出的Keystore在导入过程中，需要输入导出时对Keystore进行加密的密码，如忘记密码，则无法进行导入，可再次进行加密导出"
            }
          ]
        }
      }
    }
  }
};
