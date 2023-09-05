import createRequest from "../utils/request.js";

const request = createRequest({
  // baseURL: `https://api.github.com/repos/${OWNER}/${REPO}`
});

export default {
  // 获取一个issue
  search(qrCode){
    return request({
      url: "/tyre/check/getInfoByQrCode",
      data: {
        qrCode
      },
    })
  }
};
