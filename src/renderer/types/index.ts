/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
type AllProductD = {
  name: string;
  wt: number;
  gwt: number;
  qty: number;
  rate: number;
  mc: number;
  dm_wt: number;
  dm_price: number;
  i: number;
};
type CostumeProductD = {
  name: string;
  qty: number;
  price: number;
  dis: number;
  i: number;
};
type Taxstore = {
  display?: string;
  setDisplay?: Function;
  PAGES?: Array<string>;
  invoiceDetail?: {
    cAdd: string;
    cMobile: string;
    cName: string;
    cPin: string;
    rate: number;
    mode: string;
    slno: string;
    products: Array<AllProductD>;
  };
  setInvoiceDetail?: Function;
};
type TaxstoreForCostume = {
  display?: string;
  setDisplay?: Function;
  PAGES?: Array<string>;
  invoiceDetail?: {
    cAdd: string;
    cMobile: string;
    cName: string;
    cPin: string;
    mode: string;
    products: Array<CostumeProductD>;
  };
  setInvoiceDetail?: Function;
};
type TaxstoreWithIdDate = {
  display?: string;
  setDisplay?: Function;
  PAGES?: Array<string>;
  invoiceDetail?: {
    data?: {
      cAdd: string;
      cMobile: string;
      cName: string;
      cPin: string;
      rate: number;
      mode: string;
      products: Array<{
        name: string;
        wt: number;
        gwt: number;
        qty: number;
        rate: number;
        mc: number;
        dm_wt: number;
        dm_price: number;
        i: number;
      }>;
      id: string;
      date: string;
    };
  };
  setInvoiceDetail?: Function;
};
type ProductD = {
  name: string;
  wt: number;
  qty: number;
  rate: number;
  mc: number;
  dm_wt: number;
  dm_price: number;
  i: number;
};
type Product = {
  name: string;
  wt: number;
  qty: number;
  rate: number;
  mc: number;
  i: number;
};
type ProductGold = {
  name: string;
  wt: number;
  qty: number;
  rate: number;
  gwt: number;
  mc: number;
  i: number;
};
type ProductWOndex = {
  name: string;
  wt: number;
  gwt: number;
  qty: number;
  mc: number;
};
type ProductWOgwt = {
  name: string;
  qty: number;
  price: number;
  dis: number;
};
type Inotype = {
  ino?: string;
};
type AllProduct = {
  productName: string;
};
type INVOICE_VIEW_DATA = {
  id: string;
  data: {
    cAdd: string;
    cMobile: string;
    cName: string;
    cPin: string;
    mode: string;
    rate: string;
    products: [
      {
        mc: number;
        name: string;
        qty: number;
        wt: number;
      }
    ];
  };
  date: string;
};
type GeneateInvoiceView = {
  display?: string;
  setDisplay?: Function;
  PAGES?: Array<string>;
};
type AddItemRow = {
  index: number;
  name: string;
};

export {
  Taxstore,
  ProductD,
  Product,
  Inotype,
  ProductWOndex,
  AllProduct,
  ProductGold,
  INVOICE_VIEW_DATA,
  TaxstoreWithIdDate,
  GeneateInvoiceView,
  AddItemRow,
  ProductWOgwt,
  TaxstoreForCostume,
  CostumeProductD,
};
