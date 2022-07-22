/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { AddItemRow } from '../../types/index';

const Tri = ({ index, name }: AddItemRow) => {
  const deleteProduct = (productId: number) => {
    // @ts-ignore
    window.electron.ipcRenderer.deleteItem('DeleteItem', productId - 1);
  };
  return (
    <>
      <tr>
        <td>{index}</td>
        <td>{name}</td>
        <td>
          <button type="button" onClick={() => deleteProduct(index)}>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
};
function AddItem() {
  const [message, setMessage] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const itemName = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { value } = itemName.current;
    itemName.current.value = '';
    window.electron.ipcRenderer.addNewItem('addNewItem', [value]);
  };
  window.electron.ipcRenderer.once('addNewItem', (arg: unknown) => {
    // @ts-ignore
    setMessage(arg);
    window.electron.ipcRenderer.fetchItems('FetchItems', [true]);
  });
  useEffect(() => {
    window.electron.ipcRenderer.fetchItems('FetchItems', [true]);
  }, []);
  window.electron.ipcRenderer.on('FetchItems', (arg: any) => {
    setAllProducts(arg);
  });
  return (
    <>
      <div className="additempage">
        <h1>Add Item</h1>
        <form onSubmit={handelSubmit}>
          <div className="inputrow">
            <h4>Item Name</h4>
            <input type="text" placeholder="Enter Item Name" ref={itemName} />
            <button type="submit"> Add </button>
          </div>
          <div className="error">
            <span>{message || ''}</span>
          </div>
        </form>
        <div className="itemlist">
          <table cellSpacing={0}>
            <thead>
              <th>Sl</th>
              <th>Product Name</th>
              <th>Action</th>
            </thead>
            <tbody>
              {allProducts.map((element: { productName: string }, i) => (
                <Tri
                  index={i + 1}
                  name={element.productName}
                  key={element.productName}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default AddItem;
