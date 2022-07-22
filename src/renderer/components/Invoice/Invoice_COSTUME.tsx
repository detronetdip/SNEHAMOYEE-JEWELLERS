/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useState } from 'react';
// @ts-ignore
import num2words from 'num-words';
import InvoiceNo from '../InvoiceNo';
import { TaxStore } from '../Dashbord';
import TableRow4 from '../TableRow4';
import { TaxstoreForCostume, CostumeProductD } from '../../types/index';

const Invoice_Costume = React.forwardRef((_props, _ref) => {
  const store: TaxstoreForCostume = useContext(TaxStore);
  const refer = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [ino, setIno] = useState(0);
  // @ts-ignore
  const { invoiceDetail } = store;
  let QTY = 0;
  let PRICE = 0;
  let DISCOUNT = 0;
  let TOTAL = 0;
  invoiceDetail?.products.forEach((element: any) => {
    QTY += element.qty;
    PRICE += parseFloat(element.price);
    DISCOUNT += parseFloat(element.dis);
    TOTAL += PRICE - (PRICE * DISCOUNT) / 100;
  });
  const SUBTOTAL = parseFloat(
    `${
      parseFloat(parseFloat(`${(TOTAL * 3) / 100}`).toFixed(2)) +
      parseFloat(`${TOTAL}`)
    }`
  ).toFixed(2);
  const ROUNDOFF = parseFloat(
    Math.abs(+SUBTOTAL - Math.round(+SUBTOTAL)).toFixed(2)
  );
  const ROUND = parseFloat(`${Math.round(+SUBTOTAL)}`);
  window.electron.ipcRenderer.getInvoiceNo('INVOICENO', ['ping']);
  window.electron.ipcRenderer.on('INVOICENO', (arg) => {
    // @ts-ignore
    setIno(arg.c.TI + 1);
  });
  const askToSave = () => {
    window.electron.ipcRenderer.askUser('ASK_USER', ['Do you want to save?']);
  };
  window.electron.ipcRenderer.on('ASK_USER', (arg) => {
    // @ts-ignore
    if (arg.response === 0) {
      const date = new Date();
      const d = date.getDate();
      const m = date.getMonth();
      const y = date.getFullYear();
      const fdr = `${d > 9 ? d : `0${d}`}-${m > 9 ? m : `0${m}`}-${y}`;
      window.electron.ipcRenderer.saveInvoice('SAVE_INVOICE', [
        invoiceDetail,
        `SJ${ino}`,
      ]);
      store.setInvoiceDetail?.({
        data: invoiceDetail,
        date: fdr,
        id: `SJ${ino}`,
      });
      store.setDisplay?.(store.PAGES?.[29]);
    }
  });

  return (
    <>
      <div className="left" ref={refer}>
        <div className="leftview">
          <div className="table">
            <div className="top">
              <span>TAX INVOICE-</span>
            </div>
            <h1>SNEHAMOYEE JEWELLERS</h1>
            <h4>Preambazar,Hijli Co-Oprative-721306,Kharagpur,West Mednapur</h4>
            <h3>GSTIN: 19AILPD7509G1Z5</h3>
            <h4>9434146334 / 8637846121</h4>
            <InvoiceNo ino={ino} />
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
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </thead>
              <tbody>
                {invoiceDetail?.products.map(
                  (_e: CostumeProductD, index: number) => (
                    <TableRow4
                      i={index + 1}
                      name={_e.name}
                      qty={_e.qty}
                      price={_e.price}
                      dis={_e.dis}
                      key={_e.name}
                    />
                  )
                )}
                <tr className="sp">
                  <td />
                  <td>Total: </td>
                  <td>{QTY} pc</td>
                  <td>{parseFloat(`${PRICE}`).toFixed(2)}</td>
                  <td>{parseFloat(`${DISCOUNT}`).toFixed(2)} %</td>
                  <td>{TOTAL.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="roffc">
              <div className="roff-l">
                <h5>Payment Mode: {invoiceDetail?.mode}</h5>
              </div>
              <div className="roff-r">
                <div className="row1">
                  <div className="l">CGST</div>
                  <div className="r">1.5%</div>
                </div>
                <div className="row1">
                  <div className="l">SGST</div>
                  <div className="r">1.5%</div>
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

      <button type="button" onClick={askToSave}>
        Save
      </button>
      <button
        type="button"
        onClick={() => store.setDisplay?.(store.PAGES?.[8])}
      >
        Back
      </button>
    </>
  );
});

export default Invoice_Costume;
