interface storageDataParams {
  count: number,
  hrefArr: Array<string>
  time: number
}

interface constructorParams {
  seconds?: number
  storageKey?: string
  callback?: Function
}

export default class OpenWindowBatcher {
  storageKey: string
  seconds: number
  callback: Function | null;
  
  constructor (params: constructorParams) {
    if (params === undefined) params = {}
    this.storageKey = params.storageKey || 'OpenWindowBatcher'
    this.seconds = params.seconds || 1000;
    this.callback = params.callback || null;
  }
  check() {
    const storageData = this.getStorageData();
    // 超时了不运行
    if (!storageData.time || this.isTimeout(storageData.time)) {
      return;
    }
    // 如果打开的页面在列表内
    const match = this.isMatchHref(storageData.hrefArr);
    if (match) {
      storageData.count ++;
      this.setStorageData(storageData);
    }
  }
  /**
   * 当前href是否命中
   * @param hrefArr 
   */
  isMatchHref(hrefArr: Array<string>): Boolean {
    return hrefArr.some(href => {
      return window.location.href.includes(href);
    });
  }
  /**
   * 是否超时
   * @param time 
   */
  isTimeout(time: number): Boolean {
    return new Date().getTime() - Number(time) > this.seconds;
  }
  /**
   * 获取当前localstroage对应命名空间
   */
  getStorageData(): storageDataParams {
    let storageData;
    if (!this.storageKey) {
      return this.getNewStroageData();
    }
    try {
      storageData = JSON.parse(localStorage.getItem(this.storageKey) || '') || this.getNewStroageData();
    } catch(e) {
      return this.getNewStroageData();
    }
    return storageData;
  }
  /**
   * 获取一个初始化的对象
   */
  getNewStroageData(): storageDataParams {
    return {
      count: 0,
      hrefArr: [],
      time: 0
    };
  }
  /**
   * 设置localstorage
   * @param obj 
   */
  setStorageData(obj: storageDataParams) {
    localStorage.setItem(this.storageKey, JSON.stringify(obj));
  }
  /**
   * 主方法
   * @param hrefArr 需要批量打开的链接数组
   * @param callback 回调函数
   */
  open(hrefArr: Array<string>, callback?: Function) {
    if (!hrefArr || hrefArr.length === 0) {
      return;
    }
    if (hrefArr.length === 1) {
      window.open(hrefArr[0]);
      return;
    }

    const obj = {
      count: 0,
      hrefArr,
      time: new Date().getTime()
    };
    this.setStorageData(obj);
    hrefArr.forEach((str) => {
      window.open(str, '_blank');
    })

    // 若干秒后根据打开的页面数量判断
    setTimeout(() => {
      const count = this.getStorageData()['count'];
      // 若出于被拦截状态
      if (count < 2) {
        if (this.callback) {
          this.callback();
          // 重置
          this.setStorageData(this.getNewStroageData())
        } else if (callback) {
          callback()
        }
      }
    }, this.seconds)
  }
}