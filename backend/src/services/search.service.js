const Content = require("../models/Content.model");
const Competition = require("../models/Competition.model");
const Webinar = require("../models/Webinar.model");
const Course = require("../models/Course.model");
const Podcast = require("../models/Podcast.model");
const User = require("../models/User.model");
const College = require("../models/College.model");

/**
 * Unified search across all platform content types.
 * Uses MongoDB $text index for full-text and $regex for partial match fallback.
 */
const globalSearch = async (query, options = {}) => {
  const { limit = 5, types = ["content", "competition", "webinar", "course", "podcast", "user", "college"] } = options;

  if (!query || query.trim().length < 2) {
    return { results: [], total: 0 };
  }

  const q = query.trim();
  const regex = { $regex: q, $options: "i" };

  const searches = [];

  if (types.includes("content")) {
    searches.push(
      Content.find({ isPublished: true, $or: [{ title: regex }, { tags: regex }, { excerpt: regex }] })
        .limit(limit)
        .select("title slug type excerpt coverImage publishedAt")
        .populate("author", "name avatar")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "content" })))
    );
  }

  if (types.includes("competition")) {
    searches.push(
      Competition.find({ isPublished: true, $or: [{ title: regex }, { tags: regex }] })
        .limit(limit)
        .select("title slug type status coverImage startDate")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "competition" })))
    );
  }

  if (types.includes("webinar")) {
    searches.push(
      Webinar.find({ $or: [{ title: regex }, { tags: regex }] })
        .limit(limit)
        .select("title description coverImage scheduledAt status")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "webinar" })))
    );
  }

  if (types.includes("course")) {
    searches.push(
      Course.find({ isPublished: true, $or: [{ title: regex }, { tags: regex }] })
        .limit(limit)
        .select("title slug shortDescription coverImage level isFree")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "course" })))
    );
  }

  if (types.includes("podcast")) {
    searches.push(
      Podcast.find({ isPublished: true, $or: [{ title: regex }, { tags: regex }] })
        .limit(limit)
        .select("title slug coverImage episodeNumber duration")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "podcast" })))
    );
  }

  if (types.includes("user")) {
    searches.push(
      User.find({ isActive: true, role: "student", $or: [{ name: regex }] })
        .limit(limit)
        .select("name avatar totalScore rank")
        .populate("college", "name")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "user" })))
    );
  }

  if (types.includes("college")) {
    searches.push(
      College.find({ isActive: true, $or: [{ name: regex }] })
        .limit(limit)
        .select("name logo location rank totalScore")
        .lean()
        .then((docs) => docs.map((d) => ({ ...d, _type: "college" })))
    );
  }

  const results = (await Promise.all(searches)).flat();

  // Sort by relevance: exact matches first
  results.sort((a, b) => {
    const aExact = a.title?.toLowerCase() === q.toLowerCase() ? 1 : 0;
    const bExact = b.title?.toLowerCase() === q.toLowerCase() ? 1 : 0;
    return bExact - aExact;
  });

  // Group by type for structured response
  const grouped = results.reduce((acc, item) => {
    const type = item._type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return { results, grouped, total: results.length, query: q };
};

/**
 * Autocomplete suggestions (fast — title only, limit 8)
 */
const autocomplete = async (query) => {
  if (!query || query.length < 2) return [];

  const regex = { $regex: `^${query}`, $options: "i" };

  const [content, competitions, courses] = await Promise.all([
    Content.find({ isPublished: true, title: regex }).limit(3).select("title slug type").lean(),
    Competition.find({ isPublished: true, title: regex }).limit(3).select("title type").lean(),
    Course.find({ isPublished: true, title: regex }).limit(2).select("title slug").lean(),
  ]);

  return [
    ...content.map((c) => ({ label: c.title, type: c.type, slug: c.slug })),
    ...competitions.map((c) => ({ label: c.title, type: "competition", id: c._id })),
    ...courses.map((c) => ({ label: c.title, type: "course", slug: c.slug })),
  ].slice(0, 8);
};

module.exports = { globalSearch, autocomplete };