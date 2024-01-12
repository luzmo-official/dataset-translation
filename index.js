import { getDataset, getColumnValues, updateEntity, updateColumnValues } from './luzmo.js';
import { translateValues } from './google-translate.js';

// Change the input variable to match your dataset & column ids
const targetLanguage = 'de';
const datasetId = '<your dataset id>';
const columnIds = [
  '<your column id - Gender>',
  '<your column id - Country>',
  '<your column id - Acquisition>',
  '<your column id - Segment>'
];
// end of inputs

// retrieve dataset metadata
const datasetMetadata = await getDataset(datasetId);
const datasetName = datasetMetadata.name.en;
const datasetDescription = datasetMetadata.description.en;
const columnNames = datasetMetadata.columns.map((column) => column.name.en);

// Translate dataset name, description and column names
const translatedName = await translateValues([datasetName], targetLanguage);
const translatedDescription = await translateValues([datasetDescription], targetLanguage);
const translatedColumnNames = await translateValues(columnNames, targetLanguage);

// Update dataset name and description
const datasetNewMetadata = {
  name: { ...datasetMetadata.name, [targetLanguage]: translatedName[0] },
  description: { ...datasetMetadata.description, [targetLanguage]: translatedDescription[0] }
};
await updateEntity('securable', datasetId, datasetNewMetadata);

// Update column names
for (let i = 0; i < datasetMetadata.columns.length; i++) {
  const column = datasetMetadata.columns[i];
  const metadata = {};
  if (column.name) metadata.name = { ...column.name, [targetLanguage]: translatedColumnNames[i] };
  if (Object.keys(metadata).length > 0) await updateEntity('column', column.id, metadata);
}

// Update column data
for (const columnId of columnIds) {
  const uniqueValuesFromColumn = await getColumnValues(datasetId, columnId);
  const translatedColumnData = await translateValues(
    uniqueValuesFromColumn.map((item) => item.name.en),
    targetLanguage
  );

  const valuesUpdate = uniqueValuesFromColumn.map((value, idx) => {
    const update = {
      id: value.id,
      name: value.name,
      virtual: false,
      trace: ['_$root', value.id],
      level: 1,
      subTreeLevel: 0
    };
    update.name[targetLanguage] = translatedColumnData[idx];
    return update;
  });

  await updateColumnValues(columnId, valuesUpdate);
}
