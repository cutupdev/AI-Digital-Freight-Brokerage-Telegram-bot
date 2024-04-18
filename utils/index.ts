import fs from 'fs';

export const readData = async (Path: string): Promise<any> => {
  return JSON.parse(fs.readFileSync(Path, `utf8`));
}

export const writeData = async (data: any, path: any) => {
  try {
    const dataJson = JSON.stringify(data, null, 4);
    fs.writeFile(path, dataJson, (err) => {
      if (err) {
        console.log('Error writing file:', err);
      } else {
        console.log(`wrote file ${path}`);
      }
    })
  } catch (e) {
    return true
  }
}
