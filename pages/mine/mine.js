// pages/mine/mine.js
Page({
  data: {
    user: {},
    // 状态对象
    status: [{
        status: '待付款',
        fliter: 0,
        image: '../../image/mine/pay.png'
      },
      {
        status: '已付款',
        fliter: 1,
        image: '../../image/mine/trans.png'
      },
      {
        status: '待收货',
        fliter: 2,
        image: '../../image/mine/check.png'
      },
      // {
      //   status: '待评价',
      //   fliter: 3,
      //   image: '../../image/mine/comment.png'
      // },
      {
        status: '已完成',
        fliter: 4,
        image: '../../image/mine/finish.png'
      }
    ]
  },
  onLoad: function(options) {
    let user = wx.getStorageSync('user');

    setTimeout(() => {
      this.setData({
        user: user
      })
    }, 500)
  },
  toAllorder: function() {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }

    wx.navigateTo({
      url: '../order/order',
    })
  },
  routerToOrder: function(e) {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }

    let index = e.currentTarget.dataset.index;
    let fliter = this.data.status[index].fliter;

    wx.navigateTo({
      url: '../order/order?fliter=' + fliter,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})