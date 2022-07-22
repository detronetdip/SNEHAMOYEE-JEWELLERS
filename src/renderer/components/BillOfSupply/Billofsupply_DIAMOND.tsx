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
import { useNavigate } from 'react-router-dom';
import { BACK_DIAMOND, CREATE_INVOICE_DIAMOND } from 'renderer/path';
import InvoiceNo from '../InvoiceNo';
import TableRow from '../TableRow';
import { TaxStore } from '../Dashbord';
import { Taxstore, ProductD } from '../../types/index';

const Billofsupply_DIAMOND = React.forwardRef((_props, _ref) => {
  const store: Taxstore = useContext(TaxStore);
  const navigate = useNavigate();
  const refer = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const testREF = React.useRef() as React.MutableRefObject<HTMLButtonElement>;
  // @ts-ignore
  const { invoiceDetail } = store;
  let QTY = 0;
  let MC = 0;
  let WEIGHT = 0;
  let VOS = 0;
  let DiamondWeight = 0;
  let DiamondPrice = 0;
  invoiceDetail?.products.forEach((element: any) => {
    QTY += element.qty;
    WEIGHT += parseFloat(element.wt);
    MC += parseFloat(element.mc);
    VOS += element.wt * (invoiceDetail.rate / 10) + element.mc * element.wt;
    DiamondWeight += element.dm_wt;
    DiamondPrice += element.dm_price;
  });

  const SUBTOTAL = parseFloat(
    `${+parseFloat(`${VOS}`).toFixed(2) + +DiamondPrice.toFixed(2)}`
  ).toFixed(2);
  const ROUNDOFF = parseFloat(
    Math.abs(+SUBTOTAL - Math.round(+SUBTOTAL)).toFixed(2)
  );
  const ROUND = parseFloat(`${Math.round(+SUBTOTAL)}`);
  const finalize = () => {
    window.electron.ipcRenderer.askUser('ASK_USER', [
      'Do you want to finalize?',
    ]);
  };
  window.electron.ipcRenderer.on('ASK_USER', (arg) => {
    // @ts-ignore
    if (arg.response === 0) {
      window.electron.ipcRenderer.finalizeBos('bosfinal', [true]);
    }
  });

  return (
    <>
      <div className="left" ref={refer}>
        <div className="leftview">
          <div className="table">
            <div className="top">
              <span>Bill Of Supply</span>
            </div>
            <h1>SNEHAMOYEE JEWELLERS</h1>
            <h4>Preambazar,Hijli Co-Oprative-721306,Kharagpur,West Mednapur</h4>
            <h3>GSTIN: 19AILPD7509G1Z5</h3>
            <h4>9434146334 / 8637846121</h4>
            <InvoiceNo ino={invoiceDetail?.slno} />
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
                <th>Weight</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>M/C charge</th>
                <th>Diamond Weight</th>
                <th>Diamond Price</th>
                <th>Value of supply</th>
              </thead>
              <tbody>
                {invoiceDetail?.products.map((_e: ProductD, index: number) => (
                  <TableRow
                    i={index + 1}
                    name={_e.name}
                    wt={_e.wt}
                    qty={_e.qty}
                    rate={invoiceDetail.rate}
                    mc={_e.mc}
                    dm_wt={_e.dm_wt}
                    dm_price={_e.dm_price}
                  />
                ))}
                <tr className="sp">
                  <td />
                  <td>Total: </td>
                  <td>{QTY} pc</td>
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
                  <td>{DiamondWeight.toFixed(2)}</td>
                  <td>{DiamondPrice.toFixed(2)}</td>
                  <td>
                    {+parseFloat(`${VOS}`).toFixed(2) +
                      +DiamondPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="roffc">
              <div className="roff-l">
                <h5>Payment Mode: {invoiceDetail?.mode}</h5>
              </div>
              <div className="roff-r">
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
                  <div className="r" contentEditable>{`${Math.round(
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
        onAfterPrint={finalize}
        content={() => refer.current}
      />
      <button
        type="button"
        onClick={() => navigate(`/${CREATE_INVOICE_DIAMOND}/${BACK_DIAMOND}`)}
      >
        Back
      </button>
    </>
  );
});

export default Billofsupply_DIAMOND;
