const app = getApp();
const util = require('../../utils/util.js')

Page({
  data: {
    code: null
  },
  onLoad: function() {
    let _this = this;
    // wx.showLoading({
    //   title: '状态确认中',
    //   mask: true,
    //   success: function(res) {
    //     setTimeout(function() {
    //       _this.wxLoginRequset();
    //     }, 1500)
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  // 判断是否登陆
  wxLoginRequset: function(callback) {
    let _this = this;
    wx.login({
      success: function(res) {
        let short = res.code;
        _this.setData({
          code: short
        })
        let url = app.config.host + 'user/auth/login?code=' + short + '&shop_id=' + app.config.shop_id

        wx.request({
          url: url,
          method: 'GET',
          header: {
            'X-Handler': '',
            //'Authorization': 'Bearer ' + token,
            'Content-Type':'application/json',
          },
          success: function(res) {
            if (res.statusCode == 200) {
              if (res.data.code == 0) {
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('user', {
                  nick: res.data.name,
                  avatar_url: res.data.avatar_url
                })

                app.config.shopInfoAndTel.address = res.data.address;
                app.config.shopInfoAndTel.tel = res.data.linkman;
                app.config.shopInfoAndTel.longitude = res.data.longitude;
                app.config.shopInfoAndTel.latitude = res.data.latitude;

                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.hideLoading();
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '请求失败 错误码' + res.statusCode,
              })
            }
          },
          fail: function(res) {
            wx.showModal({
              title: '提示',
              content: '请求失败 请检查网络设置',
            })
          }
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '登陆失败，请检查网络连接',
        })
      }
    })
  },
  // 获取用户信息
  bindGetUserInfo: function(e) {
    let that = this;

    if (e.detail.hasOwnProperty('rawData')) {
      let _detail = e.detail;
      let rawData = JSON.parse(e.detail.rawData);

      wx.setStorageSync('user', rawData)

      wx.login({
        success: function(res) {
          let code = res.code;
          let url = app.config.host + 'user/register' + '?code=' + code + '&encrypted_data=' + encodeURIComponent(_detail.encryptedData) + '&iv=' + encodeURIComponent(_detail.iv) + '&shop_id=' + app.config.shop_id;

          wx.request({
            url: url,
            method: 'GET',
            header: {
              'content-type': 'text/html' // 默认值
            },
            success: function(res) {
              if (res.statusCode == 200) {
                if (res.data.code == 0) {
                  // wx.setStorageSync('token', res.data.token)
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              }
            },
            fail: function(res) {
              console.log(res)
            }
          })
        }
      })
    }
    return

    wx.showModal({
      title: '提示',
      content: '需要授权才能使用完整功能',
      showCancel: false,
      confirmText: '好的',
      confirmColor: '',
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})