class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; /*destructuring used*/
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj);
    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Job.find(JSON.parse(queryStr));
    return this;
  }

  feilds() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v '); //excluding __v '-' means excluding
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1; //we are converting string to integer
    const limit = this.queryString.limit * 1 || 100; //we are converting string to integer
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
