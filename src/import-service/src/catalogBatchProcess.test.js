const catalogBatchProcess = require('./catalogBatchProcess.js');

const mockPublish = jest.fn().mockReturnValue({
  promise: () => Promise.resolve(),
});

jest.mock('aws-sdk', () => {
  return {
    ...jest.requireActual('aws-sdk'),
    SNS: function () {
      return {
        publish: mockPublish
      };
    },
  };
});

jest.mock('./store', () => ({
  addProduct: record => record
}));

beforeEach(() => {
  mockPublish.mockClear()
});

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

  it('doesnt send anything if product data is corrupted', async () => {
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