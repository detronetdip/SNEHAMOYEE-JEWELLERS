/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// import Invoice from '../Invoice';
import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VIEW_BOS_DIAMOND,
  VIEW_ESTEEMED_DIAMOND,
  VIEW_INVOICE_DIAMOND,
} from 'renderer/path';
import { TaxStore } from '../../Dashbord';
import Delete from '../../../../../assets/delete.svg';
import { Taxstore, AllProduct, ProductD } from '../../../types/index';

function TaxInvoice() {
  const taxStore: Taxstore = useContext(TaxStore);
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [gotProducts, setGotProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [ino, setIno] = useState({});
  const [button, setButton] = useState(0);
  const itemName = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const paymentMode =
    React.useRef() as React.MutableRefObject<HTMLSelectElement>;
  const customerName =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const customerAddress =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const customerPin =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const customerMobile =
    React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const RATE = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    window.electron.ipcRenderer.fetchItems('FetchItems', [true]);
  }, []);
  window.electron.ipcRenderer.on('FetchItems', (arg: any) => {
    setAllProducts(arg);
  });
  const findProducts = () => {
    const f: React.SetStateAction<Array<object>> = [];

    allProducts.map((e: AllProduct) => {
      if (e.productName.indexOf(itemName.current.value) !== -1) {
        f.push(e);
      }
    });
    // @ts-ignore
    setGotProducts(f);
  };
  const addThisProduct = (pname: string): void => {
    let flag = false;
    products.map((p: ProductD) => {
      if (p.name === pname) {
        flag = true;
      }
    });
    if (!flag) {
      const obj = {
        name: pname,
        qty: 1,
        wt: 0,
        mc: 0,
        dm_wt: 0,
        dm_price: 0,
      };
      // @ts-ignore
      setProducts((e) => {
        return [...e, obj];
      });
    } else {
      window.electron.ipcRenderer.showDialog('Dialog', [true]);
    }
  };
  const changeProduct = (e: { target: { name: string; value: any } }) => {
    const f: Array<string> = e.target.name.split('-');
    const dt: ProductD[] = [];
    console.log(products);

    products.map((p: ProductD) => {
      if (p.name === f[0]) {
        const ky = f[1];
        // @ts-ignore
        p[ky] = parseFloat(e.target.value);
      }
      dt.push(p);
    });
    // @ts-ignore
    setProducts(dt);
  };
  const handelSubmit = (event: FormEvent) => {
    event.preventDefault();
    const cName = customerName.current.value;
    const cAdd = customerAddress.current.value;
    const cPin = customerPin.current.value;
    const cMobile = customerMobile.current.value;
    const rate = RATE.current.value;
    const mode = paymentMode.current.value;
    const detail = {
      cName,
      cAdd,
      cPin,
      cMobile,
      products,
      rate,
      mode,
    };
    if (button === 1) {
      // @ts-ignore
      detail.slno = ino.TI + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(VIEW_INVOICE_DIAMOND);
    } else if (button === 2) {
      // @ts-ignore
      detail.slno = ino.Estd + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(VIEW_ESTEEMED_DIAMOND);
    } else {
      // @ts-ignore
      detail.slno = ino.BS + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(VIEW_BOS_DIAMOND);
    }
  };
  const deleteProduct = (event: FormEvent) => {
    // @ts-ignore
    const pname = event.target.name;
    const dt: ProductD[] = [];
    products.map((p: ProductD, _index: number) => {
      if (p.name !== pname) {
        dt.push(p);
      }
    });
    // @ts-ignore
    setProducts(dt);
  };
  useEffect(() => {
    window.electron.ipcRenderer.getInvoiceNo('INVOICENO', ['ping']);
    console.log('ok');
  }, []);
  window.electron.ipcRenderer.on('INVOICENO', (arg) => {
    // @ts-ignore
    setIno(arg.c);
    // @ts-ignore
    console.log(arg.c);
  });

  return (
    <>
      <div className="taxinvoicepage">
        <h1>Create Invoice (Diamond)</h1>
        <div className="taxinvoicecontainer">
          <div className="leftside">
            <form onSubmit={handelSubmit}>
              <div className="formrow">
                <h4>Customer Name</h4>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  required
                  ref={customerName}
                />
              </div>
              <div className="formrow">
                <h4>Customer Address</h4>

                <input
                  type="text"
                  placeholder="Enter customer address"
                  required
                  ref={customerAddress}
                />
              </div>
              <div className="formrow">
                <h4>Customer Pin</h4>

                <input
                  type="number"
                  placeholder="Enter customer pin"
                  required
                  ref={customerPin}
                />
              </div>
              <div className="formrow">
                <h4>Customer Mobile</h4>

                <input
                  type="number"
                  placeholder="Enter customer mobile"
                  required
                  ref={customerMobile}
                />
              </div>
              <div className="formrow">
                <h4>Rate</h4>

                <input
                  type="number"
                  placeholder="Enter rate"
                  required
                  ref={RATE}
                />
              </div>
              <div className="formrow">
                <h4>Payment Mode</h4>

                <select
                  name="pmode"
                  id=""
                  ref={paymentMode}
                  defaultValue="Cash"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="formrow">
                <h4>Products</h4>
                {products.map((e: ProductD) => (
                  <div className="productrow" key={e.name}>
                    <div className="innerrow">
                      <h5>Name</h5>
                      <input type="text" value={e.name} readOnly />
                    </div>
                    <div className="innerrow">
                      <h5>Qty</h5>
                      <input
                        type="number"
                        value={e.qty}
                        name={`${e.name}-qty`}
                        onChange={changeProduct}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Weight</h5>
                      <input
                        type="number"
                        name={`${e.name}-wt`}
                        value={e.wt}
                        onChange={changeProduct}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>M/C</h5>
                      <input
                        type="number"
                        name={`${e.name}-mc`}
                        value={e.mc}
                        onChange={changeProduct}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Diamond Wt</h5>
                      <input
                        type="number"
                        name={`${e.name}-dm_wt`}
                        value={e.dm_wt}
                        onChange={changeProduct}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Diamond Price</h5>
                      <input
                        type="number"
                        name={`${e.name}-dm_price`}
                        value={e.dm_price}
                        onChange={changeProduct}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>&nbsp;</h5>
                      <button
                        type="button"
                        name={`${e.name}`}
                        onClick={deleteProduct}
                      >
                        {/* @ts-ignore */}
                        <img src={Delete} alt="" name={`${e.name}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" name="ti" onClick={() => setButton(1)}>
                Tax Invoice
              </button>{' '}
              &nbsp; &nbsp;
              <button type="submit" onClick={() => setButton(2)}>
                Esteemed
              </button>
              &nbsp; &nbsp;
              <button type="submit" onClick={() => setButton(3)}>
                Bill Of Supply
              </button>
            </form>
          </div>
          <div className="rightside">
            <form>
              <h4>Search and Add Products</h4>
              <input
                ref={itemName}
                type="text"
                placeholder="Enter product name"
                onChange={findProducts}
              />
            </form>
            <ul>
              {gotProducts.map((e: AllProduct) => (
                <>
                  <li key={e.productName}>
                    <span>{e.productName}</span>{' '}
                    <button
                      type="button"
                      onClick={() => addThisProduct(e.productName)}
                    >
                      Add
                    </button>
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaxInvoice;
