/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useContext, useEffect } from 'react';
import { TaxStore } from '../Dashbord';
import { INVOICE_VIEW_DATA, Taxstore } from '../../types/index';

const view = () => {
  // @ts-ignore
  window.electron.ipcRenderer.getAllInvoice('getinvoice', [true]);
};
const InvoiceBOX = ({ id, data, date }: INVOICE_VIEW_DATA) => {
  const taxStore: Taxstore = useContext(TaxStore);
  console.log(taxStore);
  const seeInvoice = (dt: object) => {
    taxStore.setInvoiceDetail?.(dt);
    taxStore.setDisplay?.(taxStore.PAGES?.[12]);
  };
  const delInvoice = (dt: { data: object; date: string; id: string }) => {
    window.electron.ipcRenderer.delInvoice('delInvoice', [dt.date, dt.id]);
  };
  window.electron.ipcRenderer.on('CONF_DELETE', (_arg: unknown) => {
    view();
  });
  const dts = {
    data,
    date,
    id,
  };
  return (
    <>
      <div className="invoicebox">
        <h4>{id}</h4>
        <div className="btb">
          <button type="button" onClick={() => seeInvoice(dts)}>
            View
          </button>
          <button type="button" onClick={() => delInvoice(dts)}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};
function Viewinvoice() {
  const [s, sets] = useState([]);
  window.electron.ipcRenderer.on('sentINVOICE', (arg) => {
    // @ts-ignore
    sets(arg);
  });
  useEffect(() => {
    view();
  }, []);
  return (
    <>
      <div className="viewage">
        <h1>Viewinvoice</h1>
        <div className="invoiceboxcontainer">
          {s.map((p: INVOICE_VIEW_DATA) => (
            <InvoiceBOX id={p?.id} data={p.data} date={p.date} key={p.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Viewinvoice;
