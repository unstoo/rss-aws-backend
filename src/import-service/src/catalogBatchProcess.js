const store = require('./store');

const catalogBatchProcess = async (event) => {
  const parsedRecords = [];
  for (const { body } of event.Records) {
    const { error, result } = parseParams(body);
    if (error)
      return { statusCode: 200, body: 'Incorrect record: ' + result };

    parsedRecords.push(result);
  }

  for await (const record of parsedRecords) {
    const result = await store.addProduct(record);
    console.log({ result });
  }

  return { statusCode: 200 };
};

function parseParams(body) {
  const { error, result } = parseBody(body);
  if (error) return { error, result };

  const { title, description, price, count } = result;
  const parsedPrice = Number(price);
  const parsedCount = Number(count);

  if (!title) return { error: 400, result: 'Title is required' };
  if (!description) return { error: 400, result: 'Description is required' };
  if (!Number.isInteger(parsedPrice) || parsedPrice < 1) return { error: 400, result: 'Incorrect price format' };
  if (!Number.isInteger(parsedCount) || parsedCount < 1) return { error: 400, result: 'Incorrect count format' };

  return {
    error: null,
    result: {
      title, description, price: parsedPrice, count: parsedCount,
    },
  };
};

function parseBody(body) {
  try {
    return { error: null, result: JSON.parse(body) };
  } catch (e) {
    return { error: 400, result: String(e) };
  }
};

module.exports = catalogBatchProcess;
