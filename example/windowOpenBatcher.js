import WindowOpenBatcher from '../lib/index';
import {
  MessageBox
} from 'element-ui';
import 'element-ui/lib/theme-chalk/message-box.css';
import intercept_icon from './assets/intercept_icon.png';
import './demo.css';

const windowOpenBatcher = new WindowOpenBatcher({
  callback: () => {
    MessageBox.alert(
      `由于谷歌系统对批量打开功能的拦截，请点击上方的“<img src=${intercept_icon}>”，之后勾选第一个选项：始终允许${window.location.origin}显示弹出式窗口和重定向，并点击“完成”。`,
      '', 
      {
        customClass: "g-intercept-operate-tip",
        dangerouslyUseHTMLString: true,
        confirmButtonText: '完成',
        callback: action => {
          // this.isIntercept = false
        }
      }
    )
  }
});
export default windowOpenBatcher;