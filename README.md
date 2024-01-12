# translation-exploration
No other purpose than sharing some tests using google translate api & translating a dashboard an a dataset.

## Usage
To use this project, follow these steps:

1. Clone the repository to your local machine.
2. Create an `.env` file containing a the following info: <br>
  LUZMO_KEY=`<the luzmo api key>`<br>
  LUZMO_TOKEN=`<the luzmo api token>`<br>
3. Add a `translation-api-credentials.json` file in the root directory which contains the google service account credentials with which you can use the translate
4. Install the dependencies by running `npm install`.
5. Adapt the necessary variables in each js file to have it work for your case
6. Run it using: `npm run translate-dataset`.

## Dependencies

This project has the following dependencies:
- `@luzmo/nodejs-sdk`: Used to fetch the dataset and columns.
- `dotenv`: loads environment variable
- `@google-cloud/translate`: translate using the google translate api
