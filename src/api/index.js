import createRequest from "../utils/request.js";

let isDev = process.env.NODE_ENV === 'development';
const request = createRequest({
  baseURL: isDev ? 'http://159.75.126.25:8080' : ""
});

export default {
  // 通过二维码查询图片信息
  getInfoByQrCode(qrCode){
    return request({
      url: "/tyre/check/getInfoByQrCode",
      data: {
        qrCode
      },
    })
  },
  // 查询一张图片
  getImage(imagePath){
    return request({
      url: "/tyre/check/getImage",
      data: {
        imagePath
      },
    })
  },
};
