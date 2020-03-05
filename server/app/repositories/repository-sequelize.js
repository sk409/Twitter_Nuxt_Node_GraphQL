const _ = require("lodash");
const { Op } = require("sequelize");

const preprocessing = option => {
  const o = Object.assign({}, option);
  if (o.where) {
    const renameOperator = obj => {
      if (!obj) {
        return;
      }
      const keys = Object.keys(obj);
      for (const key of keys) {
        const condition = obj[key];
        if (key === "$lt") {
          obj[Op.lt] = condition;
          delete obj[key];
        } else if (key === "$gt") {
          obj[Op.gt] = condition;
          delete obj[key];
        } else if (key === "$in") {
          obj[Op.in] = condition;
          delete obj[key];
        } else if (key === "$or") {
          obj[Op.or] = condition;
          delete obj[key];
        }
        if (typeof condition !== "object") {
          continue;
        }
        renameOperator(condition);
      }
      return obj;
    };
    // console.log("!!");
    renameOperator(o.where);
    // console.log("!!");
  }
  // console.log(o);
  return o;
};

class RepositorySequelize {
  constructor(model) {
    this.model = model;
  }
  destory(option) {
    return this.model.destroy(preprocessing(option));
  }
  findAll(option) {
    return this.model.findAll(preprocessing(option));
  }
  findOne(option) {
    return this.model.findOne(preprocessing(option));
  }
  save(params) {
    return this.model.build(params).save();
  }
}

module.exports = RepositorySequelize;
