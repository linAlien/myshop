const app = getApp()
let page = 0;

Page({
  data: {
    // 获取设备宽度
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    // 是否已经全部加载完
    isLoadAll: false,
    // 商品分类为null
    isCategoryNull: false,
    // 轮播图
    banners: [],
    // 分类
    category: [],
    // 特价
    conpon: [],
    recommed: []
  },

  onLoad: function() {
    // 设置成app.js中设置的标题
    // wx.setNavigationBarTitle({
    //   title: app.config.shopName,
    // })
    // 登陆请求
    this.wxLoginRequset();

    // 执行请求函数
    this.getGoodsList();
    this.getCategory();
    this.getBannerList();
  },
  // 登陆请求
  wxLoginRequset: function(callback) {
    let _this = this;
    wx.login({
      success: function(res) {
        let short = res.code;
        _this.setData({
          code: short
        })
        let url = app.config.host + 'user/auth/login?code=' + short + '&shop_id=' + app.config.shop_id
        // console.log(url);

        wx.request({
          url: url,
          method: 'POST',
          header: {
            'X-Handler': '',
            //'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          success: function(res) {
            // console.log(res.data.data.token);
            // if (res.statusCode == 200) {
            //   if (res.data.code == 0) {
                wx.setStorageSync('token', res.data.data.token)
                wx.setStorageSync('user', {
                  nick: res.data.name,
                  avatar_url: res.data.avatar_url
                });

                // app.config.token = res.data.token;
               console.log(wx.getStorageSync('token'));
                

                // app.config.shopInfoAndTel.address = res.data.address;
                // app.config.shopInfoAndTel.tel = res.data.linkman;
                // app.config.shopInfoAndTel.longitude = res.data.longitude;
                // app.config.shopInfoAndTel.latitude = res.data.latitude;

                wx.switchTab({
                  url: '../index/index',
                })
            //   } else {
            //     wx.hideLoading();
            //   }
            // } else {
            //   wx.showModal({
            //     title: '提示',
            //     content: '请求失败 错误码' + res.statusCode,
            //   })

            // }
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
  // 获取banner轮播图片
  getBannerList: function() {
    let _this = this;
    let token = wx.getStorageSync('token');

    wx.request({
      method: 'GET',
      header: {
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      url: app.config.host + 'banner/list?shop_id=' + app.config.shop_id,

      success: function(res) {
        // console.log(res.data.data);
        if (res.statusCode == 200) {

          // let banners_list = [];

          // for (let _=0; _ <= res.data.data.count; _++){
          //   banners_list.concat(res.data.data.entries[_]);
          // }
          console.log(res.data.data.entries);
          _this.setData({
            banners: res.data.data.entries
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 获取分类数据
  getCategory: function() {
    let _this = this;
    let token = wx.getStorageSync('token');
    wx.request({
      method: 'GET',
      // url: app.config.host + 'goods/category/extend?shop_id=' + app.config.shop_id,
      url: app.config.host + 'category/list?shop_id=' + app.config.shop_id,
      header: {
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      success: function(res) {
        console.log('分类数据');
        console.log(res.data.data);
        if (res.statusCode == 200) {
          switch (res.data.data.code) {
            case 0:
              // 普通分类
              let category = [];
              // 特价活动
              let coupon = [];
              for (var r in res.data.data.category) {
                if (res.data.data.category[r].name.includes('特价') === true) {
                  coupon.push(res.data.data.category[r])
                } else {
                  category.push(res.data.data.category[r])
                }
              }

              _this.setData({
                category: res.data.data.entries,
                coupon: coupon
              })
              break;

            case 1:
              break;

            case 404:
              _this.setData({
                isCategoryNull: true
              })
              break;
          }
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 获取商品列表
  getGoodsList: function() {
    let _this = this;
    let shop_id = app.config.shop_id;
    let token = wx.getStorageSync('token');

    wx.request({
      method: 'GET',
      url: app.config.host + 'goods/list?page=' + page + '&shop_id=' + shop_id,
      header: {
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    },
      success: function(res) {
        console.log('商品列表');
        console.log(res.data.data);
        if (res.statusCode == 200) {
          if (res.data.data.length == 0) {
            _this.setData({
              isLoadAll: true
            })
          } else {
            let old = _this.data.recommed
            console.log('商品列表list');
            console.log(res.data.data.entries);
            _this.setData({
              recommed: old.concat(res.data.data.entries)
            })
          }
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  toGoodDetail: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;


    if (this.data.banners[index].businessId) {
      let goods_id = this.data.banners[index].businessId
      wx.navigateTo({
        url: '../gooddetail/gooddetail?goods_id=' + goods_id,
      })
    } else {
      wx.previewImage({
        urls: [_this.data.banners[index].picUrl],
        current: _this.data.banners[index].picUrl
      })
    }
  },
  // 轮播图点击跳转
  bannerToGoodDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let goods_id = this.data.banners[index].id

    wx.navigateTo({
      url: '../gooddetail/gooddetail?goods_id=' + goods_id,
    })
  },
  // 点击分类跳转
  RoutertoSearch: function(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data[e.currentTarget.dataset.key][index].id;

    let options = JSON.stringify({
      category_id: id
    });

    wx.navigateTo({
      url: '../search/search?options=' + encodeURIComponent(options)
    })
  },
  // 商品列表点击跳转
  toProductDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let goods_id = this.data.recommed[index].category_ids[0].id;

    wx.navigateTo({
      url: '../gooddetail/gooddetail?goods_id=' + goods_id,
    })
  },
  onReachBottom: function() {
    if (!this.data.isLoadAll) {
      page++;
      this.getGoodsList();
    }
  },
  onShareAppMessage: function() {

  }
})