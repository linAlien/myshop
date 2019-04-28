const app = getApp();
Page({
  data: {
    target: {
      provinces: null,
      city_ids: null,
      districts: null
    },
    // 省市区数组
    provinces: [],
    citys: [],
    districts: [],
    // 索引
    provincesIndex: 0,
    citysIndex: 0,
    districtsIndex: 0,
    // 设为默认地址
    isDefaultAddress: false,
    //提交按钮是否可用
    isSubmitBtnEnable: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getProvincesList();
  },
  // 提交表单
  requestAddNewAddress: function(e) {
    let addObj = this.data.target;

    let obj = e.detail.value;
    obj.resUsersID = app.config.resUsersID;
    obj.token = wx.getStorageSync('token');

    if (!obj.linkman || !obj.phone || !obj.address) {
      wx.showToast({
        icon: 'none',
        title: '请补全信息',
      })
      return
    }

    if (!addObj.provinces || !addObj.city_ids) {
      wx.showToast({
        icon: 'none',
        title: '补全省 市 区',
      })
      return
    }

    obj.province_id = addObj.provinces
    obj.city_id = addObj.city_ids
    obj.district_id = addObj.districts || "";
    obj.postcode = '000000';
    obj.shop_id = app.config.shop_id;

    this.setData({
      isSubmitBtnEnable: false
    })

    let url = `${app.config.host}address/create`;
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
              wx.showToast({
                title: '添加成功',
              })
              setTimeout(function() {
                wx.navigateTo({
                  url: '../address/address',
                })
              }, 1000)
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
  },
  // 获取省份列表
  getProvincesList: function() {
    let _this = this;
    let url = app.config.host + '/shop/address/select';

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
              _this.data.target.provinces = res.data.data[0].id
              _this.setData({
                provinces: res.data.data
              })
              let provinceID = res.data.data[0].id;
              _this.getCityList(provinceID)
              break;
            default:
              wx.showModal({
                title: '提示',
                showCancel: falsem,
                content: '请求失败 错误码' + res.data.msg,
              })
              break;
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: falsem,
            content: '请求失败 错误码' + res.statusCode,
          })
        }
      }
    })
  },
  // 监听省份变化
  bindProvincesChange: function(e) {
    let _this = this;
    let changeIndex = e.detail.value;
    let provinceID = this.data.provinces[changeIndex].id;

    this.data.target.provinces = provinceID
    this.data.target.districts = null;
    this.setData({
      provincesIndex: changeIndex,
      target: _this.data.target,
      districts: []
    })

    this.getCityList(provinceID);
  },
  // 获取城市列表
  getCityList: function(provinceID) {
    let _this = this;
    let url = app.config.host + '/shop/address/select?province_id=' + provinceID;

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
              _this.data.target.city_ids = res.data.data[0].id
              _this.setData({
                citys: res.data.data
              })

              _this.getDistrictsList(_this.data.target.provinces, _this.data.target.city_ids);
              break;
            default:
              wx.showModal({
                title: '提示',
                showCancel: falsem,
                content: '请求失败 错误码' + res.data.msg,
              })
              break;
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: falsem,
            content: '请求失败 错误码' + res.statusCode,
          })
        }
      }
    })
  },
  // 监听城市选择器变化
  bindCityChange: function(e) {
    let changeIndex = e.detail.value;
    let CityID = this.data.citys[changeIndex].id;

    this.setData({
      citysIndex: changeIndex
    })

    this.getDistrictsList(this.data.target.provinces, CityID);
  },
  // 获取区县
  getDistrictsList: function(provinceID, CityID) {
    let _this = this;
    let url = app.config.host + '/shop/address/select?province_id=' + provinceID + '&city_id=' + CityID;

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
              if (res.data.data.length > 0) {
                _this.data.target.districts = res.data.data[0].id
                _this.setData({
                  districts: res.data.data,
                  target: _this.data.target
                })
              }
              break;

            default:
              wx.showModal({
                title: '提示',
                showCancel: falsem,
                content: '请求失败 错误码' + res.data.msg,
              })
              break;
          }
        } else {
          wx.showModal({
            title: '提示',
            showCancel: falsem,
            content: '请求失败 错误码' + res.statusCode,
          })
        }
      }
    })
  },
  bindDistrictsChange: function(e) {
    let _this = this;
    let changeIndex = e.detail.value;
    let id = this.data.districts[changeIndex].id;

    this.data.target.districts = id;
    this.setData({
      districtsIndex: changeIndex,
      target: _this.data.target
    })
  },
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