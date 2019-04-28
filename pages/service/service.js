const app = getApp();
Page({
  data: {
    width: wx.getSystemInfoSync().windowWidth,
    shopInfoAndTel: {}
  },
  // 生命钩子
  onLoad: function() {
    console.log(app.config.shopInfoAndTel);
    // 从app.js中读取配置更新到
    this.setData({
      shopInfoAndTel: app.config.shopInfoAndTel
    })
  },
  // 拨打电话
  callphone: function() {
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.shopInfoAndTel.tel //仅为示例，并非真实的电话号码
    })
  },
  click: function(e) {
    wx.openLocation({
      longitude: 113.2209709892,
      latitude: 23.0986723010,
      scale: 14,
      name: '易杨堂 020-86537689',
      address: '广州市荔湾区芳村大道安定首约30号 广物A01-03号'
    })
  },
})