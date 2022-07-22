/* eslint-disable @typescript-eslint/naming-convention */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type TestChannel = 'addNewItem';
export type UpdateChannel = 'UPDATE';
export type FetchItemChannel = 'FetchItems';
export type DeleteItemChannel = 'DeleteItem';
export type GetInvoiceNo = 'INVOICENO';
export type Dialog = 'Dialog';
export type ASk_USER = 'ASK_USER';
export type SAVE_INVOICE = 'SAVE_INVOICE';
export type getAll_INVOICE = 'getinvoice';
export type del_INVOICE = 'delInvoice';
export type getVersion = 'getVersion';
export type EstdFinal = 'estdfinal';
export type BosFinal = 'bosfinal';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    addNewItem(channel: TestChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    checkUpdate(channel: UpdateChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    fetchItems(channel: FetchItemChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    deleteItem(channel: DeleteItemChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getInvoiceNo(channel: GetInvoiceNo, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    showDialog(channel: Dialog, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    askUser(channel: ASk_USER, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    saveInvoice(channel: SAVE_INVOICE, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getAllInvoice(channel: getAll_INVOICE, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    delInvoice(channel: getAll_INVOICE, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getVersion(channel: getVersion, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    finalizeEstd(channel: EstdFinal, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    finalizeBos(channel: BosFinal, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
  },
});
