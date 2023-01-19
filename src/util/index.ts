export const formateHash = (hash: string, startLen = 4, tailLen = 4) => {
  if (!hash) return '';
  return `${hash.substring(0, startLen)}....${hash.substring(
    hash.length - tailLen,
    hash.length
  )}`;
};

export const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({}), time);
  });
};
