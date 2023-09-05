import { Tabs, Table } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './index.scss';
import Circle from '../../components/Circle';

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
    dataIndex: 'direction',
  },
];

function CheckView() {
  let points = [
    {
      angle: 0,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
    {
      angle: 10,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
    {
      angle: 12,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
    {
      angle: 11,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
    {
      angle: 78,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
    {
      angle: 14,
      cameraNumber: 0,
      direction: 0,
      imagePath: 'string',
      ngCode: 0,
      time: '2023-09-05T07:48:20.354Z',
    },
  ];

  const data = new Array(12).fill(undefined).map((item, index) => {
    return {
      key: index + 1,
      time: '2023-09-05 17:00:11',
    };
  });

  return (
    <div>
      {/* <div className="circles">
        <Circle points={points} style={{margin: '0 50px'}} />
        <Circle points={points} />
      </div> */}
      <div className="bottom">
        <Table columns={columns} pagination={false} dataSource={data} size="small" style={{ width: '49%' }} scroll={{ y: '40vh' }} />
        <div className="information flex">
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
      <div className="preview-image">
        <button className="btn-close">
          <svg t="1693909250861" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3985" width="48" height="48">
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
          navigation={true}
          modules={[Navigation, Pagination]}
          pagination={{
            type: 'fraction',
          }}
        >
          {new Array(5).fill(undefined).map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="preview-item">
                  <p className="detail">正面：50°</p>
                  <div className="img-box">
                    <img src="https://img0.baidu.com/it/u=2528674402,2721043688&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=330" alt="" />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
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
