interface storageDataParams {
    count: number;
    hrefArr: Array<string>;
    time: number;
}
interface constructorParams {
    seconds?: number;
    storageKey?: string;
    callback?: Function;
}
export default class OpenWindowBatcher {
    storageKey: string;
    seconds: number;
    callback: Function;
    constructor(params: constructorParams);
    check(): void;
    /**
     * 当前href是否命中
     * @param hrefArr
     */
    isMatchHref(hrefArr: Array<string>): Boolean;
    /**
     * 是否超时
     * @param time
     */
    isTimeout(time: number): Boolean;
    /**
     * 获取当前localstroage对应命名空间
     */
    getStorageData(): storageDataParams;
    /**
     * 获取一个初始化的对象
     */
    getNewStroageData(): storageDataParams;
    /**
     * 设置localstorage
     * @param obj
     */
    setStorageData(obj: storageDataParams): void;
    /**
     * 主方法
     * @param hrefArr 需要批量打开的链接数组
     * @param callback 回调函数
     */
    open(hrefArr: Array<string>, callback?: Function): void;
}
export {};
