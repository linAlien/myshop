const app = getApp();
let page = 0;
let url = "";
Page({
  data: {
    deviceWidth: wx.getSystemInfoSync().windowWidth,
    // 提示文本初始化
    str: "",
    goodList: [],
    // 搜索关键词
    searchKey: '',
    _arr: [],
    isLoadAll: false,
    // 是否是搜索
    isSearchMode: false,
    options: {}
  },
  onLoad: function(options) {
    page = 0;
    if (options.options) {
      let _a = decodeURIComponent(options.options);
      let _opt = JSON.parse(_a);
      let str = '';

      this.setData({
        options: _opt
      })

      for (var s in _opt) {
        if (_opt[s] !== null) {
          str = str + s + '=' + _opt[s] + '&'
        }
      }

      url = app.config.host + '/shop/goods/list_extra?' + str + 'page=' + page + '&num=8&shop_id=' + app.config.shop_id;
      this.setData({
        str: '正在加载...',
      })
      this.searchRequest(url);
    } else {
      // 点击搜索进入本页面 更新为搜索模式
      this.setData({
        isSearchMode: true,
        isLoadAll: true,
        str: '在搜索框中输入关键词'
      })
    }
  },
  // 输入框失去焦点
  blurAndRequest: function() {
    if (this.data.searchKey) {
      page = 0;
      this.setData({
        isSearchMode: true,
        isLoadAll: false,
        goodList: [],
        str: '正在加载'
      })

      url = app.config.host + '/shop/goods/list_extra?shop_id=' + app.config.shop_id + '&page=' + page + '&num=8&name=' + this.data.searchKey;
      this.searchRequest(url);
    }
  },
  // 获取关键词更新到状态里面
  getSearchKey: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  //搜索请求和分类请求
  searchRequest: function(url) {
    let _this = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-Type': 'text/html'
      },
      success: function(res) {
        if (res.statusCode == 200) {
          let old = _this.data.goodList;
          switch (res.data.code) {
            case 0:
              if (res.data.data.length == 0) {
                _this.setData({
                  str: "没有更多商品了",
                  isLoadAll: true
                })
                return
              }
              _this.setData({
                goodList: old.concat(res.data.data),
                str: res.data.data.length < 8 ? "没有更多商品了" : "正在加载..."
              })
              break;
            case -1:
              _this.setData({
                str: '请求失败,请稍后再试',
                isLoadAll: true
              })
              break;
            case 404:
              _this.setData({
                str: "没有更多商品了",
                isLoadAll: true
              })
              break;
          }
        }
      },
      fail: function() {}
    })
  },
  // 商品列表点击跳转
  toProductDetail: function(e) {
    let index = e.currentTarget.dataset.index;
    let goods_id = this.data.goodList[index].id
    wx.navigateTo({
      url: '../gooddetail/gooddetail?goods_id=' + goods_id,
    })
  },
  onReachBottom: function() {
    if (!this.data.isLoadAll) {
      page++;
      if (this.data.isSearchMode) {
        url = app.config.host + '/shop/goods/list_extra?shop_id=' + app.config.shop_id + '&page=' + page + '&num=8&name=' + this.data.searchKey;
        this.searchRequest(url);
      } else {
        let str = '';
        let _opt = this.data.options;
        for (var s in _opt) {
          if (_opt[s] !== null) {
            str = str + s + '=' + _opt[s] + '&'
          }
        }

        url = app.config.host + '/shop/goods/list_extra?' + str + 'page=' + page + '&num=8&shop_id=' + app.config.shop_id;
        this.setData({
          str: '正在加载...',
        })
        this.searchRequest(url);
      }
    }
  }
})