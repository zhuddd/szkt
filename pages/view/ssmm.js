// ssmm.js

var arrCircle = []      // 记录所有的圆
var arrSelCircle = []   // 记录选中的圆
var canvasTop = 0       // 画布的上边距
var canvasLeft = 0      // 画布的左边距
var lockString = ''     // 记录密码
var pathX = 0           // 记录手势 x 坐标
var pathY = 0           // 记录手势 y 坐标
var ctx = ''            // 画布对象

Component({

  // 属性
  properties: {

  },

  // 数据
  data: {
    arrState: [0,0,0,0,0,0,0,0,0]
  },

  // 组件生命周期
  lifetimes: {
    // 视图层布局完成后执行
    ready: function() {
      // 画布实例，在组件中要绑定 this，page 中不用
      ctx = wx.createCanvasContext('canvas', this)

      // 选择器实例，在组件中要绑定 this，page 中不用
      const query = wx.createSelectorQuery().in(this)

      // 获取画布位置
      query.select('#canvas').boundingClientRect(function (res) {
        canvasTop = res.top
        canvasLeft = res.left
      })

      // 获取9个圆的位置
      query.selectAll('.circle').boundingClientRect(function (res) {
        arrCircle = res
      })
      query.exec()
    }
  },

  // 方法
  methods: {
    onTouchStart:function (e) {
      for(const i in arrCircle){
        const circle = arrCircle[i]
        const r = circle.width / 2  
        const a = circle.left + r - canvasLeft
        const b = circle.top + r - canvasTop
        if ( Math.abs(a - e.touches[0].x) < r && Math.abs(b - e.touches[0].y) < r ) {
          if (arrSelCircle.indexOf(circle) == -1) {
            arrSelCircle.push(circle)
            lockString += parseInt(i) + 1

            this.data.arrState[i] = 1
            this.setData({
              arrState:this.data.arrState
            })
          }
          break;
        }
      }
    },

    onTouchMove:function (e) {
      for(const i in arrCircle){
        const circle = arrCircle[i]
        const r = circle.width / 2              //半径 r
        // 计算圆心。手势点的位置相对于画布，而圆的位置相对于屏幕，圆心的位置改成相对于画布就要减去画布的左上偏移
        const a = circle.left + r - canvasLeft  
        const b = circle.top + r - canvasTop    
        // 计算手势点是否在圆上
        if ( Math.abs(a - e.touches[0].x) < r && Math.abs(b - e.touches[0].y) < r ) {
          // 如果还未记录当前的圆
          if (arrSelCircle.indexOf(circle) == -1) {
            arrSelCircle.push(circle)
            lockString += parseInt(i) + 1

            this.data.arrState[i] = 1
            this.setData({
              arrState:this.data.arrState
            })
          }
          break;
        }
      }

      pathX = e.touches[0].x
      pathY = e.touches[0].y
      this._drawLine()
    },

    onTouchEnd:function (e) {
      if (arrSelCircle.length) {
        
        var params = {
          lock: lockString
        }
        // 回调，传出手势密码
        this.triggerEvent('getlock', params)

        arrSelCircle = []
        lockString = ''
        pathX = 0
        pathY = 0

        this.setData({
          arrState: [0,0,0,0,0,0,0,0,0]
        })

        // 清空画布
        // ctx.clearRect(0,0,3000,3000)
        ctx.draw(false)
      }
    },

    _drawLine:function () {
      if (arrSelCircle.length) {
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'

        for(const i in arrSelCircle) {
          const circle = arrSelCircle[i]
          const r = circle.width / 2              //半径 r
          const a = circle.left + r - canvasLeft  //圆心 x
          const b = circle.top + r - canvasTop    //圆心 y

          if (!parseInt(i)) {
            ctx.moveTo(a,b)
          } else {
            ctx.lineTo(a,b)
          }
        }

        if (pathX && pathY)  {
          ctx.lineTo(pathX, pathY)
        }

        ctx.stroke()
        ctx.closePath()
        ctx.draw(false)
      }
    }
  }
})

