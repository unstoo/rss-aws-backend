import AWS from 'aws-sdk';
import csv from 'csv-parser';

const s3 = new AWS.S3({ region: 'eu-central-1' });
const BUCKET = 'csv-products-unstoo';
const originFolder = 'uploaded';
const targetFolder = 'parsed';

export const importFileParser = async (event) => {
  const objectKey = event.Records[0].s3.object.key;

  const s3Stream = await s3.getObject({
    Bucket: BUCKET,
    Key: objectKey,
  }).createReadStream();


  for await (const chunk of s3Stream.pipe(csv())) {
    console.log(chunk)
  }

  return {
    statusCode: 202,
    body: 'Parsed',
  };




  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: BUCKET + '/' + record.s3.object.key,
    Key: record.s3.object.key.replace('uploaded', 'parsed'),
  });

  await s3.deleteObject({
    Bucket: BUCKET,
    Key: record.s3.object.key,
  });
  const msg = `Moved ${record.s3.object.key.split('/').pop()} from ${originFolder} to ${targetFolder}`;

  console.log(msg);

  return {
    statusCode: 202,
    body: 'Parsed',
  };


  // fs.createReadStream('data.csv')
  // .pipe(csv())
  // .on('data', (data) => results.push(data))
  // .on('end', () => {
  //   console.log(results);
  //   // [
  //   //   { NAME: 'Daffy Duck', AGE: '24' },
  //   //   { NAME: 'Bugs Bunny', AGE: '22' }
  //   // ]
  // });  
};

importFileParser({
  Records: [
    {
      s3: {
        object: {
          key: 'uploaded/flowers.csv'
        }
      }
    }
  ]
})
