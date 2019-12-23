interface storageDataParams {
  count: number,
  hrefArr: Array<string>
  enable: Boolean
}

interface constructorParams {
  seconds?: number
  storageKey?: string
}

export default class OpenWindowBatcher {
  storageKey: string
  seconds: number
  
  constructor (params: constructorParams) {
    if (params === undefined) params = {}
    this.storageKey = params.storageKey || 'OpenWindowBatcher'
    this.seconds = params.seconds || 1000;
  }
  check() {
    const storageData = this.getStorageData();
    if (!storageData.enable) {
      return;
    }

    // 如果打开的页面在列表内
    const match = storageData.hrefArr.some(href => {
      return window.location.href.includes(href);
    });
    if (match) {
      storageData.count ++;
      this.setStorageData(storageData);
    }

    window.setTimeout(() => {
      const storageData = this.getStorageData();
      if (storageData.enable && storageData.count < 2) {
        this.setStorageData(this.getNewStroageData());
        window.close();
      }
    }, this.seconds);
  }
  getStorageData(): storageDataParams {
    let storageData;
    try {
      storageData = JSON.parse(localStorage.getItem(this.storageKey)) || this.getNewStroageData();
    } catch(e) {
      storageData = this.getNewStroageData();
    }
    return storageData;
  }
  getNewStroageData(): storageDataParams {
    return {
      count: 0,
      hrefArr: [],
      enable: false
    };
  }
  setStorageData(obj: storageDataParams) {
    localStorage.setItem(this.storageKey, JSON.stringify(obj));
  }
  // setCount(value) {
  //   const storageData = this.getStorageData();
  //   storageData['count'] = value;
  //   localStorage.setItem(this.storageKey, JSON.stringify(storageData));
  // }
  getCount() {
    const storageData = this.getStorageData();
    if (!storageData['count']) {
      return 0;
    } else {
      return Number(storageData['count']);
    }
  }
  open(hrefArr, callback) {
    const obj = {
      count: 0,
      hrefArr,
      enable: true
    };
    this.setStorageData(obj);
    hrefArr.forEach((str) => {
      window.open(str, '_blank');
    })

    let timer = setInterval(() => {
      const count = this.getCount();
      // 若出于被拦截状态
      if (count < 2) {
        // this.isIntercept = true
        // MessageBox.alert(parcelManagementLang('stopIntercept1') + `<img src=${intercept_icon}>` + parcelManagementLang('stopIntercept2') + window.location.origin + parcelManagementLang('stopIntercept3'), '', {
        //   customClass: "g-intercept-operate-tip",
        //   dangerouslyUseHTMLString: true,
        //   confirmButtonText: window.$lang('common')('done'),
        //   callback: action => {
        //   }
        // })

        callback();
        clearInterval(timer)
      } else {
        clearInterval(timer)
      }
    }, this.seconds)
  }
}