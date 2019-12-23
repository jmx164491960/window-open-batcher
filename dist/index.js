var OpenWindowBatcher = /** @class */ (function () {
    function OpenWindowBatcher(params) {
        if (params === undefined)
            params = {};
        this.storageKey = params.storageKey || 'OpenWindowBatcher';
        this.seconds = params.seconds || 1000;
        this.callback = params.callback || null;
    }
    OpenWindowBatcher.prototype.check = function () {
        var _this = this;
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
        var isTimeout = this.isTimeout(storageData.time);
        window.setTimeout(function () {
            var storageData = _this.getStorageData();
            // 满足以下条件是就是被浏览器拦截了的情况
            console.log(storageData.count < 2);
            console.log(!isTimeout);
            console.log(_this.isMatchHref(storageData.hrefArr));
            debugger;
            if (storageData.count < 2
                && !isTimeout
                && _this.isMatchHref(storageData.hrefArr)) {
                // 重置
                _this.setStorageData(_this.getNewStroageData());
                // 关闭页面
                window.close();
            }
        }, this.seconds);
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
        console.log(new Date().getTime(), Number(time));
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
        var obj = {
            count: 0,
            hrefArr: hrefArr,
            time: new Date().getTime()
        };
        this.setStorageData(obj);
        hrefArr.forEach(function (str) {
            window.open(str, '_blank');
        });
        var timer = setInterval(function () {
            var count = _this.getStorageData()['count'];
            // 若出于被拦截状态
            if (count < 2) {
                if (_this.callback) {
                    _this.callback();
                }
                else if (callback) {
                    callback();
                }
                clearInterval(timer);
            }
            else {
                clearInterval(timer);
            }
        }, this.seconds);
    };
    return OpenWindowBatcher;
}());
export default OpenWindowBatcher;
