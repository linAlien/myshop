App({
  onLaunch: function() {},
  config: {
    // 商家自定义配置信息 该配置信息在 联系我们中 显示(分小程序需修改)
    shopInfoAndTel: {
      address: "广州市荔湾区芳村大道安定首约30号 广物A01-03号",
      tel: "020-86537689",
      longitude: 113.2209709892,
      latitude: 23.0986723010
    },
    // 当前门店的商户名称(分小程序需修改)
    shopName: '茶叶普洱商城',
    // 全局自定义商铺ID 单个小程序需要单独配置 由管理员分配(分小程序需修改)
    shop_id: 1,
    // 全局域名(不可修改)
    // host: 'https://58yyt.com',
    host: 'http://123.207.83.88:30003/myshop/',
    // 购物车全局变量(不可修改)
    cart: [],
    token: null,
    // 单条收货地址信息(不可修改)
    targetAddress: null,
    // 结算订单数组(不可修改)
    paymentArr: [],
    // 关于我们 纯文本
    aboutUS: ''
  }
})