const app = getApp();
Page({
  data: {
    // 设备宽度
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    // 单品详情
    goodInfo: {},
    // 订单数量
    goodsNum: 1,
    // 显示遮罩
    isShowMask: false,
    escape2Html: "",
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
  },
  onLoad: function(options) {
    let _this = this;
    let goods_id = options.goods_id;
    let shop_id = app.config.shop_id;
    let token = wx.getStorageSync('token');

    wx.request({
      method: 'GET',
      header: {
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      url: app.config.host + 'goods/detail?goods_id=' + goods_id + '&shop_id=' + shop_id,
      // header: {
      //   'content-Type': 'text/html'
      // },
      success: function(res) {
        console.log("商品详情");
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.data.code == 0) {
            let str = res.data.data.data.description_html;
            _this.setData({
              goodInfo: res.data.data.data,
              escape2Html: _this.escape2Html(str)
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败 错误码' + res.statusCode,
          })
        }
      }
    })
  },
  // 切换到首页
  switchToIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 切换到购物车tab栏目
  switchToCart: function() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  CollectionThis: function() {
    wx.showToast({
      title: '收藏成功',
    })
  },
  onReady: function() {

  },
  // 隐藏或者显示遮罩层级
  isShowMask: function() {
    let _this = this;

    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }

    if (this.data.goodInfo.basicInfo.stores === 0) {
      wx.showToast({
        title: '暂无库存',
        icon: 'none'
      })
      return;
    }

    this.setData({
      isShowMask: !_this.data.isShowMask
    })
  },
  // 添加到购物车
  showAddCart: function() {
    let _this = this;

    let obj = {
      goods_id: this.data.goodInfo.basicInfo.id,
      number_goods: this.data.goodsNum,
      token: wx.getStorageSync('token'),
      shop_id: app.config.shop_id
    }

    wx.request({
      method: "GET",
      url: app.config.host + '/shop/cart/create?goods_id=' + obj.goods_id + "&number_goods=" + obj.number_goods + '&token=' + obj.token + '&shop_id=' + obj.shop_id,
      header: {
        'content-Type': 'text/html'
      },
      success: function(res) {
        if (res.statusCode == 200) {
          switch (res.data.code) {
            case 0:
              _this.isShowMask();
              wx.showModal({
                title: '提示',
                content: '加入购物车成功,现在去看看？',
                confirmText: '去购物车',
                cancelText: '再逛逛',
                success: function(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../cart/cart',
                    })
                  }
                }
              })
              break;
            default:
              wx.showModal({
                title: '提示',
                content: '加入购物车失败 返回码' + res.statusCode + '状态码' + res.data.code,
                confirmText: '我知道了',
                showCancel: false
              })
              break;
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '加入购物车失败 错误码' + res.statusCode,
            confirmText: '我知道了',
            showCancel: false,
            success: function(res) {

            }
          })
        }
      }
    })
  },
  // 商品数量加
  CutGoodNum: function() {
    let _this = this;
    if (this.data.goodsNum == 1) {
      wx.showToast({
        icon: 'none',
        title: '至少一件',
      })
      return
    }

    this.setData({
      goodsNum: this.data.goodsNum - 1
    })
  },
  // 富文本
  escape2Html: function(str) {
    var arrEntities = {
      'lt': '<',
      'gt': '>',
      'nbsp': ' ',
      'amp': '&',
      'quot': '"'
    };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
      return arrEntities[t];
    });
  },
  // 商品数量减
  addGoodNum: function() {
    if (this.data.goodsNum == this.data.goodInfo.basicInfo.stores) {
      wx.showToast({
        title: '没有更多库存',
        icon: 'none'
      })
      return;
    }
    let _this = this;
    this.setData({
      goodsNum: this.data.goodsNum + 1
    })
  },
  onShow: function() {

  },
  onUnload: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    const goods_id = this.data.goodInfo.basicInfo.id;
    return {
      title: this.data.goodInfo.basicInfo.name,
      path: `/pages/gooddetail/gooddetail?goods_id=${goods_id}&shop_id=${app.config.shop_id}`,
      imageUrl: this.data.goodInfo.basicInfo.pic[0].pic,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})