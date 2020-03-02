class RepositorySequelize {
  constructor(model) {
    this.model = model;
  }
  destory(option) {
    return this.model.destroy(option);
  }
  findAll(option) {
    return this.model.findAll(option);
  }
  findOne(option) {
    return this.model.findOne(option);
  }
  save(params) {
    return this.model.build(params).save();
  }
}

module.exports = RepositorySequelize;
