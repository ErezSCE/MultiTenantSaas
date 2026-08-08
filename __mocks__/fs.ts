import * as actualFs from 'fs';

export default actualFs;
export const readFileSync = actualFs.readFileSync;
export const writeFileSync = actualFs.writeFileSync;
export const existsSync = actualFs.existsSync;
export const mkdirSync = actualFs.mkdirSync;
export const readdirSync = actualFs.readdirSync;
export const statSync = actualFs.statSync;
