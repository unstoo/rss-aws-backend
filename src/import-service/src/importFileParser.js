const AWS = require('aws-sdk');
const csv = require('csv-parser');

const BUCKET = 'csv-products-unstoo';

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-central-1' });
  const objectKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  try {
    const s3Stream = await s3.getObject({
      Bucket: BUCKET,
      Key: objectKey,
    }).createReadStream();

    for await (const chunk of s3Stream.pipe(csv())) {
      console.log(chunk);
    }

    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: BUCKET + '/' + objectKey,
      Key: objectKey.replace('uploaded', 'parsed'),
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET,
      Key: objectKey,
      VersionId: 'null',
    }).promise();
  } catch (e) {
    return {
      statusCode: 500,
      body: String(e),
    };
  }

  return {
    statusCode: 202,
    body: 'Parsed',
  };
};

module.exports = importFileParser;
