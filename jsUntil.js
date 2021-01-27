let pinyin = require('../littleUtils/ConvertPinyin')
let timerTask = (function (_this) {
  let timerArry = []
  let timerDic = {}
  let TimerTask = function () {

  }
  TimerTask.prototype = {
    addTimer (fun, zebu, cId) {
      if (zebu === undefined) {
        zebu = 1000
      }
      let id = 1
      if (cId !== undefined) {
        id = cId
      }
      if (!this.existTimer(id)) {
      } else {
        this.delTimer(id)
      }
      let that = this
      let interval = setInterval(function () {
        try {
          if (that.existTimer(id)) {
            fun()
            timerDic[id] = true
          } else {
            clearInterval(interval)
          }
        } catch (e) {
          console.log(e)
          that.delTimer(id)
        }
      }, zebu)

      timerArry.push({id: id,
        fun: interval})
      try {
        fun()
        timerDic[id] = true
      } catch (e) {
        console.log(e)
        that.delTimer(id)
      }

      return id
    },
    delTimer (id) {
      timerDic[id] = false
      let temp = []
      console.log(timerArry)
      timerArry.forEach(res => {
        if (res.id !== id) {
          temp.push(res)
        } else {
          clearInterval(res.fun)
        }
      })
      timerArry = temp
    },
    existTimer (id) {
      return timerDic[id] === undefined ? false : timerDic[id]
    }
  }
  return new TimerTask()
})()
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
class JsUtil {
  constructor () {
    this.timerTask = timerTask
  }
  guid () {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    )
  }
  drag (oDrag, handle) {
    let disX = 0
    let disY = 0
    handle = handle || oDrag
    handle.style.cursor = 'move'
    handle.onmousedown = function (e) {
      e = e || event
      e.preventDefault()
      disX = e.clientX - oDrag.offsetLeft
      disY = e.clientY - oDrag.offsetTop
      document.onmousemove = function (e) {
        e = e || event
        let Left = e.clientX - disX
        let Top = e.clientY - disY
        let maxleft = document.documentElement.offsetWidth - oDrag.offsetWidth
        let maxtop = document.documentElement.clientHeight - oDrag.offsetHeight
        if (Left < 0) {
          Left = 0
        } else if (Left > maxleft) {
          Left = maxleft
        };
        if (Top < 0) {
          Top = 0
        } else if (Top > maxtop) {
          Top = maxtop
        };
        oDrag.style.left = Left + 'px'
        oDrag.style.top = Top + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
  /**
   *对Date的扩展，将 Date 转化为指定格式的String
   *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   *例子：
   *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
   */
  dateFormat (dateStr, fmt) {
    let _date = new Date(dateStr)
    let o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      'S': this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    return fmt
  }
  toPinYin (str) {
    return pinyin.getFullChars(str)
  }
  companyInfo () {
    return {
      version: '大因分布式V2'
    }
  }
  sortKey (array, key) {
    return array.sort(function (a, b) {
      let x = a[key]
      let y = b[key]
      return x.localeCompare(y, 'zh-CN')
    })
  }
  sortKeys (array, ...args) {
    return array.sort(function (a, b) {
      for (let i = 0; i < args.length; i++) {
        let x = a[args[i]].toString()
        let y = b[args[i]].toString()
        let temp = x.localeCompare(y, 'zh-CN')
        if (temp !== 0 || i === args.length) {
          return temp
        }
      }
    })
  }
  // 指定位数不足补0
  formatZero (num, len) {
    if (String(num).length > len) return num
    return (Array(len).join(0) + num).slice(-len)
  }
  // 对运动方法进行封装
  anchor (from, to, callback) {
    /* let isUndefined = function (obj) {
      return typeof obj === 'undefined'
    } */
    let isFunction = function (obj) {
      return typeof obj === 'function'
    }
    let isNumber = function (obj) {
      return typeof obj === 'number'
    }

    if (!isNumber(from) || !isNumber(to)) {
      if (window.console) {
        console.error('from和to两个参数必须且为数值')
      }
      return 0
    }
    // duration, easing, callback均为可选参数
    // 而且顺序可以任意
    let options = {
      duration: 300,
      easing: 'Linear',
      callback: function () {}
    }

    let setOptions = function (obj) {
      if (isFunction(obj)) {
        options.callback = obj
      }
    }
    setOptions(callback)
    // 运动
    let step = function () {
      options.callback(to, true)
    }
    // 开始执行动画
    step()
  }
  scrollListen (callBack) {
    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let clientHeight = document.body.clientHeight
      callBack(scrollTop, clientHeight)
    })
  }
}
export default new JsUtil()
