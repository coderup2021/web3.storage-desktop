// 1 KB（Kilobyte，千字节）= 1024 B；
// 1 MB（Megabyte，兆字节）= 1024 KB；
// 1 GB（Gigabyte，吉字节，千兆）= 1024 MB；
// 1 TB（Trillionbyte，万亿字节，太字节）= 1024 GB；
// 1 PB（Petabyte，千万亿字节，拍字节）= 1024 TB；
// 1 EB（Exabyte，百亿亿字节，艾字节）= 1024 PB；
// 1 ZB（Zettabyte，十万亿亿字节，泽字节）= 1024 EB；
// 1 YB（Yottabyte，一亿亿亿字节，尧字节）= 1024 ZB；
// 1 BB（Brontobyte，千亿亿亿字节）= 1024 YB。

export const optimizeSizeUnit = (size: number) => {
  let fixedLength = 2;
  let rsize: string | number = 0,
    unit = '';
  if (size < 1024) {
    rsize = size;
    unit = 'B';
  } else if (size >= 1024 && size <= 1024 ** 2) {
    rsize = (size / 1024).toFixed(fixedLength);
    unit = 'KB';
  } else if (size >= 1024 ** 2 && size <= 1024 ** 3) {
    rsize = (size / 1024 ** 2).toFixed(fixedLength);
    unit = 'MB';
  } else if (size >= 1024 ** 3 && size <= 1024 ** 4) {
    rsize = (size / 1024 ** 3).toFixed(fixedLength);
    unit = 'GB';
  } else if (size >= 1024 ** 4 && size <= 1024 ** 5) {
    rsize = (size / 1024 ** 4).toFixed(fixedLength);
    unit = 'TB';
  } else if (size >= 1024 ** 5 && size <= 1024 ** 6) {
    rsize = (size / 1024 ** 5).toFixed(fixedLength);
    unit = 'PB';
  } else if (size >= 1024 ** 6 && size <= 1024 ** 7) {
    rsize = (size / 1024 ** 6).toFixed(fixedLength);
    unit = 'TB';
  } else if (size >= 1024 ** 7 && size <= 1024 ** 8) {
    rsize = (size / 1024 ** 7).toFixed(fixedLength);
    unit = 'EB';
  } else if (size >= 1024 ** 8 && size <= 1024 ** 9) {
    rsize = (size / 1024 ** 8).toFixed(fixedLength);
    unit = 'ZB';
  } else if (size >= 1024 ** 9 && size <= 1024 ** 10) {
    rsize = (size / 1024 ** 9).toFixed(fixedLength);
    unit = 'YB';
  } else if (size >= 1024 ** 10) {
    rsize = (size / 1024 ** 10).toFixed(fixedLength);
    unit = 'BB';
  }
  return `${rsize}${unit}`;
};
