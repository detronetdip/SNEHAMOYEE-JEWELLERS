/* eslint-disable react/destructuring-assignment */
import { Inotype } from '../types/index';

function InvoiceNo(props: Inotype) {
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  return (
    <>
      <div className="row2">
        <div className="leftv">
          Invoice no: {`SJ${props.ino}`} <br /> Date Of Invoice:
          {` ${d > 9 ? d : `0${d}`}:${m > 9 ? m : `0${m}`}:${y}`}
        </div>
        <div className="rightv">Place of supply: West Bengal (19)</div>
      </div>
    </>
  );
}

export default InvoiceNo;
