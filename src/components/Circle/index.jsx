import { useEffect } from 'react';
import { useRef } from 'react';
import "./index.scss"
export default function (props) {
  let canvasRef = useRef(null);

  let { points } = props;

  let showing = false;

  useEffect(() => {
    let canvas = canvasRef.current;

    // let width = Math.min(300, Math.max(200, window.innerWidth / 3));
    let width = 250;
    let height = width;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // 轮胎边缘宽度。
    const tireWidth = width / 12;
    // 点的宽度(角度)
    const pointWidthAngle = 6;

    // 圆圈0度的位置，right：圆圈右侧（右侧）， top：顶部， left：左侧， bottom：底部
    const zeroAngelPosition = 'top';
    let adjustAngel = 0;
    switch (zeroAngelPosition) {
      case 'right':
        adjustAngel = 0;
        break;
      case 'top':
        adjustAngel = -90;
        break;
      case 'left':
        adjustAngel = -180;
        break;
      case 'bottom':
        adjustAngel = -270;
        break;
    }

    // 画轮圈
    ctx.fillStyle = '#333';
    ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2, false);
    ctx.arc(width / 2, height / 2, width / 2 - tireWidth, Math.PI * 2, 0, true);
    ctx.fill();

    ctx.fillStyle = '#0c6cda';

    function drawPoint(angle, payload) {
      angle += adjustAngel;
      let startMathAngle = ((angle - pointWidthAngle / 2) / 180) * Math.PI;
      let endMathAngle = ((angle + pointWidthAngle / 2) / 180) * Math.PI;
      let path = new Path2D();
      path.arc(width / 2, height / 2, width / 2, startMathAngle, endMathAngle, false);
      path.arc(width / 2, height / 2, width / 2 - tireWidth, endMathAngle, startMathAngle, true);
      ctx.fill(path);

      canvas.addEventListener('dblclick', (e) => {
        let isInner = ctx.isPointInPath(path, e.offsetX, e.offsetY);
        if (isInner && !showing) {
          showing = true;
          console.log(payload);
          setTimeout( () => {
            showing = false;
          }, 100)
        }
      });
    }

    points.forEach( point => {
      drawPoint(point.angle, point)
    })

    // drawPoint(0, { id: 1 });
  }, []);

  return (
    <canvas ref={canvasRef} {...props}></canvas>
  );
}
