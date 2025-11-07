import { FileData, TableRow } from '../types';

declare const XLSX: any;

export const parseFile = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) {
            return reject(new Error("Failed to read file."));
        }
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        // By setting cellDates to true here, the library attempts to parse date-formatted cells into JS Date objects directly.
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // sheet_to_json will now receive the pre-parsed Date objects.
        const jsonData: TableRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

        resolve({
          id: `${file.name}-${file.lastModified}`,
          name: file.name,
          headers,
          data: jsonData,
          size: file.size,
          rowCount: jsonData.length,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};