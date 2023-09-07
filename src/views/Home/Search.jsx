import { useState } from 'react';
import './Search.scss';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import { useEffect } from 'react';
import { useRef } from 'react';

let timer = 0;
export default function ({ onSearch }) {
  // TRMG11G2903500259 和 TRMG11G2903500260
  let [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const input = useRef(null);

  const [record, setRecord] = useState([]);

  useEffect(() => {
    // 添加扫码事件
    eventListenerScanCode((barCode) => {
      setValue(barCode);
    });
  });

  useEffect(() => {
    clearTimeout(timer);

    if (value.trim()) {
      timer = setTimeout(() => {
        setValue('');
        onSearch(value);
        setRecord([value, ...record]);
      }, 1000);
    }
  }, [value]);

  useEffect(() => {
    if (input.current) {
      window.addEventListener('keypress', (e) => {
        let currCode = e.keyCode || e.which || e.charCode;
        // 回车键
        if (currCode == 13) {
          clearTimeout(timer);
          onSearch(value);
          setValue('');
          setRecord([value, ...record]);
        }
      });
    }
  }, [input]);

  return (
    <div className="search-wrapper">
      <div className="bar-code-box">
        <Spin spinning={loading}>
          <Input
            value={value}
            onChange={(e) => {
              value = e.target.value;
              setValue(e.target.value);
            }}
            placeholder=""
            // onSearch={() => {
            //   clearTimeout(timer);
            //   onSearch(value);
            //   setValue('');
            // }}
            suffix={<SearchOutlined />}
            ref={input}
          />
        </Spin>
      </div>
      <div className="messages">
        {record.map((item, index) => {
          return <p key={index}>查询：{item}</p>;
        })}
      </div>
    </div>
  );
}

//监听扫码枪
/**
 *
 * @param {*} callback 回调函数
 */
function eventListenerScanCode(callback) {
  let barCode = '';
  let lastTime = 0;
  let timer;

  window.onkeypress = function (e) {
    let lessTime = 80;

    let currCode = e.keyCode || e.which || e.charCode;

    let currTime = new Date().getTime();

    if (currCode == 13) {
      // 回车键
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
        }, 500);
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