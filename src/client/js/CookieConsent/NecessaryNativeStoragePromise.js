import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';

export class NecessaryNativeStoragePromise extends NativeStoragePromise {}
NecessaryNativeStoragePromise.persistent = true;
NecessaryNativeStoragePromise.prefix = 'necessary_';
