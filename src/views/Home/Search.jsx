import { useState } from 'react';
import './Search.scss';
import { SearchOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import { useEffect } from 'react';
import { useRef } from 'react';

let timer = 0;
export default function ({ onSearch }) {
  // TRMG11G2903500259 和 TRMG11G2903500260
  let [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const [record, setRecord] = useState([]);

  useEffect(() => {
    // 添加扫码事件
    eventListenerScanCode((barCode) => {
      setValue(barCode);
    });
  });


  function fetchSearch(barCode) {
    barCode = barCode.trim();
    if (barCode) {
      setValue('');
      onSearch(barCode, (success) => {
        setRecord([
          {
            barCode,
            success,
          },
          ...record,
        ].slice(0, 100));
      });
    }
  }

  useEffect(() => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fetchSearch(value);
    }, 1000);
  }, [value]);

  useEffect(() => {
    function event(e) {
      if (e.target.tagName.toLowerCase() === 'input') {
        let currCode = e.keyCode || e.which || e.charCode;
        // 回车键
        if (currCode == 13) {
          clearTimeout(timer);
          let barCode = e.target.value;
          fetchSearch(barCode);
        }
      }
    }
    window.addEventListener('keypress', event);

    return function () {
      window.removeEventListener('keypress', event);
    };
  }, [inputRef, record]);

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
            prefix={<BarcodeOutlined />}
            suffix={<SearchOutlined />}
            ref={inputRef}
            style={{ fontSize: '18px' }}
            size="large"
            className="search-input"
          />
        </Spin>
      </div>
      <div className="messages">
        {record.map((item, index) => {
          return (
            <p key={index}>
              {item.barCode ? (
                <>
                  <span className={item.success ? 'success' : 'failed'}>{item.success ? '查询成功' : '查询失败'}</span>&nbsp;&nbsp;
                  <span>{item.barCode}</span>
                </>
              ) : null}
            </p>
          );
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
