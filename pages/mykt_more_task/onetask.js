// pages/mykt_more_task/onetask.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        taskid: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        that.setData({
            taskid: wx.getStorageSync('taskid'),
        })
        wx.request({
            url: wx.getStorageSync('url') + 'task/onetask',
            data: {
                taskid:wx.getStorageSync('taskid'), 
                classid: wx.getStorageSync('classid')
            },
            success: function (res) {
                that.setData({
                    task: that.quickSort(res.data)
                })
            }
        })
    },
    quickSort(arr) {
        if (arr.length <= 1) {
            return arr
        }
        var pivotIndex = Math.floor(arr.length / 2)
        var pivot = arr.splice(pivotIndex, 1)[0]
        var left = []
        var right = []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].lv < pivot.lv) {
                left.push(arr[i])
            } else {
                right.push(arr[i])
            }
        }
        return this.quickSort(left).concat([pivot], this.quickSort(right))
    },
    onShow() {
        this.onLoad()
    },
    tap: function (e) {
        var openid=e.currentTarget.dataset.openid
        var taskid=this.data.taskid
        wx.navigateTo({
            url: '../mykt_more_task/onetasklook' + '?openid=' + openid + '&taskid=' + taskid,
        })
    },

})