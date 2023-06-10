import { lxLoginRequest } from './index';

// 获取code
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000, // 超时时间
      success: (res) => {
        const code = res.code;
        resolve(code);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      }
    });
  });
}

export function codeToToken(code) {
  return lxLoginRequest.post('/login', { code });
}

export function checkToken() {
  return lxLoginRequest.post('/auth', {}, true);
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}
