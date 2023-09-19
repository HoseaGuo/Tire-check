import createRequest from "../utils/request.js";

let isDev = process.env.NODE_ENV === 'development' || location.href.indexOf('mode=development') !== -1;

const request = createRequest({
  baseURL: isDev ? 'http://159.75.126.25:8081' : ""
});

export default {
  // 通过二维码查询图片信息
  getInfoByQrCode(qrCode) {
    return request({
      url: "/tyre/check/getInfoByQrCode",
      data: {
        qrCode
      },
    })
  },
  // 查询一张图片
  getImage(imagePath) {
    return request({
      url: "/tyre/check/getImage",
      data: {
        imagePath
      },
    })
  },
  // 查询角度调整信息
  getAngelAdjustInfo() {
    return request({
      url: "/tyre/check/getAngelAdjustInfo",
    })
  },
  // /tyre/check/updateAngelAdjustInfo
  updateAngelAdjustInfo(data) {
    return request({
      url: "/tyre/check/updateAngelAdjustInfo",
      data,
      method: 'post'
    })
  },
};
