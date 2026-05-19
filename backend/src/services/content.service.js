const Content = require("../models/Content.model");
const ApiError = require("../utils/ApiError");
const paginate = require("../utils/paginate");
const uploadService = require("./upload.service");
const { getCache, setCache, delByPattern } = require("../config/redis");

const createContent = async (data, authorId) => {
  const content = await Content.create({ ...data, author: authorId });
  await delByPattern("content:*");
  return content;
};

const getContentById = async (contentId) => {
  const content = await Content.findByIdAndUpdate(
    contentId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name avatar");

  if (!content) throw new ApiError(404, "Content not found");
  return content;
};

const getContentBySlug = async (slug) => {
  const cacheKey = `content:slug:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const content = await Content.findOneAndUpdate(
    { slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name avatar bio");

  if (!content) throw new ApiError(404, "Content not found");
  await setCache(cacheKey, content, 300);
  return content;
};

const getAllContent = async (queryParams) => {
  const { page = 1, limit = 10, type, tag, featured, search, sort } = queryParams;

  const cacheKey = `content:list:${JSON.stringify(queryParams)}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const query = { isPublished: true };
  if (type) query.type = type;
  if (tag) query.tags = tag;
  if (featured === "true") query.isFeatured = true;
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: escaped, $options: "i" } },
      { excerpt: { $regex: escaped, $options: "i" } },
      { tags: { $regex: escaped, $options: "i" } },
    ];
  }

  const sortOption =
    sort === "popular" ? { views: -1 } :
    sort === "liked" ? { likeCount: -1 } :
    { publishedAt: -1 };

  const result = await paginate(Content, query, {
    page,
    limit,
    sort: sortOption,
    populate: [{ path: "author", select: "name avatar" }],
    select: "title slug type excerpt coverImage author tags views likes publishedAt readTime isFeatured",
  });

  await setCache(cacheKey, result, 180);
  return result;
};

const updateContent = async (contentId, updateData, requesterId) => {
  const content = await Content.findById(contentId);
  if (!content) throw new ApiError(404, "Content not found");

  const isOwner = content.author.toString() === requesterId.toString();
  if (!isOwner) throw new ApiError(403, "Not authorized to update this content");

  const updated = await Content.findByIdAndUpdate(contentId, updateData, {
    new: true,
    runValidators: true,
  });

  await delByPattern("content:*");
  return updated;
};

const deleteContent = async (contentId, requesterId, requesterRole) => {
  const content = await Content.findById(contentId);
  if (!content) throw new ApiError(404, "Content not found");

  const isOwner = content.author.toString() === requesterId.toString();
  const isAdmin = requesterRole === "platform_admin";
  if (!isOwner && !isAdmin) throw new ApiError(403, "Not authorized");

  await content.deleteOne();
  await delByPattern("content:*");
};

const toggleLike = async (contentId, userId) => {
  const content = await Content.findById(contentId);
  if (!content) throw new ApiError(404, "Content not found");

  const hasLiked = content.likes.includes(userId);
  const update = hasLiked
    ? { $pull: { likes: userId } }
    : { $addToSet: { likes: userId } };

  return Content.findByIdAndUpdate(contentId, update, { new: true });
};

const uploadCoverImage = async (contentId, file) => {
  const url = await uploadService.uploadImage(file, "content");
  return Content.findByIdAndUpdate(contentId, { coverImage: url }, { new: true });
};

module.exports = {
  createContent,
  getContentById,
  getContentBySlug,
  getAllContent,
  updateContent,
  deleteContent,
  toggleLike,
  uploadCoverImage,
};