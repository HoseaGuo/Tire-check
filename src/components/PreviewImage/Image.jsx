import { useState } from 'react';
import api from '../../api';
import { useEffect } from 'react';

export default function ({ imagePath, init, qrCode }) {
  let [imageData, setImageData] = useState("");

  async function loadImage() {
    let imageData = imageDataMap.get(imagePath);
    if (imageData) {
      setImageData(imageData)
    } else {
      let { success, data } = await api.getImage({ imagePath, qrCode });
      if (success) {
        imageData = `data:image/webp;base64,${data.base64}`;
        imageDataMap.set(imagePath, imageData);
        setImageData(imageData)
      }
    }
  }

  useEffect(() => {
    if (init && !imageData) {
      loadImage();
    }
  }, [init])

  return !imageData ? <div>加载中...</div> : <img src={imageData} />;
}

let imageDataMap = new Map();
