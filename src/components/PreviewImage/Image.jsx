import { useState } from 'react';
import api from '../../api';
import { useEffect } from 'react';

export default function ({ imagePath, init, qrCode }) {
  let [imageData, setImageData] = useState("");
  let [errMsg, setErrMsg] = useState("");

  async function loadImage() {
    let imageData = imageDataMap.get(imagePath);
    if (imageData) {
      setImageData(imageData)
    } else {
      let { success, data, msg } = await api.getImage({ imagePath, qrCode });
      if (success) {
        imageData = `data:image/webp;base64,${data.base64}`;
        imageDataMap.set(imagePath, imageData);
        setImageData(imageData)
        setErrMsg("");
      } else {
        setErrMsg(msg);
      }
    }
  }

  useEffect(() => {
    if (init && !imageData) {
      loadImage();
    }
  }, [init])
  if (errMsg) return <div style={{ width: '200px', textAlign: 'center' }}>
    <p><span style={{ color: "#fff" }}>{errMsg}</span></p>
    {
      errMsg !== '文件不存在' && <button onClick={loadImage} style={{ padding: '6px 10px', marginTop: '30px' }}>点击重新加载</button>
    }
  </div>
  return !imageData ? <div>加载中...</div> : <img src={imageData} />;
}

let imageDataMap = new Map();
