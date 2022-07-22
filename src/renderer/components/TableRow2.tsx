/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
// @ts-ignore
import React from 'react';
import { ProductGold } from '../types/index';

function TableRow2({ i, name, wt, qty, rate, mc, gwt }: ProductGold) {
  return (
    <>
      <tr>
        <td>{i}</td>
        <td>{name}</td>
        <td>{qty} pc</td>
        <td>{gwt} gms</td>
        <td>{wt} gms</td>
        <td>{rate}</td>
        <td>{parseFloat(`${wt * (rate / 10)}`).toFixed(2)}</td>
        <td>{mc}</td>
        <td>{parseFloat(`${wt * (rate / 10) + mc }`).toFixed(2)}</td>
      </tr>
    </>
  );
}

export default TableRow2;
