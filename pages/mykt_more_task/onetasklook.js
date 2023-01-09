// pages/mykt_more_task/onetasklook.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        now_state: null,
        t2: {
            id: 0,
            name: '',
        },
        set: [
            { lv: -1, name: '未提交', color: '#0599e8' },
            { lv: 0, name: '未批改', color: '#0599e8' },
            { lv: 1, name: '不及格', color: '#ff0000' },
            { lv: 2, name: '及格', color: '#FF6614' },
            { lv: 3, name: '良好', color: '#F3FA65' },
            { lv: 4, name: '优秀', color: '#91FC3E' },
        ],
        showquestion: false,
        question: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var openid = options.openid
        var taskid = options.taskid
        var that = this
        wx.request({
            url: wx.getStorageSync('url') + 'task/onetasklook',
            data: {
                taskid: taskid,
                classid: wx.getStorageSync('classid'),
                openid: openid
            },
            success: function (res) {
                if (res.data != 'error') {
                    that.setData({
                        task: res.data.data,
                        lv: res.data.lv,
                        openid: openid,
                        taskid: taskid,
                    })
                } else if (res.data == 'error') {
                    that.setData({
                        task: "未提交",
                        lv: -1,
                        openid: openid,
                        taskid: taskid,
                    })
                }
            }
        })
    },
    showquestion() {
        this.setData({
            showquestion: !this.data.showquestion,
        })
        if(this.data.question==null){
            this.getquestion()
        }
        
    },
    getquestion() {
        var that = this;
        var taskid = this.data.taskid;
        var classid = wx.getStorageSync('classid');
        wx.request({
            url: wx.getStorageSync('url') + 'task/getquestion',
            data: {
                taskid: taskid,
                classid: classid,
            },
            success: function (res) {
                that.setData({
                    question: res.data,
                })
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        })
    },

    gotoPage: function (options) {
        var lv = options.currentTarget.dataset.data
        var task = this.data.task
        if (task == '未提交') {
            wx.showToast({
                title: '未提交作业,无法评分',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.request({
                url: wx.getStorageSync('url') + 'task/uplv',
                data: {
                    taskid: this.data.taskid,
                    classid: wx.getStorageSync('classid'),
                    openid: this.data.openid,
                    lv: lv
                },
                success: function (res) {
                    console.log(res.data)
                    if (res.data == 'success') {
                        wx.showToast({
                            title: '已提交',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        wx.showToast({
                            title: '提交失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
        }
    },


    Popup(e) {
        var that = this
        that.setData({
            now_state: true
        })

    },
    //点击黑色背景触发的事件
    hideModal(e) {
        //首先创建一个动画对象（让页面不在是一个“死页面”）
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        //animation.translateY(300)中的translate函数是表示在y轴上平移多少px，而后面紧接着的.step表示前面动画的完成，可以开始下一个动画了
        animation.translateY(300).step()
        this.setData({
            /*这里的export函数是导出动画队列，在外米的wxml中会用到该数据，同时export方法在调用完后会清掉前面的动画操作 */
            animationData: animation.export(),
        })
        /*这里的setTimeout是一个延时器，而它在这里延时了200ms，然后在执行动画 */
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                now_state: false,
            })
        }.bind(this), 200)

    },

})