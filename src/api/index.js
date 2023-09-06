import createRequest from "../utils/request.js";

const request = createRequest({
  baseURL: 'http://159.75.126.25:8080'
});

export default {
  // 通过二维码查询图片信息
  getInfoByQrCode(barCode){
    return request({
      url: "/tyre/check/getInfoByQrCode",
      data: {
        qrCode: barCode
      },
    })
  }
};
