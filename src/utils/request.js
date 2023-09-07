import axios from 'axios';
/* 请求方法 */
export default function createRequest(config) {
  const instance = axios.create({
    timeout: 60 * 1000 * 2,
    ...config,
  });

  instance.interceptors.request.use(function (config) {
    // console.log(config);
    if(/get/i.test(config.method)){
      config.params = config.data;
    }
    return config;
  });

  return function (config) {
    const result = {
      success: false,
      data: null,
      msg: '',
      response: null,
    };

    return new Promise((resolve) => {
      instance
        .request(config)
        .then((res) => {
          const { data } = res;
          result.response = data;
          result.msg = data.msg || data.message;

          let showErrorMsg = config.hasOwnProperty('showErrorMsg') ? config.showErrorMsg : true;

          if (res.status === 200) {
            if(res.data.code === '0'){
              result.success = true;
              result.data = res.data.data;
            }
          } else {
            if (showErrorMsg) alert(result.msg);
          }

          resolve(result);
        })
        .catch((err) => {
          result.msg = `請求出錯，${err.message}`;
          console.log(result.msg);
          resolve(result);
        });
    });
  };
}
