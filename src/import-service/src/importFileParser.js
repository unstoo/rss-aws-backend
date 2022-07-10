const AWS = require('aws-sdk');
const csv = require('csv-parser');

const {
  SQS_URL,
  REGION,
} = process.env;
const BUCKET = 'csv-products-unstoo';
console.log({ SQS_URL, REGION });
AWS.config.update({ region: REGION });

const importFileParser = async (event) => {
  const s3 = new AWS.S3();
  const sqs = new AWS.SQS();
  const objectKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  try {
    const s3Stream = await s3.getObject({
      Bucket: BUCKET,
      Key: objectKey,
    }).createReadStream();

    for await (const chunk of s3Stream.pipe(csv())) {
      console.log(chunk);

      sqs.sendMessage({
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify(chunk),
      }, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
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
