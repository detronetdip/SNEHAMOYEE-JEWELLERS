/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
// @ts-ignore
import React from 'react';
import { CostumeProductD } from '../types/index';

function TableRow4({ i, name, qty, price, dis }: CostumeProductD) {
  return (
    <>
      <tr>
        <td>{i}</td>
        <td>{name}</td>
        <td>{qty} pc</td>
        <td>{price}</td>
        <td>{dis}</td>
        <td>{(price - (price * dis) / 100).toFixed(2)}</td>
      </tr>
    </>
  );
}

export default TableRow4;
