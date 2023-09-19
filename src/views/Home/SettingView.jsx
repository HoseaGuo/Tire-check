import { Col, Divider, Row, Form, Input, Button, InputNumber, Spin, message } from 'antd';
import './SettingView.scss';
import { useRef } from 'react';
import { useState } from 'react';
import api from '../../api';
import { useEffect } from 'react';

const fields1 = {
  forwardCamera1: '正面相机1',
  forwardCamera2: '正面相机2',
  forwardCamera3: '正面相机3',
  forwardCamera4: '正面相机4',
};

const fields2 = {
  reverseCamera1: '反面相机1',
  reverseCamera2: '反面相机2',
  reverseCamera3: '反面相机3',
  reverseCamera4: '反面相机4',
};

let testData = {
  angelAdjustGroupInfo1: {
    forwardCamera1: 0,
    forwardCamera2: 0,
    forwardCamera3: 0,
    forwardCamera4: 0,
    reverseCamera1: 0,
    reverseCamera2: 0,
    reverseCamera3: 0,
    reverseCamera4: 0,
  },
  angelAdjustGroupInfo2: {
    forwardCamera1: 0,
    forwardCamera2: 0,
    forwardCamera3: 0,
    forwardCamera4: 0,
    reverseCamera1: 0,
    reverseCamera2: 0,
    reverseCamera3: 0,
    reverseCamera4: 0,
  },
};

export default function SettingView() {
  const [hasInitData, setHasInitData] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [type, setType] = useState(0);
  const [cameraData, setCameraData] = useState(null);

  const onFinish = async (values) => {
    let { success, data } = await api.updateAngelAdjustInfo(values);
    if (success) {
      setType(0);
      setCameraData(values);
      message.success('修改成功', 1);
    }
  };

  async function getAngelAdjustInfo(isRefresh) {
    setLoading(true);
    let { success, data } = await api.getAngelAdjustInfo();

    setLoading(false);
    setTimeout(() => {}, 1000);

    if (success) {
      if (isRefresh) {
        message.success('刷新成功', 1);
      }
      setCameraData(data);
    }
  }

  useEffect(() => {
    setHasInitData(true);
    if (!hasInitData) getAngelAdjustInfo();
  }, [hasInitData]);

  return (
    <div>
      <h2 className="title">相机偏移角度调整</h2>
      <Spin spinning={loading}>
        <Form ref={formRef} className="form-box" onFinish={onFinish} key={cameraData} initialValues={cameraData} disabled={type === 0}>
          {Object.entries(testData).map(([pKey, pValue], index) => {
            return (
              <Row key={pKey}>
                <Col span={19} offset={5} >
                  <h3 style={{margin: '4px 0 10px'}}>机组{index+1}</h3>
                </Col>
                <Col span={6} offset={5}>
                  {Object.entries(fields1).map(([key, value]) => {
                    return (
                      <Form.Item label={value} name={[pKey, key]} key={key} rules={[{ required: true, message: '不能为空' }]}>
                        <InputNumber min={-360} max={360} />
                      </Form.Item>
                    );
                  })}
                </Col>
                <Col span={6} offset={2}>
                  {Object.entries(fields2).map(([key, value]) => {
                    return (
                      <Form.Item label={value} name={[pKey, key]} key={key} rules={[{ required: true, message: '不能为空' }]}>
                        <InputNumber min={-360} max={360} />
                      </Form.Item>
                    );
                  })}
                </Col>
              </Row>
            );
          })}
        </Form>
        <div className="buttons">
          {type === 0 ? (
            <>
              <Button
                key={'refresh'}
                type="default"
                onClick={() => {
                  getAngelAdjustInfo(true);
                }}
              >
                刷新
              </Button>
              <Button key={'edit'} type="primary" onClick={() => setType(1)}>
                编辑
              </Button>
            </>
          ) : (
            <>
              <Button
                key={'cancel'}
                type="default"
                onClick={() => {
                  setType(0);
                  formRef.current.resetFields();
                }}
              >
                取消
              </Button>
              <Button key={'reset'} type="default" onClick={() => formRef.current.resetFields()}>
                重置
              </Button>
              <Button key={'save'} type="primary" onClick={() => formRef.current.submit()}>
                保存
              </Button>
            </>
          )}
        </div>
      </Spin>
    </div>
  );
}
