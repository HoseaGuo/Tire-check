import { useState } from 'react';
import api from '../../api';
import { useEffect } from 'react';

export default function ({imagePath, init}) {
  let [imageData, setImageData] = useState("");

  async function loadImage() {
    let imageData = imageDataMap.get(imagePath);
    if(imageData){
      return imageData
    } else {
      let {success, data} = await api.getImage(imagePath);
      if(success){
        setImageData(`data:image/webp;base64,${data.base64}`)
      }
    }
  }

  useEffect( () => {
    if(init && !imageData){
      loadImage();
    }
  }, [init])

  return !imageData ? <div>加载中...</div> : <img src={imageData} />;
}

let imageDataMap = new Map();
