import AWS from 'aws-sdk';

const s3 = new AWS.S3({ region: 'eu-central-1' });

const mapParams = (fileName) => ({
  Bucket: 'import-service-dev-serverlessdeploymentbucket-rthzbbah9s7a',
  Key: 'uploads/' + fileName,
  ContentType: 'text/csv',
  Expires: 60,
});


export const importProductsFile = async (event) => {
  if (!event?.queryStringParameters?.name)
    return {
      statusCode: 400,
      body: 'Incorrect name parameter',
    };

  try {
    const url = await s3.getSignedUrlPromise('putObject', mapParams(event?.queryStringParameters?.name));
    console.log({ url });
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Server error',
    };
  }
};

importProductsFile({
  queryStringParameters: {
    name: 'BsdsadaOBB',
  },
});
