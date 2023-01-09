Page({

  /**
  * 页面的初始数据
  */
  data: {
    class_id: "",
    tp: [],
  },


  onShow: function () {
    var that = this;
    var mylevel = wx.getStorageSync('mylevel');
    if (mylevel == 1) {
      that.setData({
        showadd: true,
      })
    }
    this.getdata();
    getApp().watch('msg', this.watchBack);
  },
  getdata: function () {
    var that = this;
    wx.request({
      url: wx.getStorageSync('url') + 'vote/getall/',
      data: {
        classid: wx.getStorageSync('classid')
      },
      success: function (res) {
        that.breakdata(res.data);
      }
    });
  },
  watchBack: function (name, value) {
    if (value.classid!=wx.getStorageSync('classid')){
      return
  }
    if (value.data == 'vote') {
      this.getdata()
    }
  },
  breakdata: function (e) {
    var that = this;
    var data = [];
    var tp=[];
    if(wx.getStorageSync('mylevel')==1){
      data=e;
    }else{
      var a = [];
      for (var i = 0; i < e.length; i++) {
        if (e[i].set != '保存') {
          a.push(e[i]);
        }
      }
      data=a;
    }
    for (var i = 0; i < data.length; i++) {
      tp.unshift(data[i]);
    }
    that.setData({
      tp: tp,
    })
  },
  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    var set = e.currentTarget.dataset.set;
    var data = [];
    var mylevel = wx.getStorageSync('mylevel');
    for (var i = 0; i < this.data.tp.length; i++) {
      if (this.data.tp[i].voteid == id) {
        data.push(this.data.tp[i])
      }
    }
    if (set == "保存" && mylevel == 1) {
      wx.navigateTo({
        url: '../mykt_more_vote/mykt_more_vote3?alldata=' + JSON.stringify(data)+'&tag=1',
      })
    }else if(mylevel == 1){
      wx.navigateTo({
        url: '../mykt_more_vote/mykt_more_vote2?alldata=' + JSON.stringify(data),
      })
    }else{
      wx.navigateTo({
        url: '../mykt_more_vote/mykt_more_vote5?data=' + JSON.stringify(data),
      })
    }
  },
  add_tap: function () {
    wx.navigateTo({
      url: '../mykt_more_vote/mykt_more_vote3',
    })
  }
})