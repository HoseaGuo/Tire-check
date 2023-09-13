import { useEffect } from 'react';
import { useRef } from 'react';
import './index.scss';
export default function (props) {
  let canvasRef = useRef(null);

  let { points, previewPoint, selectedPoint } = props;

  let showing = false;
  let sectorNumber = 30; // 扇区数量

  useEffect(() => {
    let sectorMap = getSectorMap(points);

    let canvas = canvasRef.current;

    let width = 440 * 1.2;
    let height = width;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // 轮胎边缘宽度。
    const tireWidth = width / 16;
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

    let arcRadius = (width / 5) * 2;

    ctx.fillStyle = '#666';

    // 字体大小
    ctx.font = 'normal 30px test';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // 画出中间文字
    ctx.fillText(props.centerText, width / 2, width / 2);

    ctx.font = 'normal 14px test';

    // 画圈圈上的度数刻度
    for (let text = 0; text < 360; text += 15) {
      let textX, textY, lineStartX, lineStartY, lineEndX, lineEndY;
      let angle = adjustAngel + text;
      angle = (angle / 180) * Math.PI;
      textX = (arcRadius + 20) * Math.cos(angle) + width / 2;
      textY = (arcRadius + 20) * Math.sin(angle) + width / 2;
      // 画字
      ctx.fillText(text, textX, textY);

      // 画刻度
      lineStartX = (arcRadius + 0) * Math.cos(angle) + width / 2;
      lineStartY = (arcRadius + 0) * Math.sin(angle) + width / 2;

      lineEndX = (arcRadius + 7) * Math.cos(angle) + width / 2;
      lineEndY = (arcRadius + 7) * Math.sin(angle) + width / 2;

      ctx.beginPath();
      ctx.moveTo(lineStartX, lineStartY);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.stroke();
    }

    ctx.beginPath();
    // 画轮圈
    ctx.fillStyle = '#333';

    ctx.arc(width / 2, height / 2, arcRadius, 0, Math.PI * 2, false);
    ctx.arc(width / 2, height / 2, arcRadius - tireWidth, Math.PI * 2, 0, true);
    ctx.fill();

    ctx.fillStyle = '#0c6cda';

    let dblclickEventList = [];
    // 画扇区
    function drawSector(sectorIndex, points) {
      // 如果有选择的点，则只画选择的点
      if (selectedPoint) {
        let includeSelectedPoint = points.some((item) => {
          if (item.imagePath === selectedPoint.imagePath) {
            return true;
          }
        });
        if (includeSelectedPoint) {
          points = [selectedPoint];
        } else {
          points = [];
        }
      }
      let pointNumber = points.length;
      let eachSplitSectorWidth = tireWidth / pointNumber;
      points.forEach((point, index) => {
        // 不同类型有不同的颜色
        ctx.fillStyle = point.ngTypeColor;
        let startMathAngle = ((Math.PI * 2) / sectorNumber) * sectorIndex + (adjustAngel / 180) * Math.PI;
        let endMathAngle = ((Math.PI * 2) / sectorNumber) * (sectorIndex + 1) + (adjustAngel / 180) * Math.PI;
        let path = new Path2D();
        path.arc(width / 2, height / 2, arcRadius - eachSplitSectorWidth * index, startMathAngle, endMathAngle, false);
        path.arc(width / 2, height / 2, arcRadius - eachSplitSectorWidth * (index + 1), endMathAngle, startMathAngle, true);
        ctx.fill(path);

        let dblclickEvent = function (e) {
          let isInner = ctx.isPointInPath(path, e.offsetX, e.offsetY);
          if (isInner && !showing) {
            showing = true;

            previewPoint(point);

            setTimeout(() => {
              showing = false;
            }, 100);
          }
        };

        dblclickEventList.push(dblclickEvent);
        canvas.addEventListener('dblclick', dblclickEvent);
      });
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
