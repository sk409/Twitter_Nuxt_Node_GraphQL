const { Op } = require("sequelize");

const preprocessing = option => {
  const o = Object.assign({}, option);
  if (o.where) {
    const keys = Object.keys(o.where);
    for (const key of keys) {
      const condition = o.where[key];
      if (typeof condition !== "object") {
        continue;
      }
      for (const key2 in condition) {
        if (key2 === "$lt") {
          o.where[key] = { [Op.lt]: condition[key2] };
        } else if (key2 === "$gt") {
          o.where[key] = { [Op.gt]: condition[key2] };
        }
      }
    }
  }
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
