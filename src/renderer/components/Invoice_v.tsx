/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext } from 'react';
// @ts-ignore
import num2words from 'num-words';
import ReactToPrint from 'react-to-print';
import { TaxStore } from './Dashbord';
import TableRow2 from './TableRow2';
import { ProductGold, TaxstoreWithIdDate } from '../types/index';

const Invoice_v = React.forwardRef((_props, _ref) => {
  const store: TaxstoreWithIdDate = useContext(TaxStore);
  const refer = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const testREF = React.useRef() as React.MutableRefObject<HTMLButtonElement>;
  const invoiceDetail = store.invoiceDetail?.data;
  let QTY = 0;
  let MC = 0;
  let WEIGHT = 0;
  let GWEIGHT = 0;
  let VOS = 0;
  invoiceDetail?.products.forEach((element: any) => {
    QTY += element.qty;
    WEIGHT += parseFloat(element.wt);
    GWEIGHT += parseFloat(element.gwt);
    MC += parseFloat(element.mc);
    VOS += element.wt * (invoiceDetail.rate / 10) + element.mc * element.wt;
  });
  const SUBTOTAL = parseFloat(
    `${
      parseFloat(parseFloat(`${(VOS * 3) / 100}`).toFixed(2)) +
      parseFloat(`${VOS}`)
    }`
  ).toFixed(2);
  const ROUNDOFF = parseFloat(
    Math.abs(+SUBTOTAL - Math.round(+SUBTOTAL)).toFixed(2)
  );
  const ROUND = parseFloat(`${Math.round(+SUBTOTAL)}`);

  return (
    <>
      <div className="left" ref={refer}>
        <div className="leftview">
          <div className="table">
            <div className="top">
              <span>TAX INVOICE</span>
            </div>
            <h1>SNEHAMOYEE JEWELLERS</h1>
            <h4>Preambazar,Hijli Co-Oprative-721306,Kharagpur,West Mednapur</h4>
            <h3>GSTIN: 19AILPD7509G1Z5</h3>
            <h4>9434146334 / 8637846121</h4>
            <div className="row2">
              <div className="leftv">
                {/* @ts-ignore */}
                Invoice no: {`${store?.invoiceDetail?.id}`} <br /> Date Of Invoice:
                {/* @ts-ignore */}
                {`${store?.invoiceDetail?.date}`}
              </div>
              <div className="rightv">Place of supply: West Bengal (19)</div>
            </div>
            <div className="address">
              <h4>Billed To: </h4>
              <p>
                {invoiceDetail?.cName} <br />
                {invoiceDetail?.cAdd} <br />
                Pin- {invoiceDetail?.cPin}, Mobile: {invoiceDetail?.cMobile}
              </p>
            </div>
            <table cellSpacing={0}>
              <thead>
                <th>SL No</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Gross wt</th>
                <th>Net wt</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>M/C charge</th>
                <th>Value of supply</th>
              </thead>
              <tbody>
                {invoiceDetail?.products.map(
                  (_e: ProductGold, index: number) => (
                    <TableRow2
                      i={index + 1}
                      name={_e.name}
                      wt={_e.wt}
                      gwt={_e.gwt}
                      qty={_e.qty}
                      rate={invoiceDetail.rate}
                      mc={_e.mc}
                      key={_e.name}
                    />
                  )
                )}
                <tr className="sp">
                  <td />
                  <td>Total: </td>
                  <td>{QTY} pc</td>
                  <td>{parseFloat(`${GWEIGHT}`).toFixed(2)} gms</td>
                  <td>{parseFloat(`${WEIGHT}`).toFixed(2)} gms</td>
                  <td>{invoiceDetail?.rate}</td>
                  <td>
                    {parseFloat(
                      `${
                        WEIGHT *
                        (invoiceDetail?.rate ? invoiceDetail?.rate / 10 : 0)
                      }`
                    ).toFixed(2)}
                  </td>
                  <td>{MC}</td>
                  <td>{parseFloat(`${VOS}`).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="roffc">
              <div className="roff-l">
                <h5>Payment Mode: {invoiceDetail?.mode}</h5>
              </div>
              <div className="roff-r">
                <div className="row1">
                  <div className="l">GST</div>
                  <div className="r">3%</div>
                </div>
                <div className="row1">
                  <div className="l">Subtotal</div>
                  <div className="r">{SUBTOTAL}</div>
                </div>
                <div className="row1">
                  <div className="l">Round Off</div>
                  <div className="r">
                    {ROUND <= parseInt(`${SUBTOTAL}`, 10)
                      ? `- ${ROUNDOFF}`
                      : ROUNDOFF}
                  </div>
                </div>
                <div className="row1">
                  <div className="l">Total</div>
                  <div className="r">{`${Math.round(
                    parseFloat(`${SUBTOTAL}`)
                  )}.00`}</div>
                </div>
                <hr />
                <h4 className="h4">
                  <span>Total Amount In Words:</span>{' '}
                  {`${num2words(Math.round(parseFloat(`${SUBTOTAL}`)))} Only.`}{' '}
                </h4>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="l">
              <h6>Terms & Conditions</h6>
              <p>E.&O.E</p>
              <ol>
                <li>Goods once sold will not be taken back</li>
                <li>Subjects to West bengal Jurisdiction Only</li>
              </ol>
            </div>
            <div className="r">
              <p>
                Certified That the particular given above are true and correct
                for SNEHAMOYEE JEWELERS.
              </p>
              <p className="p2">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
      <ReactToPrint
        trigger={() => (
          <button type="button" ref={testREF}>
            Print
          </button>
        )}
        content={() => refer.current}
      />
    </>
  );
});

export default Invoice_v;
