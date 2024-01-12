import { readFile } from 'fs/promises';
import { v3 } from '@google-cloud/translate';

const credentialsFile = await readFile('translation-api-credentials.json', 'utf8');
const credentials = JSON.parse(credentialsFile);

const translate = new v3.TranslationServiceClient({ credentials });

export async function translateValues(values, targetLanguage) {
  const response = await translate.translateText({
    parent: `projects/${credentials.project_id}/locations/global`,
    contents: values,
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLanguage
  });

  const translatedValues = response?.[0]?.translations?.map((item) => item.translatedText) || [];

  return translatedValues;
}
