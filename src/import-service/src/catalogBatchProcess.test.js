const catalogBatchProcess = require('./catalogBatchProcess.js');

const mockPublish = jest.fn();

jest.mock('aws-sdk', () => {
  class snsMock {
    constructor({ region }) {
      this.region = region;
    }
    publish({ Message, TopicArn, MessageAttributes }) {
      mockPublish({ Message, TopicArn, MessageAttributes });
      return {
        promise: () => Promise.resolve(),
      };
    }
  }
  return {
    ...jest.requireActual('aws-sdk'),
    SNS: snsMock,
  };
});

jest.mock('./store', () => ({
  addProduct: record => record
}));


describe('catalogBatchProcess lambda', () => {
  it('sends an SNS message with a new product(s)', async () => {
    const SqsLambdaEvent = {
      Records: [
        {
          body: JSON.stringify({ title: 'roses', description: 'very red', price: 17, count: 42 }),
        },
      ],
    };
    const result = await catalogBatchProcess(SqsLambdaEvent);

    expect(result.statusCode).toEqual(200);
    expect(mockPublish.mock.calls[0][0].Message).toEqual('[' + SqsLambdaEvent.Records[0].body + ']');
  })

  it('doesnt send anything if product data are corrupted', async () => {
    mockPublish.mockClear();
    const SqsLambdaEvent = {
      Records: [
        {
          body: JSON.stringify({ no_title: 'roses', description: 'very red', price: 17, count: 42 }),
        },
      ],
    };
    const result = await catalogBatchProcess(SqsLambdaEvent);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual('Incorrect record: Title is required');
    expect(mockPublish).not.toHaveBeenCalled();
  })
});