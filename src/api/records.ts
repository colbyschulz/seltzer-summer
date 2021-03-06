import { useQuery, useMutation, useQueryClient } from 'react-query';
import { queryKeys } from './config';
import { TableRecord } from '../types';
import { baseUrl } from './config';

type GetRecordsResponse = {
  records: TableRecord[];
};
const getRecords = async () => {
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result: GetRecordsResponse = await response.json();
  return result.records;
};

export const useRecords = () => useQuery(queryKeys.records, getRecords);

const createRecord = async (newRecord: TableRecord) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRecord),
  });
  const result: GetRecordsResponse = await response.json();

  return result.records;
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
    onError: (e) => {
      console.log(e);
    },
  });
};
