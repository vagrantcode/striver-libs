let Ipc = (function () {
  let subscribeInfo = {}// 订阅信息
  var ws = null// 消息执行人
  var hit = 1// 重连心跳间隔
  var reConnectNum = 0// 重连次数r
  let isConsole = false
  function guid () {
    var S4 = function () {
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
  function wsCheck (url) {
    if (ws === null) {
      if ('WebSocket' in window) {
        ws = new WebSocket(url)
        ws.onopen = function () {
          // Web Socket 已连接上，使用 send() 方法发送数据
          // ws.send('发送数据')
          hit = 1
          reConnectNum = 0
        }
        ws.onmessage = function (evt) {
          if (isConsole) {
            console.log(evt)
          }
          for (let item in subscribeInfo) {
            let tData = {}
            try {
              if (evt.data === undefined) {
                tData = false
              } else {
                tData = JSON.parse(evt.data)
              }

              subscribeInfo[item](evt, tData)
            } catch (e) {
              delSubInfo(item)
            }
          }
        }
        ws.onerror = function () {
          redConcetWebSocket(url)
          console.log('websocke出错了')
        }
        ws.onclose = function () {
          redConcetWebSocket(url)
          console.log('websocke断开了')
          // 关闭 websocket
        }
      } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
      }
    } else {
      if (ws.readyState > 1) {
        redConcetWebSocket(url)
      }
    }
  }
  function redConcetWebSocket (url) {
    hit = parseInt(reConnectNum / 10) + 1
    ws = null
    setTimeout(() => {
      wsCheck(url)
    }, hit)
  }
  function delSubInfo (subId) {
    delete subscribeInfo[subId]
    if (Object.keys(subscribeInfo).length <= 0) {
      if (ws !== null) {
        ws.close()
        ws = null
      }
    }
  }
  return function (url) {
    let reg = new RegExp('^ws://')// 验证webSocket地址是否完整
    if (!reg.test(url)) {
      url = 'ws://' + url
    }
    this.joinSubscribe = function (callBack) {
      let subId = guid()
      subscribeInfo[subId] = callBack
      wsCheck(url)
      return subId
    }
    this.delSubscribe = delSubInfo
    this.getTask = function () {
      return subscribeInfo
    }
    this.setIsConsole = function (val) {
      if (val) {
        isConsole = true
        return true
      } else {
        isConsole = false
        return false
      }
    }
  }
})()
export default Ipc
