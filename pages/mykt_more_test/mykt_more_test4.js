// pages/mykt_more_test/mykt_more_test4.js
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        questionList: [{}],
        xx: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        index: 0,
        group: false,
        fabu: false,
        title: '',
        kaishi: 'true',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        if (wx.getStorageSync('test')) {
            wx.showModal({
                title: '提示',
                content: '检测到草稿，是否继续编辑？',
                success: function (res) {
                    if (res.confirm) {
                        var value = wx.getStorageSync('test')
                        that.setData({
                            questionList: value.questionList,
                            title2: value.title
                        })
                    }
                }
            })
        }
        this.setData({
            title2: util.formatTime(new Date())
        })
    },
    open(e) {
        var index = e.currentTarget.dataset.id;
        this.setData({
            group: !this.data.group,
            index: index
        })
    },
    fabu() {
        this.setData({
            fabu: !this.data.fabu
        })
    },
    add() {
        let index = this.data.index;
        if (this.data.questionList[index].option == null) {
            this.data.questionList[index].option = [];
        }
        let option = this.data.questionList[index].option;
        option.push({
            data: null,
            isanswer: false,
            checked: false,
        })
        this.setData({
            ['questionList[' + index + '].option']: option,
        })
    },
    questioninput(e) {
        let index = this.data.index;
        this.setData({
            ['questionList[' + index + '].question']: e.detail.value,
        })
    },
    optioninput(e) {
        let index = this.data.index;
        let option = this.data.questionList[index].option;
        let id = e.currentTarget.dataset.id;
        let value = e.detail.value;
        option[id].data = value;
        this.setData({
            ['questionList[' + index + '].option']: option,
        })
    },
    check(e) {
        let value = e.detail.value;
        if (value.length == 1) {
            var type = 1;
        } else if (value.length > 1) {
            var type = 2;
        }
        let index = this.data.index;
        let option = this.data.questionList[index].option;
        for (let i = 0; i < option.length; i++) {
            option[i].isanswer = false;
        }
        for (let i = 0; i < value.length; i++) {
            option[value[i]].isanswer = true;
        }
        this.setData({
            ['questionList[' + index + '].option']: option,
            ['questionList[' + index + '].type']: type,
        })
    },
    delxx: function (e) {
        let id = e.currentTarget.dataset.id;
        let index = this.data.index;
        let option = this.data.questionList[index].option;
        option.splice(id, 1);
        this.setData({
            ['questionList[' + index + '].option']: option,
        })
    },
    del(e) {
        let index = this.data.index;
        if (this.data.questionList.length == 1) {
            wx.showToast({
                title: '至少保留一道题',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (index == 0) {
            this.data.questionList.splice(index, 1);
            this.setData({
                questionList: this.data.questionList,
                index: index,
            })
        } else {
            this.data.questionList.splice(index, 1);
            this.setData({
                questionList: this.data.questionList,
                index: index - 1,
            })
        }
    },
    next() {
        let index = this.data.index + 1;
        if (this.data.questionList[index] == null) {
            this.setData({
                index: index,
                ['questionList[' + index + ']']: {},
            })
        } else {
            this.setData({
                index: index,
            })
        }
    },
    addquestion() {
        let index = this.data.questionList.length;
        this.setData({
            index: index,
            ['questionList[' + index + ']']: {},
            group: false,
        })
    },
    back() {
        let index = this.data.index;
        if (index > 0) {
            this.setData({
                index: index - 1,
            })
        } else {
            wx.showToast({
                title: '已经是第一题了',
                icon: 'none',
                duration: 2000
            })
        }
    },
    list() {
        this.setData({
            group: !this.data.group,
        })
    },

    titleinput(e) {
        this.setData({
            title: e.detail.value,
        })
    },
    testset(e) {
        var kaishi = e.detail.value;
        console.log(kaishi)
        this.setData({
            kaishi: kaishi,
        })
    },
    endtap() {
        try {
            var that = this;
            var questionList = that.data.questionList;
            var notanswer = [];
            var notquestion = [];
            for (var i = 0; i < questionList.length; i++) {
                let hasanswer = false;
                for (var j = 0; j < questionList[i].option.length; j++) {
                    if (questionList[i].option[j].isanswer == true) {
                        hasanswer = true;
                    }
                }
                if (questionList[i].question == null || questionList[i].question == '') {
                    notquestion.push(i + 1);
                }
                if (hasanswer == false) {
                    notanswer.push(i + 1);
                }
            }
            if (notquestion.length > 0) {
                wx.showModal({
                    title: '未设问题，是否继续提交？',
                    content: '包含题号有：' + notquestion,
                    success: function (res) {
                        if (res.confirm && notanswer.length > 0) {

                            wx.showModal({
                                title: '未设答案，是否继续提交？',
                                content: '包含题号有：' + notanswer,
                                success: function (res) {
                                    if (res.confirm) {
                                        that.end();
                                    } else {
                                        return;
                                    }
                                }
                            })
                        } else if (res.confirm && notanswer.length == 0) {
                            that.end();
                        } else {
                            return;
                        }
                    }
                })
            } else if (notanswer.length > 0) {
                wx.showModal({
                    title: '未设答案，是否继续提交？',
                    content: '包含题号有：' + notanswer,
                    success: function (res) {
                        if (res.confirm) {
                            that.end();
                        } else {
                            return;
                        }
                    }
                })
            } else {
                that.end();
            }
        } catch (e) {
            wx.showToast({
                title: '请检查题目是否完整',
                icon: 'none',
                duration: 2000
            })
        }
    },
    end() {
        var that = this;
        if (this.data.title == '') {
            var title = this.data.title2;
        } else {
            var title = this.data.title;
        }
        var questionList = this.data.questionList;
        var testid = new Date().getTime();
        var kaishi = this.data.kaishi;
        var classid = wx.getStorageSync('classid')
        if (kaishi == 'true') {
            wx.request({
                url: wx.getStorageSync('url') + 'stutest/addtest',
                data: {
                    testid: testid,
                    title: title,
                    questionList: questionList,
                    classid: classid,
                    set: 1,
                },
                success(res) {
                    if (res.data == 'success') {
                        that.setData({
                            save: true,
                        })
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            duration: 2000
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                    } else {
                        wx.showToast({
                            title: '发布失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
        } else {
            var data = {
                title: title,
                questionList: questionList,
            }
            wx.setStorageSync('test', data);
            wx.navigateBack({
                delta: 1
            })
        }
    },
    onUnload() {
        if (this.data.save) {
            return
        }
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否保存草稿？',
            success: function (res) {
                if (res.confirm) {
                    var title = that.data.title;
                    if (title == '') {
                        var title = that.data.title2;
                    }
                    var questionList = that.data.questionList;
                    var data = {
                        title: title,
                        questionList: questionList,
                    }
                    wx.setStorageSync('test', data);
                }
            }
        })
    },
    onHide() {

    },
})