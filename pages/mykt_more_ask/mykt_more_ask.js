// pages/mykt_more_ask/mykt_more_ask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classid: "",
    student: [],
    backgrounda: "#1EA9FF",
    backgroundb: "#D8D8D8",
    set: "a",
    asklist: '',
  },

  onLoad: function (options) {
    var classid = wx.getStorageSync('classid')
    var level = wx.getStorageSync('mylevel')
    if (level == '1') {
      var isshow = true
      var height = '50%'
    } else {
      var isshow = false
      var height = '80%'
    }
    this.setData({
      classid: classid,
      isshow: isshow,
      height: height
    }),
    this.getasklist()
    this.updata()
    getApp().watch('msg', this.watchBack);
  },
  watchBack: function (name, value) {
    if (value.classid!=wx.getStorageSync('classid')){
      return
  }
    if (value.data == 'ask') {
      this.getasklist()
    }
  },
  updata: function (e) {
    var that = this;
    wx.request({
      url: wx.getStorageSync('url') + 'myclass/getmember/',
      data: {
        classid: this.data.classid,
        set: 'class'
      },
      success: function (res) {
        that.setData({
          student: res.data,
        });
      }
    });

  },
  addone(e) {
    var that = this;
    wx.request({
      url: wx.getStorageSync('url') + 'ask/add/',
      data: {
        classid: this.data.classid,
        stuopenid: e
      },
      success: function (res) {
        if (res.data == 'success') {
          that.sendmsg()
        } else {
          wx.showToast({
            title: 'error',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  sendmsg: function () {                       //发送更新消息
    var that = this;
    wx.sendSocketMessage({
      data: '{"classid":"' + this.data.classid + '","type":"msg","msg":"ask"}',
    })
  },
  getasklist(e) {
    var that = this;
    wx.request({
      url: wx.getStorageSync('url') + 'ask/getlist/',
      data: {
        classid: this.data.classid,
      },
      success: function (res) {
        if (res.data == 'error') {
          wx.showToast({
            title: '获取失败',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            asklist: res.data,
          });
        }
      }
    });
  },
  delask(e) {
    var that = this;
    wx.request({
      url: wx.getStorageSync('url') + 'ask/delask/',
      data: {
        classid: this.data.classid,
      },
      success: function (res) {
        if (res.data == 'success') {
          that.sendmsg()
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },

  sj() {
    this.setData({
      backgrounda: "#1EA9FF",
      backgroundb: "#D8D8D8",
      set: "a",
    })
    this.updata()
  },

  sx() {
    this.setData({
      backgrounda: "#D8D8D8",
      backgroundb: "#1EA9FF",
      set: "b",
    })
    this.updata()
  },


  next: function (e) {

    if (this.data.set == "a") {
      this.sjcq()
    }
    else {
      this.sxcq()
    }
  },


  sjcq: function (e) {        //随机抽取
    var that = this;
    //获取将要抽取的学生在列表中的序号
    var index = Math.floor(Math.random() * that.data.student.length);
    var student = that.data.student[index];
    //去除这个学生
    that.data.student.splice(index, 1);
    if (student != undefined) {  //学生存在
      that.addone(student.openid)
    }
    else {                      //学生不存在
      wx.showToast({
        title: '再次点击进行下一轮',
        icon: 'none',
      })
      this.updata()
    }
  },


  sxcq: function (e) {                                          //顺序抽取
    var that = this;
    var student = that.data.student[0];
    that.data.student.splice(0, 1)
    if (student != undefined) {
      that.addone(student.openid)
    }
    else {
      wx.showToast({
        title: '再次点击从头开始',
        icon: 'none',
      })
      this.updata()
    }
  },


  qc: function (e) {
    this.delask()
  },

})