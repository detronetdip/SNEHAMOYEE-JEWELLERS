/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-cycle */
import { useNavigate } from 'react-router-dom';
import {
  CREATE_INVOICE_GOLD,
  CREATE_INVOICE_DIAMOND,
  CREATE_INVOICE_SILVER,
  COSTUME,
} from '../../path/index';

function Generateinvoice() {
  const navigate = useNavigate();

  return (
    <>
      <div className="generateinvoicepage">
        <h1>Generate Invoice</h1>
        <div className="btnrow">
          <button type="button" onClick={() => navigate(CREATE_INVOICE_GOLD)}>
            Gold
          </button>
          <button type="button" onClick={() => navigate(CREATE_INVOICE_SILVER)}>
            Silver
          </button>
          <button
            type="button"
            onClick={() => navigate(CREATE_INVOICE_DIAMOND)}
          >
            Diamond
          </button>
          <button
            className="disabled"
            type="button"
            onClick={() => navigate(COSTUME)}
            disabled
          >
            <span>This section is under development.</span>
            Costume
          </button>
        </div>
      </div>
    </>
  );
}

export default Generateinvoice;
