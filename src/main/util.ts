/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import * as fs from 'fs';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getFileInfo(filePath: string) {
  const name = path.basename(filePath);
  const stat = fs.statSync(filePath);
  const size = stat.size;
  return { name, size };
}

export function getFileName(filePath: string) {
  const arr = filePath.split('/');
  const filename = arr[arr.length - 1];
  return filename;
}

export function getFileSize(filePath: string) {}
