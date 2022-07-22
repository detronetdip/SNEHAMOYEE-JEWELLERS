/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
// @ts-ignore
import React from 'react';
import { ProductD } from '../types/index';

function TableRow({ i, name, wt, qty, rate, mc, dm_wt, dm_price }: ProductD) {
  return (
    <>
      <tr>
        <td>{i}</td>
        <td>{name}</td>
        <td>{qty} pc</td>
        <td>{wt} gms</td>
        <td>{rate}</td>
        <td>{parseFloat(`${wt * (rate / 10)}`).toFixed(2)}</td>
        <td>{mc}</td>
        <td>{dm_wt.toFixed(2)}</td>
        <td>{dm_price.toFixed(2)}</td>
        <td>
          {+parseFloat(`${wt * (rate / 10) + mc * wt}`).toFixed(2) +
            +dm_price.toFixed(2)}
        </td>
      </tr>
    </>
  );
}

export default TableRow;
