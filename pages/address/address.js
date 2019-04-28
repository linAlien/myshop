const app = getApp();
Page({
  data: {
    address: [],
    chooseAddress: false
  },
  importAddressFromWechat: function() {
    console.log('choose address from wechat system')
    let _this = this;

    // 如果被拒绝
    wx.chooseAddress({
      success(res) {

        let obj = {
          linkman: res.userName,
          phone: res.telNumber,
          address: res.detailInfo,
          province_name: res.provinceName,
          city_name: res.cityName,
          district_name: res.countyName,
          token: wx.getStorageSync('token'),
          is_default: false,
          postcode: res.postalCode,
          shop_id: app.config.shop_id
        }

        let url = `${app.config.host}address/list`;
        let token = wx.getStorageSync('token');

        wx.request({
          url: url,
          method: 'POST',
          header: {
            // 'content-type': 'application/json'，
            'content-type': 'application/x-www-form-urlencoded',
            'X-Handler': '',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          data: obj,
          success: function(res) {
            if (res.statusCode == 200) {
              switch (res.data.code) {
                case 0:
                  _this.getAddressList();
                  break;
                case 404:
                  wx.showModal({
                    title: '提示',
                    content: '添加失败 错误码' + res.data.code,
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                  break;
                case 901:
                  wx.showModal({
                    title: '提示',
                    content: '添加失败 错误码' + res.data.code,
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                  break;
              }
            }
          }
        })
      }
    })
  },
  onLoad: function(options) {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }

    if (options.chooseAddress) {
      // 做标记
      this.setData({
        chooseAddress: true
      })
    }
    this.getAddressList();
  },
  chooseAddressThis: function(e) {
    // 如果是从payment页面携带参数过来的
    if (this.data.chooseAddress) {
      console.log(111)
      let index = e.currentTarget.dataset.index;
      let address = this.data.address[index];

      app.config.targetAddress = address;
      wx.navigateBack({})
    }
  },
  // 获取地址列表
  getAddressList: function() {
    let _this = this;
    let obj = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token')
    }

    let url = app.config.host + 'address/list?shop_id=' + obj.shop_idS;
    let token = wx.getStorageSync('token');

    wx.request({
      url: url,
      method: "GET",
      header: {
        'content-Type': 'text/html',
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      data: obj,
      success: function(res) {
        if (res.statusCode == 200) {
          _this.setData({
            address: res.data.data
          })
        }
      }
    })
  },
  // 长按删除地址
  bindLongPress: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let address_id = this.data.address[index].id

    let obj = {
      shop_id: app.config.shop_id,
      token: wx.getStorageSync('token'),
      address_id: address_id
    }

    let url = app.config.host + '/shop/address/delete?shop_id=' + obj.shop_id + '&token=' + obj.token + '&address_id=' + obj.address_id;

    wx.showModal({
      content: '是否删除这条收货地址',
      showCancel: true,
      confirmText: '确定删除',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: url,
            method: 'GET',
            header: {
              'content-type': 'text/html'
            },
            success: function(res) {
              wx.showToast({
                icon: 'none',
                title: '删除成功',
              })
              if (res.statusCode == 200) {
                _this.setData({
                  address: []
                })
                _this.getAddressList();
              }
            }
          })
        }
      }
    })

    // 接口 / user / shipping - address / delete
    //   参数		resUsersName, token,
    //     参数 	address_id






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
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  }
})