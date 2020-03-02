export function makeArgs(argsObj, keyPrefix = "", valuePrefix = "") {
  const args = [];
  for (const key in argsObj) {
    args.push(`${keyPrefix}${key}: ${valuePrefix}${argsObj[key]}`);
  }
  return args.join(",");
}

export function makeBody(params) {
  let body = "";
  params.forEach(param => {
    if (typeof param === "object") {
      body += makeBodyObject(param);
    } else {
      body += `${param}\n`;
    }
  });
  return body;
}

export function makeBodyObject(obj) {
  const name = Object.keys(obj)[0];
  let body = name;
  const args = obj[name].args;
  if (args) {
    body += `(${makeArgs(args, "", "$")})`;
  }
  body += "{\n";
  const params = obj[name].params;
  body += makeBody(params);
  body += "}";
  return body;
}

export function makeGQL(name, args, params) {
  if (params.length === 0) {
    params = ["id"];
  }
  let gql = name;
  if (args) {
    gql += `(${makeArgs(args, "", "$")})`;
  }
  gql += `{
    ${makeBody(params)}    
}`;
  return gql;
}
