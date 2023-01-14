import fse from 'fs-extra';

try {
  const filepath = fse.readFileSync('./.storePath').toString();
  fse.removeSync(filepath);
} catch (error) {
  console.log(error);
}

console.log('clean store success!');
