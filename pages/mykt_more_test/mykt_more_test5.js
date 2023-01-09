// pages/mykt_more_test/mykt_more_test5.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        xx: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var testid = options.testid
        if (options.openid) {
            var openid = options.openid
        } else {
            var openid = wx.getStorageSync('user_data').openid
        }
        if (options.superuser) {
            var superuser = options.superuser
        } else {
            var superuser = false
        }
        this.setData({
            superuser: superuser,
            openid: openid,
        })
        var classid = wx.getStorageSync('classid')
        var that = this
        wx.request({
            url: wx.getStorageSync('url') + 'stutest/gettest',
            data: {
                testid: testid,
                classid: classid,
                openid: openid
            },
            success: function (res) {
                that.setData({
                    titel: res.data[0].titel,
                    testid: res.data[0].testid,
                    set: res.data[0].set,
                    questionList: JSON.parse(res.data[0].data),
                    do: res.data[1]
                })
                if (res.data[1]) {
                    that.setData({
                        cj: JSON.parse(res.data[0].cj),
                    })
                }
            }
        })
    },
    check(e) {
        let value = e.detail.value;
        if (value.length > 0) {
            var check = true;
        } else {
            var check = false;
        }
        let index = this.data.index;
        let option = this.data.questionList[index].option;
        for (let i = 0; i < option.length; i++) {
            option[i].checked = false;
        }
        for (let i = 0; i < value.length; i++) {
            option[value[i]].checked = true;
        }
        this.setData({
            ['questionList[' + index + '].option']: option,
            ['questionList[' + index + '].check']: check,
        })
    },
    pre() {
        let index = this.data.index;
        if (index > 0) {
            index--;
            this.setData({
                index
            })
        } else {
            wx.showToast({
                title: '已经是第一题了',
                icon: 'none',
                duration: 2000
            })
        }
    },
    next() {
        let index = this.data.index;
        if (index < this.data.questionList.length - 1) {
            index++;
            this.setData({
                index
            })
        } else {
            wx.showToast({
                title: '已经是最后一题了',
                icon: 'none',
                duration: 2000
            })
        }
    },
    back() {
        let group;
        group = true;
        this.setData({
            group
        })
    },
    open(e) {
        let index = e.currentTarget.dataset.no;
        let group;
        group = false;
        this.setData({
            index,
            group
        })
    },
    endtap() {
        let questionList = this.data.questionList;
        let allcheck = true;
        var that=this
        for (let i = 0; i < questionList.length; i++) {
            if (!questionList[i].check) {
                allcheck = false;
            }
        }
        if (!allcheck) {
            wx.showModal({
                title: '提示',
                content: '存在题目未答，是否继续提交？',
                success: function (res) {
                    if (!res.confirm) {
                        return;
                    } else {
                        that.end()
                    }
                }
            })
        }else{
            that.end()
        }
    },
    end() {
        let questionList = this.data.questionList;
        let cj1 = 0;
        let cj2 = [];
        var that = this
        for (let i = 0; i < questionList.length; i++) {
            let option = questionList[i].option;
            let answer = true;
            for (let j = 0; j < option.length; j++) {
                if (option[j].checked != option[j].isanswer) {
                    answer = false;
                }
            }
            if (answer) {
                cj1++;
            }
            cj2.push(answer);
        }
        let fs = cj1 * 100 / questionList.length;
        let fs1 = fs.toFixed(2);
        let fs2=fs1.toString()+"%"
        console.log(fs1)
        let cj = [fs1, fs2, cj2];
        wx.request({
            url: wx.getStorageSync('url') + 'stutest/addcj',
            data: {
                testid: that.data.testid,
                openid: wx.getStorageSync('user_data').openid,
                cj: cj,
                data: questionList
            },
            success: function (res) {
                if (res.data == 'success') {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }
            }
        })
    },
})