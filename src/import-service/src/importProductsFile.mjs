import AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: 'eu-central-1' });

const mapParams = (fileName) => ({
  Bucket: 'csv-products-unstoo',
  Key: 'uploaded/' + fileName,
  ContentType: 'text/csv',
  Expires: 60,
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://danuc0jvfezp6.cloudfront.net',
  'Access-Control-Allow-Credentials': true,
};

export const importProductsFile = async (event) => {
  const fileName = decodeURIComponent(event.queryStringParameters.name);

  try {
    const url = await s3.getSignedUrlPromise('putObject', mapParams(fileName));
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: url,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: 'Server error',
    };
  }
};
