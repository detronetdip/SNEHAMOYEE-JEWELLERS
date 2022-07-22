import {
  Channels,
  TestChannel,
  ASk_USER,
  DeleteItemChannel,
  Dialog,
  FetchItemChannel,
  GetInvoiceNo,
  SAVE_INVOICE,
  UpdateChannel,
  getAll_INVOICE,
  del_INVOICE,
  getVersion,
  EstdFinal,
  BosFinal,
} from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        addNewItem(channel: TestChannel, args: unknown[]): void;
        checkUpdate(channel: UpdateChannel, args: unknown[]): void;
        fetchItems(channel: FetchItemChannel, args: unknown[]): void;
        deleteItem(channel: DeleteItemChannel, args: unknown[]): void;
        getInvoiceNo(channel: GetInvoiceNo, args: unknown[]): void;
        showDialog(channel: Dialog, args: unknown[]): void;
        askUser(channel: ASk_USER, args: unknown[]): void;
        saveInvoice(channel: SAVE_INVOICE, args: unknown[]): void;
        getAllInvoice(channel: getAll_INVOICE, args: unknown[]): void;
        delInvoice(channel: del_INVOICE, args: unknown[]): void;
        getVersion(channel: getVersion, args: unknown[]): void;
        finalizeEstd(channel: EstdFinal, args: unknown[]): void;
        finalizeBos(channel: BosFinal, args: unknown[]): void;
      };
    };
  }
}

export {};
