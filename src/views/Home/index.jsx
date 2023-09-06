import { Tabs, Table } from 'antd';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './index.scss';
import Circle from '../../components/Circle';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api';
import { useRef } from 'react';

const columns = [
  {
    title: '时间',
    dataIndex: 'time',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'ngTypeDesc',
  },
  {
    title: '角度',
    dataIndex: 'angle',
  },
  {
    title: '相机',
    dataIndex: 'cameraNumber',
  },
  {
    title: '正反',
    render: function (text, record, index) {
      return ['正面', '反面'][record.direction];
    },
  },
  {
    title: '机组',
    dataIndex: 'group',
  },
];

//监听扫码枪
/**
 *
 * @param {*} callback 回调函数
 */
function eventListenerScanCode(callback) {
  let barCode = '';
  let lastTime = 0;
  let timer;

  // function ClearBarCode() {
  //   barCode = '';
  //   lastTime = 0;
  // }

  window.onkeypress = function (e) {
    let lessTime = 80;

    let currCode = e.keyCode || e.which || e.charCode;

    let currTime = new Date().getTime();

    if (currCode == 13) {
      clearTimeout(timer);
      scanComplete(barCode);
    } else {
      let realCode = String.fromCharCode(currCode);
      if (currTime - lastTime <= lessTime) {
        clearTimeout(timer);
        // 扫码枪有效输入间隔毫秒
        barCode += realCode;
        // 防止一些扫码枪没有Enter事件触发，所以，在一秒后自动触发一下
        timer = setTimeout(() => {
          scanComplete(barCode);
        }, 1000);
      } else if (currTime - lastTime > lessTime) {
        // 很长时间没有输入后，第一个按键作为第一个字符。
        barCode = realCode;
      }
    }

    lastTime = currTime;
  };

  function scanComplete(barCode) {
    // 回车
    if (barCode.length >= 16) {
      console.log('扫码结果：' + barCode + '，长度：' + barCode.length);
      //这里是根据我们二维码或条码的规则校验，增加准确度
      // 扫码结果，做下一步业务处理
      if (callback) callback(barCode);
    }
  }
}

function CheckView() {
  let [previewVisible, setPreviewVisible] = useState(false);
  let [dataSource, setDataSource] = useState([]);
  // TRMG11G2903500259 和 TRMG11G2903500260
  let [barCode, setBarCode] = useState('TRMG11G2903500259');

  const data = new Array(12).fill(undefined).map((item, index) => {
    return {
      key: index + 1,
      time: '2023-09-05 17:00:11',
    };
  });

  useEffect(() => {
    // 添加扫码事件
    eventListenerScanCode((barCode) => {
      console.log(barCode);
      setBarCode(barCode);
    });
  });

  let frontPoints = dataSource.filter((item) => item.direction === 0);
  let backPoints = dataSource.filter((item) => item.direction === 1);
  let [previewDirection, setPreviewDirection] = useState(undefined);
  let isFront = previewDirection === 0;

  useEffect(() => {
    (async function () {
      let { success, data } = await api.getInfoByQrCode(barCode);
      if (success) {
        // console.log(data);
        if (data.code == '0') {
          let { qrCodeImageInfos } = data.data;
          // console.log(data.data)

          setDataSource(
            qrCodeImageInfos.map((item, index) => {
              return {
                ...item,
                key: index,
                time: item.time.replace('T', ' '),
                angle: item.adjustAngle, // 返回的角度字段处理下
              };
            })
          );
        }
      }
    })();
  }, [barCode]);

  let [initialSlide, setInitialSlide] = useState(0);
  function previewPoint(point) {
    setPreviewVisible(true);
    setPreviewDirection(point.direction);

    let slideIndex = (isFront ? frontPoints: backPoints).findIndex( item => item.imagePath === point.imagePath);
    setInitialSlide(slideIndex)
  }

  return (
    <div>
      <div className="circles">
        <Circle points={frontPoints} style={{ margin: '0 50px' }} />
        <Circle points={backPoints} previewPoint={previewPoint} />
      </div>
      <div className="bottom">
        <Table
          bordered
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          size="small"
          style={{ width: '49%' }}
          scroll={{ y: '40vh' }}
          onRow={(record) => {
            return {
              onDoubleClick: (event) => {
                previewPoint(record);
              },
            };
          }}
        />
        <div className="information flex" onClick={() => setPreviewVisible(true)}>
          <div className="flex-1">
            <p>轮圈条码</p>
            <p>轮圈型号</p>
            <p>轮圈品号</p>
          </div>
          <div className="flex-1">
            <p>统计：</p>
            <p>ssasfds</p>
          </div>
        </div>
      </div>
      {previewVisible && (
        <div className="preview-image">
          <button
            className="btn-close"
            onClick={() => {
              setPreviewVisible(false);
            }}
          >
            <svg t="1693909250861" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3985" width="40" height="40">
              <path
                d="M571.733333 512l268.8-268.8c17.066667-17.066667 17.066667-42.666667 0-59.733333-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 452.266667 243.2 183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333L452.266667 512 183.466667 780.8c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 19.2 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8L512 571.733333l268.8 268.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z"
                fill="#ffffff"
                p-id="3986"
              ></path>
            </svg>
          </button>
          <Swiper
            className="swiper"
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
            initialSlide={initialSlide}
            navigation={true}
            modules={[Navigation, Pagination]}
            pagination={{
              type: 'fraction',
            }}
          >
            {(isFront ? frontPoints : backPoints).map(({ angle }, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="preview-item">
                    <p className="detail">
                      {isFront ? '正面' : '反面'}：{angle}°
                    </p>
                    <div className="img-box">
                      <img src="https://img0.baidu.com/it/u=2528674402,2721043688&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=330" alt="" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
}

function SettingView() {
  return <div>setting</div>;
}

const items = [
  {
    key: '1',
    label: '检测界面',
    children: <CheckView />,
  },
  {
    key: '2',
    label: '参数设置',
    children: <SettingView />,
  },
];
export default function () {
  return (
    <div className="wrapper">
      <Tabs defaultActiveKey="1" type="card" items={items} />
    </div>
  );
}
