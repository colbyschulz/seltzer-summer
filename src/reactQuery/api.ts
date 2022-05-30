import { TableRecord } from '../types';

const baseUrl =
  process.env.ENVVIRONMENT === 'prod'
    ? 'https://api.airtable.com/v0/appusTcSy172j3GYs/prod'
    : 'https://api.airtable.com/v0/appusTcSy172j3GYs/dev';

export const getRecords = async (): Promise<TableRecord[]> => {
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });
  const result = await response.json();

  return result.records as TableRecord[];
};

export const createRecord = async (newRecord: TableRecord): Promise<TableRecord[]> => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRecord),
  });
  const result = await response.json();

  return result.records as TableRecord[];
};
