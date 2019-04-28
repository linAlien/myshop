const app = getApp();
Page({
  data: {
    device: wx.getSystemInfoSync().windowHeight,
    // 总分类
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
    // 所有分类
    all: [],
    choose: [],
    // 已经选中
    choosed: [],
    currentCategoryIndex: 0
  },
  // 切换tab栏
  switchCategory: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let ca = this.data.main[index].ca;

    for (let i = 0; i < this.data.main.length; i++) {
      if (i == index) {
        this.data.main[i].active = true
      } else {
        this.data.main[i].active = false
      }
    }
    let array = [];
    for (var key in this.data.all) {
      if (this.data.all[key].ca == ca) {
        array.push(this.data.all[key]);
      }
    }

    for (var c in this.data.choosed) {
      let ca = this.data.choosed[c];

      for (var a in array) {
        if (array[a].id == ca.id && array[a].ca == ca.ca) {
          array[a].choose = true;
        }
      }
    }

    this.setData({
      choose: array,
      main: that.data.main,
      currentCategoryIndex: index
    })
  },
  // 加载事件钩子
  onLoad: function(options) {
    wx.showLoading({
      title: '分类数据加载中间',
    })
    let _this = this;
    // 请求分类
    wx.request({
      method: 'GET',
      url: app.config.host + '/shop/goods/category/extend?resUsersID=' + app.config.resUsersID,
      header: {
        'content-type': 'text/html' // 默认值
      },
      success: function(res) {
        if (res.statusCode == 200) {
          let all = [];
          for (var ob in res.data.data) {
            for (var c in res.data.data[ob]) {
              res.data.data[ob][c].choose = false
              res.data.data[ob][c].ca = ob
            }
            all = all.concat(res.data.data[ob])
          }
          _this.setData({
            all: all
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
    let id = this.data.choose[index].id
    let ischoose = this.data.choose[index].choose;
    let ca = this.data.choose[index].ca;


    // 已经选中状态
    if (ischoose) {
      for (var c in this.data.choose) {
        this.data.choose[c].choose = false;
      }

      for (var c in this.data.choosed) {
        if (this.data.choosed[c].ca == ca && this.data.choosed[c].id == id) {
          this.data.choosed.splice(c, 1);
        }
      }


    } else {
      for (var c in this.data.choose) {
        if (c == index) {
          this.data.choose[c].choose = true;
        } else {
          this.data.choose[c].choose = false;
        }
      }

      this.data.choosed.push(this.data.choose[index]);

      for (var c in this.data.choosed) {
        if (this.data.choosed[c].ca == ca && this.data.choosed[c].id !== id) {
          console.log(c);
          this.data.choosed.splice(c, 1);
        }
      }
    }

    this.setData({
      all: _this.data.all,
      choose: _this.data.choose,
      choosed: _this.data.choosed
    })

    return;
  },
  routeToSearchPage: function() {
    let choosed = this.data.choosed;
    let _choosed = JSON.stringify(choosed);

    console.log(JSON.parse(_choosed));

    wx.navigateTo({
      url: '../search/search?array=' + encodeURIComponent(_choosed)
    })

    // wx.navigateTo({
    //   url: '../search/search?category=' + desc + '&categoryId=' + id
    // })

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
      choosed: [],
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})