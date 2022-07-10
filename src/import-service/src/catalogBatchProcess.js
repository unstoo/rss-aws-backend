export const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess');
  console.log({ catalogBatchProcess: evenet });

  return {
    statusCode: 200,
    body: 'processed',
  };
};
