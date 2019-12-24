var OpenWindowBatcher = /** @class */ (function () {
    function OpenWindowBatcher(params) {
        if (params === undefined)
            params = {};
        this.storageKey = params.storageKey || 'OpenWindowBatcher';
        this.seconds = params.seconds || 1000;
        this.callback = params.callback || null;
    }
    OpenWindowBatcher.prototype.check = function () {
        var storageData = this.getStorageData();
        // 超时了不运行
        if (!storageData.time || this.isTimeout(storageData.time)) {
            return;
        }
        // 如果打开的页面在列表内
        var match = this.isMatchHref(storageData.hrefArr);
        if (match) {
            storageData.count++;
            this.setStorageData(storageData);
        }
    };
    /**
     * 当前href是否命中
     * @param hrefArr
     */
    OpenWindowBatcher.prototype.isMatchHref = function (hrefArr) {
        return hrefArr.some(function (href) {
            return window.location.href.includes(href);
        });
    };
    /**
     * 是否超时
     * @param time
     */
    OpenWindowBatcher.prototype.isTimeout = function (time) {
        return new Date().getTime() - Number(time) > this.seconds;
    };
    /**
     * 获取当前localstroage对应命名空间
     */
    OpenWindowBatcher.prototype.getStorageData = function () {
        var storageData;
        if (!this.storageKey) {
            return this.getNewStroageData();
        }
        try {
            storageData = JSON.parse(localStorage.getItem(this.storageKey) || '') || this.getNewStroageData();
        }
        catch (e) {
            return this.getNewStroageData();
        }
        return storageData;
    };
    /**
     * 获取一个初始化的对象
     */
    OpenWindowBatcher.prototype.getNewStroageData = function () {
        return {
            count: 0,
            hrefArr: [],
            time: 0
        };
    };
    /**
     * 设置localstorage
     * @param obj
     */
    OpenWindowBatcher.prototype.setStorageData = function (obj) {
        localStorage.setItem(this.storageKey, JSON.stringify(obj));
    };
    /**
     * 主方法
     * @param hrefArr 需要批量打开的链接数组
     * @param callback 回调函数
     */
    OpenWindowBatcher.prototype.open = function (hrefArr, callback) {
        var _this = this;
        if (!hrefArr || hrefArr.length === 0) {
            return;
        }
        if (hrefArr.length === 1) {
            window.open(hrefArr[0]);
            return;
        }
        var obj = {
            count: 0,
            hrefArr: hrefArr,
            time: new Date().getTime()
        };
        this.setStorageData(obj);
        hrefArr.forEach(function (str) {
            window.open(str, '_blank');
        });
        // 若干秒后根据打开的页面数量判断
        setTimeout(function () {
            var count = _this.getStorageData()['count'];
            // 若出于被拦截状态
            if (count < 2) {
                if (_this.callback) {
                    _this.callback();
                    // 重置
                    _this.setStorageData(_this.getNewStroageData());
                }
                else if (callback) {
                    callback();
                }
            }
        }, this.seconds);
    };
    return OpenWindowBatcher;
}());
export default OpenWindowBatcher;
