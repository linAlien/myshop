const app = getApp();
Page({
  data: {
    options: [{
        title: '待付款',
        choose: true,
        fliter: 0
      },
      {
        title: '已付款',
        choose: false,
        fliter: 1
      },
      {
        title: '待收货',
        choose: false,
        fliter: 2
      },
      // {
      //   title: '待评价',
      //   choose: false,
      //   fliter: 3
      // },
      {
        title: '已完成',
        choose: false,
        fliter: 4
      }
    ],
    // status关闭-1 待付款0 已付款1 待收货2 待评价3 完成4
    // 默认 0
    OrderStatus: 0,
    // 订单列表
    orderArray: [],
    // 是否加载全部
    isLoadend: null,
    deviceWidth: wx.getSystemInfoSync().windowWidth * 0.94 * 0.23
  },

  onLoad: function(options) {
    if (JSON.stringify(options) == "{}") {
      this.getOrderList();
      return
    }
    let e = {
      currentTarget: {
        dataset: {
          index: options.fliter
        }
      }
    }

    this.switchOptions(e)
  },
  // 复制订单号码
  copyTrackingNum: function(e) {
    let index = e.currentTarget.dataset.index;
    let ticknum = this.data.orderArray[index].tracking_number;

    wx.setClipboardData({
      data: ticknum,
    })

    wx.showToast({
      title: '复制单号成功',
    })
  },
  // 获取订单列表
  getOrderList: function() {
    wx.showLoading({
      title: '数据加载中..',
    });
    let _this = this;
    let obj = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token')
    }

    let url = app.config.host + '/shop/order/list_extra?shop_id=' + obj.shop_id + '&token=' + obj.token + '&status=' + this.data.OrderStatus;

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-Type': 'text/html'
      },
      success: function(res) {
        if (res.statusCode == 200) {
          switch (res.data.code) {
            case 0:

              let _res = res.data.data;
              let isLoadend = false;

              if (_res.orderList.length == 0) {
                isLoadend = true
                _this.setData({
                  orderArray: [],
                  isLoadend: isLoadend
                })
                return;
              }

              let goodsMap = _res.goodsMap;

              for (const index in _res.orderList) {
                let cart_id = _res.orderList[index].id;
                for (var g in goodsMap) {
                  if (cart_id == g) {
                    _res.orderList[index].list = goodsMap[g]
                  }
                }
              }

              let old = _this.data.orderArray;
              _this.setData({
                orderArray: old.concat(_res.orderList),
                isLoadend: isLoadend
              })
              break;
            case 901:
              break;

            case 400:
              break;
          }
        }
      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },
  // 切换选项卡
  switchOptions: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let status = this.data.options[index].fliter;

    this.setData({
      OrderStatus: status
    })

    for (let i = 0; i < this.data.options.length; i++) {
      if (i == index) {
        this.data.options[i].choose = true
      } else {
        this.data.options[i].choose = false
      }
    }

    this.setData({
      options: that.data.options,
      OrderStatus: status,
      orderArray: [],
      isLoadend: false
    })

    this.getOrderList();
  },
  // 关闭订单
  toCancelOrder: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let order_id = this.data.orderArray[index].id;

    let obj = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token'),
    }

    wx.showModal({
      content: '是否取消该订单',
      cancelText: '按错了',
      cancelColor: '#818181',
      confirmColor: '#fe5656',
      confirmText: '确定取消',
      success: function(res) {
        if (res.confirm) {
          let url = app.config.host + '/shop/order/close?order_id=' + order_id + '&shop_id=' + obj.shop_id + '&token=' + obj.token

          wx.request({
            method: 'GET',
            url: url,
            header: {
              'content-type': 'text/html'
            },
            success: function(res) {
              if (res.statusCode == 200) {
                switch (res.data.code) {
                  case 0:
                    let e = {
                      currentTarget: {
                        dataset: {
                          index: _this.data.OrderStatus
                        }
                      }
                    }

                    _this.switchOptions(e);
                    break;
                  default:
                    wx.showModal({
                      title: '提示',
                      content: '取消订单错误 错误' + res.data.code,
                      showCancel: false
                    })
                    break;
                }
              }
            }
          })
        }
      }
    })
  },
  // 支付
  toPayment: function(e) {
    const _this = this;
    let index = e.currentTarget.dataset.index;
    let order_id = this.data.orderArray[index].id;
    let amountReal = this.data.orderArray[index].amountReal;

    wx.showLoading({
      title: '状态确认中..',
    })

    let obj = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token'),
      order_id: order_id,
      money: amountReal
    }

    let url = app.config.host + "/shop/pay"

    wx.request({
      url: url,
      method: 'POST',
      data: obj,
      header: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        switch (res.statusCode) {
          case 200:
            let _res = res.data.data;

            wx.requestPayment({
              'timeStamp': _res.timeStamp,
              'nonceStr': _res.nonceStr,
              'package': "prepay_id=" + _res.prepayId,
              'signType': 'MD5',
              'paySign': _res.sign,
              'success': function(res) {
                // 支付成功
                let e = {
                  currentTarget: {
                    dataset: {
                      index: 1
                    }
                  }
                }
                _this.switchOptions(e);
              },
              'fail': function(res) {
                console.log(res);
              },
              'complete': function(res) {

              }
            })
            break;
          default:
            wx.showModal({
              title: '吊起微信支付失败',
              content: '请稍后重试 错误码 ' + res.statusCode,
              showCancel: false,
              confirmText: '我知道了'
            })
            break;
        }
      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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