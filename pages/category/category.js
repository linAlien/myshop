const app = getApp();
Page({
  data: {
    device: wx.getSystemInfoSync().windowHeight,
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    main: [{
      title: "种类",
      desc: 'category_id',
      ca: 'category',
      active: true
    }, {
      title: "品牌",
      desc: 'category_brand_id',
      ca: 'brand',
      active: false
    }, {
      title: "年份",
      desc: 'category_years_id',
      ca: 'years',
      active: false
    }],
    isShowFilterMask: false,
    // 返回数据
    data: {},
    choose: {},
    options: {
      category_id: null,
      category_brand_id: null,
      category_years_id: null
    }
  },
  // 多选条件
  filterOptions: function(e) {
    let options = this.data.options;
    let item = e.currentTarget.dataset.item;
    let cate = e.currentTarget.dataset.cate;
    let id = item.id;

    options[cate] == id ? options[cate] = null : options[cate] = id

    this.setData({
      options: options
    })
  },
  // 切换tab栏
  switchCategory: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let ca = this.data.main[index].ca;

    for (var d in this.data.data) {
      if (ca == d) {
        this.setData({
          choose: this.data.data[d]
        })
      }
    }

    for (var i in this.data.main) {
      index == i ? this.data.main[i].active = true : this.data.main[i].active = false
    }

    this.setData({
      choose: _this.data.choose,
      main: _this.data.main
    })
  },
  onLoad: function(options) {
    let _this = this;
    let token = wx.getStorageSync('token');
    // 分类数据加载
    // wx.showLoading({
    //   title: '分类数据加载中..',
    // })
    // 请求分类
    wx.request({
      method: 'GET',
      url: app.config.host + 'category/list?shop_id=' + app.config.shop_id,
      header: {
        // 'content-type': 'text/html'
        'X-Handler': '',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      success: function(res) {
        console.log('详细分页');
        console.log(res);
        if (res.statusCode == 200) {
          _this.setData({
            data: res.data.data
          })

          let e = {
            currentTarget: {
              dataset: {
                index: 0
              }
            }
          }

          _this.switchCategory(e)
          wx.hideLoading();
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 跳转到列表页面
  toGoodListPage: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let id = this.data.choose[index].id;
    let ca = null;

    for (var m in this.data.main) {
      if (this.data.main[m].active) {
        ca = this.data.main[m].desc
      }
    }

    for (var o in this.data.options) {
      o == ca ? this.data.options[o] = id : this.data.options[o] = null
    }

    this.setData({
      options: _this.data.options
    }, this.routerToSearchPage)
  },
  // 跳转到搜索结果页面
  routerToSearchPage: function() {
    let options = this.data.options;
    let init = 0;
    for (var o in options) {
      if (options[o] !== null) {
        init++
      }
    }
    if (init == 0) {
      wx.showModal({
        content: '未选中任何条件',
        showCancel: true,
        confirmText: '好的'
      })
      return
    }

    options = JSON.stringify(options)
    wx.navigateTo({
      url: '../search/search?options=' + encodeURIComponent(options)
    })
  },
  // 显示精确筛选遮罩
  showFilterMask: function() {
    console.log(123);
    let isShowFilterMask = this.data.isShowFilterMask;
    this.setData({
      isShowFilterMask: !isShowFilterMask
    })
  },
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
    this.setData({
      options: {
        category_id: null,
        category_brand_id: null,
        category_years_id: null
      }
    })

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