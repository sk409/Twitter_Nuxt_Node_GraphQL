import gql from "graphql-tag";
import { makeArgs } from "@/apollo/utils.js";

export default function mutation(args, ...mutations) {
  let g = "mutation q";
  if (args) {
    g += `(${makeArgs(args, "$")})`;
  }
  g += `
    {
        ${mutations.join("\n")}
    }
    `;
  console.log(g);
  return gql`
    ${g}
  `;
}
