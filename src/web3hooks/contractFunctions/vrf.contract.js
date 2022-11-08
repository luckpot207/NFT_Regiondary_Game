export const getVRFResult = async (contract, requestId) => {
  return await contract.methods.getResult(requestId).call();
};
