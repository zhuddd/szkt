// pages/mykt_more_sign/mykt_more_sign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lista: [],
    listb: [],
    list: '',
    showadd: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if (wx.getStorageSync('mylevel') == '1') {
      this.setData({
        showadd: true,
      })
    }
    this.getlist()

    getApp().watch('msg', this.watchBack);
  },
  watchBack: function (name, value) {
    if (value.classid!=wx.getStorageSync('classid')){
      return
  }
    if (value.data == 'sign') {
      this.getlist()
    }
  },

  getlist: function () {
    var that = this
    wx.request({
      url: wx.getStorageSync('url') + 'signin/signin',
      data: {
        set: 'getall',
        classid: wx.getStorageSync('classid'),
      },
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].signset = JSON.parse(res.data[i].signset)
        }
        that.setData({
          list: res.data,
        })
        that.breaklist()
      }
    })

  },
  breaklist: function (e) {
    var time = new Date().getTime()
    var that = this
    var lista = []
    var listb = []
    for (var i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].signset.type == 'qd') {
        if (this.data.list[i].signset.starttime > time) {         //未开始
          this.data.list[i].signset.end = '0'
        } else if (this.data.list[i].signset.endtime < time) {     //已结束
          this.data.list[i].signset.end = '1'
        } else {
          this.data.list[i].signset.end = '2'                  //进行中
        }
        lista.unshift(this.data.list[i])
      }
      else {
        listb.unshift(this.data.list[i])
      }
    }
    that.setData({
      lista: lista,
      listb: listb,
    })
  },
  tap: function (e) {
    var signid = e.currentTarget.dataset.signid
    var end = e.currentTarget.dataset.end
    for (var i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].signid == signid) {
        var signset = this.data.list[i].signset
        break
      }
    }
    if (wx.getStorageSync('mylevel') == '1') {
      wx.navigateTo({
        url: '../mykt_more_sign/mykt_more_sign2?signid=' + signid + '&end=' + end,
      })
    } else {
      wx.navigateTo({
        url: '../mykt_more_sign/mykt_more_sign4?signid=' + signid + '&end=' + end + '&signset=' + JSON.stringify(signset),
      })
    }
  },
  add_tap: function (e) {
    wx.navigateTo({
      url: '../mykt_more_sign/mykt_more_sign3',
    })
  }
})