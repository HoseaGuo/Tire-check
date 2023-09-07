import { useEffect } from 'react';
import { useRef } from 'react';
import './index.scss';
export default function (props) {
  let canvasRef = useRef(null);

  let { points, previewPoint } = props;

  let showing = false;
  let sectorNumber = 31; // 扇区数量

  useEffect(() => {
    let sectorMap = getSectorMap(points);

    let canvas = canvasRef.current;

    // let width = Math.min(450, Math.max(200, window.innerWidth / 3));
    let width = 350;
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

    let dblclickEventList = [];
    // 画扇区
    function drawSector(sectorIndex, points) {
      // angle = sectorIndex* +adjustAngel;
      // let startMathAngle = ((angle - pointWidthAngle / 2) / 180) * Math.PI;
      let startMathAngle = ((Math.PI * 2) / sectorNumber) * sectorIndex + adjustAngel;
      let endMathAngle = ((Math.PI * 2) / sectorNumber) * (sectorIndex + 1) + adjustAngel;
      let path = new Path2D();
      path.arc(width / 2, height / 2, width / 2, startMathAngle, endMathAngle, false);
      path.arc(width / 2, height / 2, width / 2 - tireWidth, endMathAngle, startMathAngle, true);
      ctx.fill(path);

      let dblclickEvent = function (e) {
        let isInner = ctx.isPointInPath(path, e.offsetX, e.offsetY);
        if (isInner && !showing) {
          showing = true;

          previewPoint(points[0]);

          setTimeout(() => {
            showing = false;
          }, 100);
        }
      };
      dblclickEventList.push(dblclickEvent);
      canvas.addEventListener('dblclick', dblclickEvent);
    }

    for (let [index, points] of sectorMap) {
      drawSector(index, points);
    }

    return function () {
      dblclickEventList.forEach((event) => {
        canvas.removeEventListener('dblclick', event);
      });
    };
  }, [points]);

  function getSectorMap(points) {
    let sectorAngle = 360 / sectorNumber;
    let sectorMap = new Map();
    points.forEach((point) => {
      let sectorIndex = Math.floor(point.angle / sectorAngle);
      let sector = sectorMap.get(sectorIndex);
      if (!sector) {
        sector = [];
        sectorMap.set(sectorIndex, sector);
      }
      sector.push(point);
    });
    return sectorMap;
  }

  return <canvas ref={canvasRef} style={props.style}></canvas>;
}
