const app = getApp();

Page({
  data: {
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    switchType: 0,
    category: [{
        title: '关于',
        choose: true
      },
      {
        title: '服务',
        choose: false
      },
      {
        title: '联系',
        choose: false
      }
    ],
    banners: [{
      "status": 0,
      "businessId": false,
      "userId": 12,
      "dateUpdate": "2018-08-29 05:59:46",
      "picUrl": "http://120.79.15.10:8069/web/content?model=ir.attachment&field=datas&id=578&download=true&filename_field=datas_fname",
      "id": 4,
      "statusStr": "\u663e\u793a",
      "remark": "",
      "title": "banner2",
      "type": 0,
      "paixu": 0,
      "dateAdd": "2018-08-29 05:59:46",
      "linkUrl": ""
    }, {
      "status": 0,
      "businessId": false,
      "userId": 12,
      "dateUpdate": "2018-08-29 05:59:25",
      "picUrl": "http://120.79.15.10:8069/web/content?model=ir.attachment&field=datas&id=577&download=true&filename_field=datas_fname",
      "id": 3,
      "statusStr": "\u663e\u793a",
      "remark": "",
      "title": "banner1",
      "type": 0,
      "paixu": 0,
      "dateAdd": "2018-08-29 05:59:25",
      "linkUrl": ""
    }],
    // 服务说明
    serviceText: app.config.aboutUS
  },
  switchType: function(e) {
    let index = e.currentTarget.dataset.index;
    let isChoose = this.data.category[index].choose;
    const _this = this;

    for (var c in this.data.category) {
      if (c == index) {
        this.data.category[c].choose = true;
      } else {
        this.data.category[c].choose = false;
      }
    }

    this.setData({
      category: _this.data.category,
      switchType: index
    })
  },
  callphone: function() {
    wx.makePhoneCall({
      phoneNumber: '15017581788',
    })
  },
  imgPriview: function() {
    wx.previewImage({
      urls: ['../../image/support/png2.jpg'],
      current: '../../image/support/png2.jpg'
    })
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */

})