import gql from "graphql-tag";
import { makeArgs } from "@/apollo/utils.js";

export default function query(args, ...queries) {
  let g = "query q";
  if (args) {
    g += `(${makeArgs(args, "$")})`;
  }
  g += `
    {
        ${queries.join("\n")}
    }
    `;
  console.log(g);
  return gql`
    ${g}
  `;
}
