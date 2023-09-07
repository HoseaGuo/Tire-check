import { Tabs, Table, Input, Spin } from 'antd';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from './Image';
import Search from './Search';
import SettingView from './SettingView';

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

function CheckView() {
  let [previewVisible, setPreviewVisible] = useState(false);
  let [dataSource, setDataSource] = useState([]);
  let [statistics, setStatistics] = useState([]);
  let [codes, setCodes] = useState({});
  let [searching, setSearching] = useState(false);

  let statisticsLabel = {
    // group: '组号',
    bubbleCount: '气泡数量',
    contaminateCount: '污染数量',
    extinctionBadnessCount: '消光数量',
    holeCount: '孔洞数量',
    sandCount: '沙粒数量',
    scratchCount: '划伤数量',
    totalCount: '缺点总数',
  };

  let frontPoints = dataSource.filter((item) => item.direction === 0).sort((a, b) => a.angle - b.angle);

  let backPoints = dataSource.filter((item) => item.direction === 1).sort((a, b) => a.angle - b.angle);

  let [previewDirection, setPreviewDirection] = useState(undefined);
  let isFront = previewDirection === 0;

  async function handleSearch(barCode) {
    setSearching(true)
    let { success, data } = await api.getInfoByQrCode(barCode);
    setSearching(false)
    if (success) {
      // console.log(data);
      let { qrCodeImageInfos, checkStatistics, ...codes } = data;
      // console.log(data.data)

      setCodes(codes);

      setDataSource(
        qrCodeImageInfos.map((item, index) => {
          return {
            ...item,
            key: index,
            time: item.time.replace('T', ' '), // 处理下时间的显示
            angle: item.adjustAngle, // 返回的角度字段处理下
          };
        })
      );

      setStatistics(checkStatistics);
    }
  }

  let [initialSlide, setInitialSlide] = useState(0);
  let [slideActiveIndex, setSlideActiveIndex] = useState(-1);
  function previewPoint(point) {
    setPreviewVisible(true);
    setPreviewDirection(point.direction);
    isFront = point.direction === 0;
    let slideIndex = (isFront ? frontPoints : backPoints).findIndex((item) => item.imagePath === point.imagePath);
    setInitialSlide(slideIndex);
    setSlideActiveIndex(slideIndex);
  }

  return (
    <Spin spinning={searching}>
      <div className="circles">
        <Circle points={frontPoints} previewPoint={previewPoint} />
        <Circle points={backPoints} previewPoint={previewPoint} />
        <Search onSearch={handleSearch} />
      </div>
      <div className="bottom">
        <Table
          bordered
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          size="small"
          style={{ width: '49%' }}
          scroll={{ y: '200px' }}
          onRow={(record) => {
            return {
              onDoubleClick: (event) => {
                previewPoint(record);
              },
            };
          }}
        />
        <div className="information">
          <div className="item codes flex">
            <p>
              轮圈条码 <input type="text" readOnly defaultValue={codes.qrCode} />
            </p>
            <p>
              轮圈型号 <input type="text" readOnly defaultValue={codes.model} />
            </p>
            <p>
              轮圈品号 <input type="text" readOnly defaultValue={codes.articleNumber} />
            </p>
          </div>
          {statistics
            .sort((a, b) => a.group - b.group)
            .map((item, index) => {
              return (
                <div className="item" key={index}>
                  <p>机组{item.group}</p>
                  {Object.entries(statisticsLabel).map(([key, name]) => {
                    return (
                      <span key={name}>
                        <label>{name}：</label>
                        {item[key]}
                      </span>
                    );
                  })}
                </div>
              );
            })}
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
            onSlideChange={({ activeIndex }) => {
              setSlideActiveIndex(activeIndex);
            }}
            // onSwiper={(swiper) => console.log(swiper)}
            initialSlide={initialSlide}
            navigation={true}
            modules={[Navigation, Pagination]}
            pagination={{
              type: 'fraction',
            }}
          >
            {(isFront ? frontPoints : backPoints).map(({ angle, imagePath }, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="preview-item">
                    <p className="detail">
                      {isFront ? '正面' : '反面'}：{angle}°
                    </p>
                    <div className="img-box">
                      <Image imagePath={imagePath} init={index === slideActiveIndex} />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </Spin>
  );
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
  /* 
    搜索逻辑


    输入框为激活状态：
      输入（复制什么的）后，
      enter键/搜索按钮/2秒后没有输入内容，触发查询

    输入框为非激活状态：
      扫码枪的内容放到输入框，
      带enter键的马上查询，或者2秒后自动查询

    输入框
    监听输入框内容变化，如果输入框内容更新，且两秒后没有输入，就触发查询。
    查询成功后，输入框内容清空
  */

  return (
    <>
      <h1>轮胎检测结果查询系统</h1>
      <div className="wrapper">
        <Tabs defaultActiveKey="2" type="card" items={items} />
      </div>
    </>
  );
}
