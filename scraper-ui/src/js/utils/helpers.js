// Helper functions to use throughout components

// check if a response is any sort of 200.
function checkResponseStatus(res, toJson=false) {
  const resMatch = res.status.toString().match(/20[\d]/);
  if (resMatch === null) {
    return Promise.reject(res);
  } else {
    if (toJson === true) {
      return Promise.resolve(res.json());
    } else {
      return res;
    }
  }
}

export {
  checkResponseStatus,
}
