const searchService = require("../services/search.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const globalSearch = asyncHandler(async (req, res) => {
  const { q, types, limit } = req.query;
  const result = await searchService.globalSearch(q, {
    limit: parseInt(limit) || 5,
    types: types ? types.split(",") : undefined,
  });
  res.json(new ApiResponse(200, result, "Search results"));
});

const autocomplete = asyncHandler(async (req, res) => {
  const suggestions = await searchService.autocomplete(req.query.q);
  res.json(new ApiResponse(200, suggestions, "Autocomplete suggestions"));
});

module.exports = { globalSearch, autocomplete };