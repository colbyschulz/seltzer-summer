export const baseUrl =
  process.env.ENVIRONMENT === 'prod'
    ? 'https://api.airtable.com/v0/appusTcSy172j3GYs/prod'
    : 'https://api.airtable.com/v0/appusTcSy172j3GYs/dev';

export const queryKeys = {
  records: 'records',
  record: 'record',
};
