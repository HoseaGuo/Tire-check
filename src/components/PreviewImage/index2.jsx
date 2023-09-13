
import { useRef } from 'react'
import { useEffect, forwardRef, useImperativeHandle } from 'react'

import { Gallery, Item, useGallery } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import "./index.scss"
import { useState } from 'react'


let options = {
  wheelToZoom: true,
  // zoom: true,
  bgOpacity: 0.7,
  preload: [0],
}


export default function () {
  let GalleryContentRef = useRef(null);
  let [activeIndex, setActiveIndex] = useState(-1);

  function handleOpen() {
    GalleryContentRef.current.open(0);
  }

  function handleChange(pswp) {
    pswp.on('change', (e, b) => {
      console.log(e)
      console.log(b)
    })
    pswp.on('contentActivate', ({ content }) => {
      // content becomes active (the current slide)
      // can be default prevented
      console.log('contentActivate', content);
      setActiveIndex(content.index);
    });
    // pswp.on('pointerMove', (e) => e.preventDefault())
    // pswp.on('pointerUp', (e) => e.preventDefault())
    // pswp.on('pinchClose', (e) => e.preventDefault())
    // pswp.on('verticalDrag', (e) => e.preventDefault())
  }
  return <>
    <button onClick={handleOpen}>Open second slide</button>
    <Gallery withCaption options={options} onBeforeOpen={handleChange} >
      <GalleryContent ref={GalleryContentRef} activeIndex={activeIndex} />
    </Gallery>
  </>
}

const GalleryContent = forwardRef((props, ref) => {
  let { activeIndex } = props;
  const { open } = useGallery()

  useImperativeHandle(ref, () => {
    return {
      open
    };
  }, []);

  let images = [
    'https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg',
    'https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg',
    'https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg'
  ]

  return (
    <div>
      {/* or you can open second slide on button click */}
      {/* <button onClick={() => open(1)}>Open second slide</button> */}
      <div>
        {/* <Item
          width="1024"
          height="768"
          // content={<img src='https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg' />}
          original='https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg'
          caption="Foo"
        >
          {({ ref }) => <div ref={ref} style={{ display: 'none' }}></div>}
        </Item>
        <Item
          width="1024"
          height="768"
          // content={<img src='https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg' />}
          original='https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg'
          caption="Foo"
        >
          {({ ref }) => <div ref={ref} style={{ display: 'none' }}></div>}
        </Item> */}
        {/* <Item
          original="https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg"
          thumbnail="https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg"
          width="1600"
          height="1600"
          alt="Photo of seashore by Folkert Gorter"
        >
          {({ ref, open }) => (
            <img
              style={{ cursor: 'pointer' }}
              src="https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg"
              ref={ref}
              onClick={open}
            />
          )}
        </Item>
        <Item
          original="https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg"
          thumbnail="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
          width="1600"
          height="1068"
          alt="Photo of mountain lake by Samuel Rohl"
        >
          {({ ref, open }) => (
            <img
              src="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
              ref={ref}
              onClick={open}
            />
          )}
        </Item> */}
        {
          images.map((src, index) => {
            return <GalleryItem init={index === activeIndex} key={index} src={src} />
          })
        }
        {/* <Item
          original="https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg"
          width="1024"
        >
          {({ ref, open }) => (
            <img ref={ref} onClick={open} src="https://placekitten.com/80/60?image=1" />
          )}
        </Item>
        <Item
          width="1024"
          original="https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg"
        >
          {({ ref, open }) => (
            <img ref={ref} onClick={open} src="https://placekitten.com/80/60?image=1" />
          )}
        </Item> */}
      </div>
    </div>
  )
})

function GalleryItem({ init, src }) {
  let [original, setOriginal] = useState("");
  useEffect(() => {
    console.log(init)
    if (init && !original) {
      console.log('set origin')
      console.log(src)
      setOriginal(src)
    }
  }, [init])
  return original ? <Item
    original={original}
    width="1024"
    height="768"
    caption="Foo"
  >
    {({ ref }) => <div ref={ref} style={{ display: 'none' }}></div>}
  </Item> : <Item
    original={original}
    width="1024"
    height="768"
    caption="Foo"
  >
    {({ ref }) => <div ref={ref} style={{ display: 'none' }}></div>}
  </Item>
}