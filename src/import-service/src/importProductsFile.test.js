const importProductsFile = require('./importProductsFile.js');

jest.mock('aws-sdk', () => {
  class s3Mock {
    constructor({ region }) {
      this.region = region;
    }
    getSignedUrl(_, { Bucket, Key }) {
      return Promise.resolve(this.region + '/' + Bucket + Key);
    }
  }
  return {
    ...jest.requireActual('aws-sdk'),
    S3: s3Mock,
  };
});


describe('importProductsFile lambda', () => {
  it('returns Signed URL on get request given the name param', async () => {
    const restAPILambdaProxyEvent = {
      queryStringParameters: {
        name: 'someFileName'
      },
    };
    const result = await importProductsFile(restAPILambdaProxyEvent);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toContain(restAPILambdaProxyEvent.queryStringParameters.name);
  })

  it('returns status code 400 if name is missing', async () => {
    const restAPILambdaProxyEvent = {
      queryStringParameters: {
        age: 22
      },
    };
    const result = await importProductsFile(restAPILambdaProxyEvent);

    expect(result.statusCode).toEqual(400);
  })
});