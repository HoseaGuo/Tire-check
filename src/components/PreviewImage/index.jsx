import { useState, forwardRef, useImperativeHandle } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import './index.scss';
import Image from './Image';

/** react-photo-view使用文档：https://react-photo-view.vercel.app/docs/getting-started */

export default forwardRef(function (props, ref) {
  let { images } = props;

  let [visible, setVisible] = useState(false);
  let [activeIndex, setActiveIndex] = useState(-1);

  useImperativeHandle(
    ref,
    () => {
      return {
        open(index) {
          setVisible(true);
          setActiveIndex(index);
        },
      };
    },
    []
  );

  let elementSize = Math.min(window.innerWidth, 600);
  return (
    <PhotoProvider
      loop={false}
      visible={visible}
      // key={images}
      onClose={() => {
        setVisible(false);
      }}
      onIndexChange={(index) => {
        setActiveIndex(index);
      }}
      index={activeIndex}
      overlayRender={(props) => {
        let curImage = images[activeIndex];
        let { dirrection, angle, ngTypeDesc } = curImage;
        return (
          <div className="photo-info">
            {dirrection === 1 ? '正面' : '反面'}： <span className="angle">{angle}°</span>&nbsp;&nbsp;<span>{ngTypeDesc}</span>
          </div>
        );
      }}
      // toolbarRender={({ onScale, scale }) => {
      //   return (
      //     <>
      //       <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} />
      //       <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)} />
      //     </>
      //   );
      // }}
    >
      <div className="foo">
        {images.map((item, index) => (
          <PhotoView
            key={index}
            width={elementSize}
            height={elementSize}
            render={({ scale, attrs }) => {
              const width = attrs.style.width;
              const offset = (width - elementSize) / elementSize;
              const childScale = scale === 1 ? scale + offset : 1 + offset;
              return (
                <div {...attrs} className="custom-photo-item" style={{ transform: `scale(${childScale})`, width: elementSize, height: elementSize, transformOrigin: '0 0' }}>
                  <Image imagePath={item.imagePath} init={index === activeIndex} />
                  {/* <div>
                  </div> */}
                </div>
              );
            }}
          ></PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
});
