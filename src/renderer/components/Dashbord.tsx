/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
// import ShowInvoiceIcon from '../../../assets/archive-alt.svg';
import { useState, createContext, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import ion from '../../../assets/sjb.png';
import InvoiceIcon from '../../../assets/invoice.svg';
import SyncIcon from '../../../assets/sync.svg';
import SettingIcon from '../../../assets/setting.svg';
import PLushIcon from '../../../assets/plus.svg';
import Generateinvoice from './pages/Generateinvoice';
import TaxInvoice_G from './pages/InvoiceForm/TaxInvoice_G';
import TaxInvoice_S from './pages/InvoiceForm/TaxInvoice_S';
import TaxInvoice_D from './pages/InvoiceForm/TaxInvoice_D';
import TaxInvoice_Costume from './pages/InvoiceForm/TaxInvoice-costume';
import Esteemed_GOLD from './esteemed/GOLD';
import Esteemed_SILVER from './esteemed/SILVER';
import Esteemed_DIAMOND from './esteemed/DIAMOND';
import AddItem from './pages/AddItem';
import Invoice_GOLD from './Invoice/Invoice_GOLD';
import Invoice_SILVER from './Invoice/Invoice_SILVER';
import Invoice_DIAMOND from './Invoice/Invoice_DIAMOND';
import Billofsupply_DIAMOND from './BillOfSupply/Billofsupply_DIAMOND';
import Billofsupply_GOLD from './BillOfSupply/Billofsupply_GOLD';
import Billofsupply_SILVER from './BillOfSupply/Billofsupply_SILVER';
import TaxinvoiceBack_G from './TaxInvoiceBack/TaxinvoiceBack_G';
import TaxinvoiceBack_S from './TaxInvoiceBack/TaxinvoiceBack_S';
import TaxinvoiceBack_D from './TaxInvoiceBack/Diamond_Invoice_Back';
import Costume_Invoice from './Invoice/Invoice_COSTUME';
import Viewinvoice from './pages/Viewinvoice';
import Invoice_v from './Invoice_v';
import {
  ADD_ITEM,
  CREATE_INVOICE_GOLD,
  CREATE_INVOICE_SILVER,
  CREATE_INVOICE_DIAMOND,
  VIEW_INVOICE_GOLD,
  VIEW_ESTEEMED_GOLD,
  BACK_GOLD,
  VIEW_INVOICE_DIAMOND,
  VIEW_BOS_DIAMOND,
  BACK_DIAMOND,
  VIEW_BOS_GOLD,
  VIEW_INVOICE_SILVER,
  VIEW_ESTEEMED_SILVER,
  VIEW_BOS_SILVER,
  BACK_SILVER,
  VIEW_ESTEEMED_DIAMOND,
  COSTUME,
  VIEW_INVOICE,
  COSTUME_INVOICE,
} from '../path';

const ShowStore = createContext({});
const TaxStore = createContext({});
function Dashbord() {
  const navigate = useNavigate();
  console.log(useLocation());

  const PAGES = [
    'DASHBORD', // 0
    'ALL_INVOICE', // 1
    'ADD_ITEM', // 2
    'CREATE_INVOICE_GOLD', // 3
    'CREATE_INVOICE_SILVER', // 4
    'CREATE_INVOICE_DIAMOND', // 5
    'VIEW_INVOICE_GOLD', // 6
    'VIEW_ESTEEMED_GOLD', // 7
    'BACK_GOLD', // 8
    'VIEW_INVOICE_DIAMOND', // 9
    'VIEW_BOS_DIAMOND', // 10
    'BACK_DIAMOND', // 11
    'VIEW_INVOICE', // 12
    'VIEW_BOS_GOLD', // 13
    'VIEW_INVOICE_SILVER', // 14
    'VIEW_ESTEEMED_SILVER', // 15
    'VIEW_BOS_SILVER', // 16
    'BACK_SILVER', // 17
    'VIEW_ESTEEMED_DIAMOND', // 18
    'VIEW_INVOICE_DIAMOND_AFTER_SAVE', // 19
    'VIEW_INVOICE_GOLD_AFTER_SAVE', // 20
    'VIEW_INVOICE_SILVER_AFTER_SAVE', // 21
    'VIEW_INVOICE_GOLD_AFTER_SAVE_ESTEEMED', // 22
    'VIEW_INVOICE_GOLD_AFTER_SAVE_BOS', // 23
    'VIEW_INVOICE_SILVER_AFTER_SAVE_ESTEEMED', // 24
    'VIEW_INVOICE_SILVER_AFTER_SAVE_BOS', // 25
    'VIEW_INVOICE_DIAMOND_AFTER_SAVE_ESTEEMED', // 26
    'VIEW_INVOICE_DIAMOND_AFTER_SAVE_BOS', // 27
    'COSTUME', // 28
    'COSTUME_INVOICE', // 29
  ];
  const [display, setDisplay] = useState('/');
  const [showprogress, setShowprogress] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [updateMsg, setUpdateMsg] = useState('');
  const [version, setVersion] = useState('');
  const downloadUpdate = () => {
    setShowprogress(true);
    window.electron.ipcRenderer.checkUpdate('UPDATE', [true]);
  };
  window.electron.ipcRenderer.on('UPDATE', (arg) => {
    console.log(arg);
  });
  window.electron.ipcRenderer.on('message', (arg) => {
    if (arg === `Update not available`) {
      setTimeout(() => {
        setShowprogress(false);
      }, 1000);
    }
    // @ts-ignore
    setUpdateMsg(arg);
    if (arg === 'Update available') {
      setTimeout(() => {
        setUpdateMsg('Downloding update');
      }, 1000);
    }
  });
  useEffect(() => {
    window.electron.ipcRenderer.getVersion('getVersion', [true]);
  }, []);
  window.electron.ipcRenderer.on('getVersion', (arg: any) => {
    setVersion(`v${arg}`);
  });

  return (
    <>
      <div className="nav">
        <img src={ion} alt="" />
        <img src={SettingIcon} alt="" />
        <div
          className="j"
          style={{
            color: '#b4b4b4',
            fontSize: '1.2rem',
          }}
        >
          {version}
        </div>
      </div>
      <div className="wa">
        <div className="leftnav">
          <ul>
            <li onClick={() => navigate('/')}>
              <span>
                <img src={InvoiceIcon} alt="" />
              </span>{' '}
              Generate invoice
            </li>
            {/* <li onClick={() => setDisplay(ALL_INVOICE)}>
              <span>
                <img src={ShowInvoiceIcon} alt="" />
              </span>{' '}
              All Invoice
            </li> */}
            <li onClick={() => navigate(ADD_ITEM)}>
              <span>
                <img src={PLushIcon} alt="" />
              </span>
              Add Item
            </li>
          </ul>
          <div
            className="db"
            style={{
              color: '#b3b3b3',
              fontSize: '1.2rem',
              position: 'absolute',
              bottom: '0.8%',
              left: '6%',
            }}
          >
            Developed By: Ayondip jana
          </div>
          <div className="downloadbox">
            {showprogress ? (
              <div className="update_message">
                <div className="spinner">
                  <img src={SyncIcon} alt="" />
                </div>
                <div className="msg">{updateMsg}</div>
              </div>
            ) : (
              <button
                type="button"
                onClick={downloadUpdate}
                style={{
                  boxShadow: 'none',
                }}
              >
                Check for Update
              </button>
            )}
          </div>
        </div>
        <div className="rightarea">
          <TaxStore.Provider
            value={{
              display,
              setDisplay,
              PAGES,
              invoiceDetail,
              setInvoiceDetail,
            }}
          >
            <Routes>
              <Route path="/" element={<Generateinvoice />} />
              <Route path={ADD_ITEM} element={<AddItem />} />
              <Route path={CREATE_INVOICE_GOLD} element={<TaxInvoice_G />} />
              <Route path={CREATE_INVOICE_SILVER} element={<TaxInvoice_S />} />
              <Route path={CREATE_INVOICE_DIAMOND} element={<TaxInvoice_D />} />
              <Route path={COSTUME} element={<TaxInvoice_Costume />} />
              <Route
                path={`${CREATE_INVOICE_GOLD}/${VIEW_INVOICE_GOLD}`}
                element={<Invoice_GOLD />}
              />
              <Route
                path={`${CREATE_INVOICE_GOLD}/${VIEW_ESTEEMED_GOLD}`}
                element={<Esteemed_GOLD />}
              />
              <Route
                path={`${CREATE_INVOICE_GOLD}/${VIEW_BOS_GOLD}`}
                element={<Billofsupply_GOLD />}
              />
              <Route
                path={`${CREATE_INVOICE_GOLD}/${BACK_GOLD}`}
                element={<TaxinvoiceBack_G />}
              />
              <Route
                path={`${CREATE_INVOICE_SILVER}/${VIEW_INVOICE_SILVER}`}
                element={<Invoice_SILVER />}
              />
              <Route
                path={`${CREATE_INVOICE_SILVER}/${VIEW_ESTEEMED_SILVER}`}
                element={<Esteemed_SILVER />}
              />
              <Route
                path={`${CREATE_INVOICE_SILVER}/${VIEW_BOS_SILVER}`}
                element={<Billofsupply_SILVER />}
              />
              <Route
                path={`${CREATE_INVOICE_SILVER}/${BACK_SILVER}`}
                element={<TaxinvoiceBack_S />}
              />
              <Route
                path={`${CREATE_INVOICE_DIAMOND}/${VIEW_INVOICE_DIAMOND}`}
                element={<Invoice_DIAMOND />}
              />
              <Route
                path={`${CREATE_INVOICE_DIAMOND}/${VIEW_ESTEEMED_DIAMOND}`}
                element={<Esteemed_DIAMOND />}
              />
              <Route
                path={`${CREATE_INVOICE_DIAMOND}/${VIEW_BOS_DIAMOND}`}
                element={<Billofsupply_DIAMOND />}
              />
              <Route
                path={`${CREATE_INVOICE_DIAMOND}/${BACK_DIAMOND}`}
                element={<TaxinvoiceBack_D />}
              />
            </Routes>
          </TaxStore.Provider>
        </div>
      </div>
    </>
  );
}
export { ShowStore, TaxStore };
export default Dashbord;
