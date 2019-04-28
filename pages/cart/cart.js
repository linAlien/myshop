// pages/cart/cart.js
const app = getApp();
const Float = require('../../utils/float.js');
const float = new Float();

// console.log(float.add(0.1, 0.2)); //0.3
// console.log(float.subtract(0.1, 0.2)); //-0.1
// console.log(float.multiply(0.1, 0.2)); //0.02
// console.log(float.divide(0.1, 0.2)); //0.5
// ---------------------
// 作者：ruff1996
// 来源：CSDN
// 原文：https://blog.csdn.net/Ruffaim/article/details/82789133 
// 版权声明：本文为博主原创文章，转载请附上博文链接！

var page = 0;
Page({
  data: {
    // 加载所有
    isLoadAll: false,
    // 购物车
    cartArray: [],
    // 结算是否勾选
    CartPayActive: false,
    // 获取设备宽度 赋值给图片  
    deviceWidth: wx.getSystemInfoSync().windowWidth * 0.94 * 0.25,
    count: 0,
  },
  onLoad: function(options) {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }
  },
  // 计算总数
  CountAmout: function() {
    let count = 0;
    for (var c in this.data.cartArray) {
      if (this.data.cartArray[c].choose) {
        // console.log(float.add(0.1, 0.2)); //0.3
        // console.log(float.subtract(0.1, 0.2)); //-0.1
        // console.log(float.multiply(0.1, 0.2)); //0.02
        // console.log(float.divide(0.1, 0.2)); //0.5
        let n = float.multiply(this.data.cartArray[c].goods.originalPrice, this.data.cartArray[c].number_goods)
        count = float.add(count, n);
      }
    }
    this.setData({
      count: count
    })
  },
  // 获取购物车列表
  getCartList: function() {
    wx.showLoading({
      title: '加载中..',
    })
    let _this = this;
    let token = wx.getStorageSync('token');

    let obj = {
      page: page,
      num: 10,
      token: wx.getStorageSync('token'),
      shop_id: app.config.shop_id
    }

    wx.request({
      method: 'GET',
      url: app.config.host + 'cart/list?page=' + obj.page + '&num=' + obj.num + "&token=" + obj.token + '&shop_id=' + obj.shop_id,
      header: {
        // 'content-Type': 'text/html'
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      success: function(res) {
        if (res.statusCode == 200) {
          switch (res.data.code) {
            case 0:
              let old = _this.data.cartArray;
              let isLoadAll = false;

              if (res.data.data) {
                isLoadAll = true
              }

              for (let i = 0; i < res.data.data.length; i++) {
                res.data.data[i].choose = false
              }

              _this.setData({
                isLoadAll: isLoadAll,
                cartArray: old.concat(res.data.data)
              })
              break;
            case 404:
              _this.setData({
                isLoadAll: true
              })
              break;
            default:
              break;
          }
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  //点击删除购物车订单
  toDeleteCart: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let cart_id = this.data.cartArray[index].cart_id;

    let obj = {
      cart_id: cart_id,
      token: wx.getStorageSync('token'),
      shop_id: app.config.shop_id
    }

    wx.showModal({
      title: '提示',
      content: '是否将当前订单移出购物车',
      cancelText: '再看看',
      confirmText: '移除',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            method: 'GET',
            url: app.config.host + '/shop/cart/delete?cart_id=' + cart_id + '&token=' + obj.token + '&shop_id=' + obj.shop_id,
            header: {
              'content-Type': 'text/html'
            },
            success: function(res) {
              if (res.statusCode == 200) {
                switch (res.data.code) {
                  case 0:
                    wx.showToast({
                      icon: 'none',
                      title: '删除成功',
                    })

                    page = 0;
                    _this.setData({
                      isLoadAll: false,
                      cartArray: []
                    })

                    _this.getCartList();
                    break;
                  case 404:
                    break;

                  case -1:
                    wx.showToast({
                      icon: 'none',
                      title: res.data.msg,
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
  // 选择单项
  setThisItemChoose: function(e) {
    const _this = this;
    const index = e.currentTarget.dataset.index;
    const isChoose = this.data.cartArray[index].choose;

    this.data.cartArray[index].choose = !isChoose;

    this.setData({
      cartArray: _this.data.cartArray
    })

    this.CountAmout();
  },
  // 切换tab到index
  switchIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  onReady: function() {

  },
  onShow: function() {


    this.getCartList();
    app.config.paymentArr = [];
  },
  onHide: function() {
    page = 0;
    this.setData({
      // 加载所有
      isLoadAll: false,
      // 购物车
      cartArray: [],
      // 结算是否勾选
      CartPayActive: false,
      // 获取设备宽度 赋值给图片
      deviceWidth: wx.getSystemInfoSync().windowWidth * 0.25
    })
  },
  chooseAllCart: function() {
    const _this = this;
    const CartPayActive = !this.data.CartPayActive;

    for (var c in this.data.cartArray) {
      this.data.cartArray[c].choose = CartPayActive
    }

    this.setData({
      CartPayActive: CartPayActive,
      cartArray: _this.data.cartArray
    })

    this.CountAmout();
  },
  // 选择商品并结算
  toSettlement: function() {
    let chooseArr = [];
    let _this = this;

    for (var k in this.data.cartArray) {
      if (this.data.cartArray[k].choose) {
        chooseArr.push(_this.data.cartArray[k])
      }
    }

    if (chooseArr.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '未选择任何商品',
      })
      return;
    }

    // 更新到全局变量
    app.config.paymentArr = chooseArr;
    wx.navigateTo({
      url: '../payment/payment'
    })

    console.log(app);
  },
  onUnload: function() {

  },
  onHide: function() {
    this.setData({
      // 加载所有
      isLoadAll: false,
      // 购物车
      cartArray: [],
      // 结算是否勾选
      CartPayActive: false,
      // 获取设备宽度 赋值给图片  
      deviceWidth: wx.getSystemInfoSync().windowWidth * 0.94 * 0.25,
      count: 0,
    })
  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (this.data.isLoadAll) {
      page++;
      this.getCartList();
    }
  }
})