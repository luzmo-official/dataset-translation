import dotenv from 'dotenv';
import Luzmo from '@luzmo/nodejs-sdk';

dotenv.config();

// create a Luzmo client
export const Client = new Luzmo({
  api_key: process.env.LUZMO_KEY,
  api_token: process.env.LUZMO_TOKEN,
  host: 'https://api.luzmo.com'
});

// function to fetch the dataset
export async function getDataset(datasetId) {
  try {
    const response = await Client.get('securable', {
      where: {
        id: datasetId
      },
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: 'Column',
          attributes: ['id', 'name']
        }
      ]
    });
    const dataset = response?.rows?.[0];
    return dataset;
  } catch (error) {
    console.error(`failed to fetch metadata for dataset with id: ${datasetId}`);
  }
}

// function get unique values from a column
export async function getColumnValues(datasetId, columnId) {
  try {
    const data = await Client.query({
      dimensions: [
        {
          column_id: columnId,
          dataset_id: datasetId
        }
      ]
    });
    const response = data.data.map((value) => ({ id: value[0].id, name: value[0].name }));
    return response;
  } catch (error) {
    console.error(`failed to fetch column values for column with id: ${columnId}`);
  }
}

// function to update the translations of values of a column
export async function updateColumnValues(columnId, values) {
  try {
    const response = await Client.update('hierarchy', columnId, { updates: values });
    return response;
  } catch (error) {
    console.error(`failed to update column values for column with id: ${columnId}`);
  }
}

// function to update a dataset and columns attributes
export async function updateEntity(type, id, value) {
  try {
    const response = await Client.update(type, id, value);
    return response;
  } catch (error) {
    console.error(`failed to update entity with ${id}`);
  }
}
