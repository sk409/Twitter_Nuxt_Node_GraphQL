import gql from "graphql-tag";

function makeParamBodyObject(obj) {
  const key = Object.keys(obj)[0];
  let body = `${key} {\n`;
  obj[key].forEach(value => {
    body += `${value}\n`;
  });
  body += "}";
  return body;
}

function makeParamBody(...params) {
  let body = "";
  params[0].forEach(param => {
    if (typeof param === "object") {
      body += makeParamBodyObject(param);
    } else {
      body += `${param}\n`;
    }
  });
  return body;
}

const user = {
  findById(id, ...params) {
    return gql`
      query {
        userById(id: ${id}) {
          ${makeParamBody(params)}
        }
      }
    `;
  }
};

export default user;
