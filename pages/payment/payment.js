const app = getApp();
const Float = require('../../utils/float.js');
const float = new Float();

Page({
  data: {
    address: null,
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    realAmout: 0,
    paymentRes: [],
    // 是否已经计算了运费
    isTransCount: false,
    TransCount: 0
  },
  onLoad: function(options) {
    const paymentArr = app.config.paymentArr;
    let realAmout = 0;
    for (var p in paymentArr) {
      // console.log(float.add(0.1, 0.2)); //0.3
      // console.log(float.subtract(0.1, 0.2)); //-0.1
      // console.log(float.multiply(0.1, 0.2)); //0.02
      // console.log(float.divide(0.1, 0.2)); //0.5
      let n = float.multiply(paymentArr[p].number_goods, paymentArr[p].goods.originalPrice);
      paymentArr[p].count = n;
      realAmout = float.add(realAmout, n)
    }

    this.setData({
      realAmout: realAmout,
      paymentRes: paymentArr
    })
  },
  // 加减乘除

  // 选择一个地址
  toChooseAddress: function() {
    wx.navigateTo({
      url: '../address/address?chooseAddress=true',
    })
  },
  onReady: function() {

  },
  onShow: function() {
    if (app.config.targetAddress) {
      this.setData({
        address: app.config.targetAddress
      })
      // 计算运费
      this.fetchTransCount();

    }
  },
  // 请求计算运费
  fetchTransCount: function() {
    console.log('计算运费');
    let _this = this;
    let _paymentRes = this.data.paymentRes;
    let address = this.data.address;
    let Strings = [];

    for (var p in this.data.paymentRes) {
      Strings.push({
        goods_id: _paymentRes[p].goods.id,
        amount: _paymentRes[p].number_goods,
        transport_type: _paymentRes[p].logistics.transportation_ids.length > 0 ? _paymentRes[p].logistics.transportation_ids[0].transportationType : 'free'
      })
    }

    let data = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token'),
      address: address.address,
      province_id: address.provinceId,
      city_id: address.cityId,
      district_id: address.districtId,
      remark: "",
      linkman: address.linkMan,
      phone: address.mobile,
      postcode: address.code,
      goods_json_str: JSON.stringify(Strings)
    };

    let url = app.config.host + '/shop/order/count_extra';

    wx.request({
      method: 'POST',
      url: url,
      data: data,
      header: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        switch (res.statusCode) {
          case 200:
            if (res.data.code == 0) {
              let _res = res.data.data;

              _this.setData({
                isTransCount: true,
                TransCount: _res.logistics_price,
                realAmout: _res.total
              })

            } else if (res.data.code == 20001) {
              wx.showModal({
                content: '库存不足',
                showCancel: false,
                confirmText: '我知道了'
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg + '错误码' + res.data.code + '请稍后再试',
                showCancel: false,
                confirmText: '我知道了'
              })
            }
            break;
          case 400:
            break;
          case 500:
            wx.showModal({
              content: '运费计算失败 错误码 500',
              showCancel: false,
              confirmText: '确定'
            })
            return;
            break;
          default:
            break;
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 点击使用创建订单
  useWechatPay: function() {
    if (!this.data.address) {
      wx.showToast({
        icon: 'none',
        title: '补全收货地址',
      })
      return
    }

    if (JSON.stringify(this.data.goodInfo) == "{}" || JSON.stringify(this.data.address) == "{}") {
      wx.showModal({
        title: '提示',
        content: '获取商品详情失败 请稍后再试',
      })
      return;
    }

    let _this = this;
    let _paymentRes = this.data.paymentRes;
    let address = this.data.address;
    let Strings = [];
    let cart_arr = [];

    for (var p in this.data.paymentRes) {
      cart_arr.push(this.data.paymentRes[p].cart_id)
      Strings.push({
        goods_id: _paymentRes[p].goods.id,
        amount: _paymentRes[p].number_goods,
        transport_type: _paymentRes[p].logistics.transportation_ids.length > 0 ? _paymentRes[p].logistics.transportation_ids[0].transportationType : 'free'
      })
    }

    let data = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token'),
      address: address.address,
      province_id: address.provinceId,
      city_id: address.cityId,
      district_id: address.districtId,
      remark: "",
      linkman: address.linkMan,
      phone: address.mobile,
      postcode: address.code,
      goods_json_str: JSON.stringify(Strings)
    };

    let url = app.config.host + '/shop/order/create_extra';

    wx.request({
      method: 'POST',
      url: url,
      data: data,
      header: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res);
        switch (res.statusCode) {
          case 200:
            if (res.data.code == 0) {
              wx.showToast({
                title: '下单成功',
              })

              for (var c in cart_arr) {
                _this.removeCurrentCart(cart_arr[c]);
              }

              setTimeout(function() {
                wx.navigateTo({
                  url: '../order/order',
                })
              }, 1000)
            } else if (res.data.code = 20001) {
              wx.showModal({
                content: '库存不足',
                showCancel: false,
                confirmText: '我知道了'
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg + '错误码' + res.data.code + '请稍后再试',
                showCancel: false,
                confirmText: '我知道了'
              })
            }
            break;
          case 400:
            break;
          case 500:
            wx.showModal({
              content: '请求出错 错误码500',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
                console.log(res)
              }
            })
            break;
          default:
            break;
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 请求移除某个购物车
  removeCurrentCart: function(cart_id) {
    let token = wx.getStorageSync('token');
    let shop_id = app.config.shop_id;
    wx.request({
      method: 'GET',
      url: app.config.host + '/shop/cart/delete?cart_id=' + cart_id + '&token=' + token + '&shop_id=' + shop_id,
      header: {
        'content-Type': 'text/html'
      },
      success: function(res) {
        if (res.statusCode == 200) {
          switch (res.data.code) {
            case 0:
              break;
            case 404:
              break;
            case -1:
              break;
          }
        }
      }
    })
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  }
})