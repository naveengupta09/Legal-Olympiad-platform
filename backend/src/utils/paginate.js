const paginate = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = [],
    select = "",
  } = options;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await model.countDocuments(query);

  let dbQuery = model.find(query).sort(sort).skip(skip).limit(parseInt(limit));

  if (select) dbQuery = dbQuery.select(select);

  for (const pop of populate) {
    dbQuery = dbQuery.populate(pop);
  }

  const data = await dbQuery;

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    },
  };
};

module.exports = paginate;