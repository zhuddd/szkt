// pages/mykt_more_member/mykt_more_member.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classclassid: "",
    stuset: 0,
    stulevel: '',
    stuid: '',
    classdata: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.classclassid = options.classclassid
    this.updata()

  },
  updata: function (e) {
    var that = this
    wx.request({
      url: wx.getStorageSync('url') + 'myclass/getmember/',
      data: {
        classclassid: this.data.classclassid,
        set:'classclass'
      },
      success: res => {
        that.setData({
          classdata: res.data
        })
      }
    })

  },
  more: function (e) {
    if (wx.getStorageSync('mylevel') == '1') {
      this.setData({
        stulevel: e.currentTarget.dataset.level,
        stuid: e.currentTarget.dataset.id,
      })
      if (this.data.stuset == 0) {
        this.setData({
          stuset: 1,
        })
      }
      else {
        this.setData({
          stuset: 0
        })
      }
    }
  },

  more_a: function (e) {
    for (var i = 0; i < this.data.classdata.length; i++) {
      if (this.data.classdata[i].openid == this.data.stuid) {
        if (this.data.classdata[i].level == 2) {
          this.data.classdata[i].level = 3
        }
        else {
          this.data.classdata[i].level = 2
        }
        wx.request({
          url: wx.getStorageSync('url') + 'myclass/updatamember/',
          data: {
            classclassid: this.data.classclassid,
            openid: this.data.classdata[i].openid,
            level: this.data.classdata[i].level,
          },
          success: res => {
            if (res.data == 'success') {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
              this.updata()
              this.setData({
                stuset: 0
              })
            }else{
              wx.showToast({
                title: '操作失败',
                icon: 'none',
                duration: 2000
              })
            }

          }
        })

      }
    }
  },
  more_b: function (e) {
    wx.request({
      url: wx.getStorageSync('url') + 'myclass/delmember/',
      data: {
        classid: wx.getStorageSync('classid'),
        openid: this.data.stuid,
      },
      success: res => {
        if (res.data == 'success') 
        {this.updata()
        this.setData({
          stuset: 0
        })}
      }
    })
  },

})