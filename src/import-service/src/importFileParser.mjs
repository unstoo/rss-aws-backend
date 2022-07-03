import AWS from 'aws-sdk';
import csv from 'csv-parser';

const s3 = new AWS.S3({ region: 'eu-central-1' });
const BUCKET = 'csv-products-unstoo';
const originFolder = 'uploaded';
const targetFolder = 'parsed';

export const importFileParser = async (event) => {
  const objectKey = event.Records[0].s3.object.key;
  console.log({ objectKey: objectKey })
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
    console.log({ failedToParse: e })
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
