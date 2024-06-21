const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const allFields = (obj, keys) => {
  for (let key of keys) {
    if (!obj[key] || obj[key] === "" || obj[key].length === 0) {
      return false;
    }
  }
  return true;
};

export default {
  baseURL: "http://localhost:8000",
  AWS: {
    bucketURL: "https://tcc-bucket-13.s3.sa-east-1.amazonaws.com",
  },
  validateEmail,
  allFields,
};
