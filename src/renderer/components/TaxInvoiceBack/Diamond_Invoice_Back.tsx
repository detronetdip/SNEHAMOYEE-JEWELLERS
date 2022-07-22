/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useContext, useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CREATE_INVOICE_DIAMOND,
  VIEW_BOS_DIAMOND,
  VIEW_ESTEEMED_DIAMOND,
  VIEW_INVOICE_DIAMOND,
} from 'renderer/path';
import { TaxStore } from '../Dashbord';
import Delete from '../../../../assets/delete.svg';
import { Taxstore, AllProduct, ProductD } from '../../types/index';

function Diamond_Invoice_Back() {
  const taxStore: Taxstore = useContext(TaxStore);
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [button, setButton] = useState(0);
  const [gotProducts, setGotProducts] = useState([]);
  const [ino, setIno] = useState({});

  const [currentInvoice, setCurrentInvoice] = useState({
    cAdd: taxStore.invoiceDetail?.cAdd,
    cMobile: taxStore.invoiceDetail?.cMobile,
    cName: taxStore.invoiceDetail?.cName,
    cPin: taxStore.invoiceDetail?.cPin,
    rate: taxStore.invoiceDetail?.rate,
    mode: taxStore.invoiceDetail?.mode,
    products: taxStore.invoiceDetail?.products,
  });
  console.log(currentInvoice);

  useEffect(() => {
    // @ts-ignore
    setProducts(currentInvoice?.products);
  }, []);
  useEffect(() => {
    window.electron.ipcRenderer.fetchItems('FetchItems', [true]);
  }, []);
  window.electron.ipcRenderer.on('FetchItems', (arg: any) => {
    setAllProducts(arg);
  });
  const productChange = (e: { target: { name: string; value: any } }) => {
    const f: Array<string> = e.target.name.split('-');
    const dt: ProductD[] = [];
    console.log(1);

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
        wt: 1,
        mc: 1,
      };
      // @ts-ignore
      setProducts((e) => {
        return [...e, obj];
      });
    } else {
      window.electron.ipcRenderer.showDialog('Dialog', [true]);
    }
  };
  const valueChange = (e: { target: { name: string; value: any } }) => {
    const f: Array<string> = e.target.name.split('-');
    const n = f[0];
    const v = e.target.value;
    setCurrentInvoice((k) => {
      const d = { ...k, [n]: v };
      return d;
    });
  };
  const findProducts = (k: { target: { name: string; value: any } }) => {
    const f: React.SetStateAction<Array<object>> = [];
    allProducts.map((e: AllProduct) => {
      if (e.productName.indexOf(k.target.value) !== -1) {
        f.push(e);
      }
    });
    // @ts-ignore
    setGotProducts(f);
  };
  const handelSubmit = (event: FormEvent) => {
    event.preventDefault();
    const { cName } = currentInvoice;
    const { cAdd } = currentInvoice;
    const { cPin } = currentInvoice;
    const { cMobile } = currentInvoice;
    const { rate } = currentInvoice;
    const { mode } = currentInvoice;
    const detail = {
      cName,
      cAdd,
      cPin,
      cMobile,
      products,
      rate,
      mode,
    };
    taxStore.setInvoiceDetail?.(detail);
    if (button === 1) {
      // @ts-ignore
      detail.slno = ino.TI + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(`/${CREATE_INVOICE_DIAMOND}/${VIEW_INVOICE_DIAMOND}`);
    } else if (button === 2) {
      // @ts-ignore
      detail.slno = ino.Estd + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(`/${CREATE_INVOICE_DIAMOND}/${VIEW_ESTEEMED_DIAMOND}`);
    } else {
      // @ts-ignore
      detail.slno = ino.BS + 1;
      taxStore.setInvoiceDetail?.(detail);
      navigate(`/${CREATE_INVOICE_DIAMOND}/${VIEW_BOS_DIAMOND}`);
    }
  };
  const deleteProduct = (event: FormEvent) => {
    // @ts-ignore
    const pname = event.target.name;
    const dt: ProductD[] = [];
    products.map((p: ProductD) => {
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
        <h1>Create Tax Invoice (Diamond)</h1>
        <div className="taxinvoicecontainer">
          <div className="leftside">
            <form onSubmit={handelSubmit}>
              <div className="formrow">
                <h4>Customer Name</h4>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  required
                  value={currentInvoice.cName}
                  name="cName"
                  onChange={valueChange}
                />
              </div>
              <div className="formrow">
                <h4>Customer Address</h4>

                <input
                  type="text"
                  placeholder="Enter customer address"
                  required
                  value={currentInvoice.cAdd}
                  name="cAdd"
                  onChange={valueChange}
                />
              </div>
              <div className="formrow">
                <h4>Customer Pin</h4>

                <input
                  type="number"
                  placeholder="Enter customer pin"
                  required
                  value={currentInvoice.cPin}
                  name="cPin"
                  onChange={valueChange}
                />
              </div>
              <div className="formrow">
                <h4>Customer Mobile</h4>

                <input
                  type="number"
                  placeholder="Enter customer mobile"
                  required
                  value={currentInvoice.cMobile}
                  name="cMobile"
                  onChange={valueChange}
                />
              </div>
              <div className="formrow">
                <h4>Rate</h4>

                <input
                  type="number"
                  placeholder="Enter rate"
                  required
                  value={currentInvoice.rate}
                  name="rate"
                  onChange={valueChange}
                />
              </div>
              <div className="formrow">
                <h4>Payment Mode</h4>

                <select
                  name="mode"
                  id=""
                  value={currentInvoice.mode}
                  onChange={valueChange}
                >
                  <option value="Cash" selected>
                    Cash
                  </option>
                  <option value="Online">Online</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="formrow">
                <h4>Products</h4>
                {products.map((e: ProductD) => (
                  <div className="productrow">
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
                        onChange={productChange}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Weight</h5>
                      <input
                        type="number"
                        name={`${e.name}-wt`}
                        value={e.wt}
                        onChange={productChange}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>M/C</h5>
                      <input
                        type="number"
                        name={`${e.name}-mc`}
                        value={e.mc}
                        onChange={productChange}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Diamond Wt</h5>
                      <input
                        type="number"
                        name={`${e.name}-dm_wt`}
                        value={e.dm_wt}
                        onChange={productChange}
                      />
                    </div>
                    <div className="innerrow">
                      <h5>Diamond Price</h5>
                      <input
                        type="number"
                        name={`${e.name}-dm_price`}
                        value={e.dm_price}
                        onChange={productChange}
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
                type="text"
                placeholder="Enter product name"
                onChange={findProducts}
              />
            </form>
            <ul>
              {gotProducts.map((e: AllProduct) => (
                <>
                  <li>
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

export default Diamond_Invoice_Back;
