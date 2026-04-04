const ROLES = {
  STUDENT: "student",
  COLLEGE_ADMIN: "college_admin",
  PLATFORM_ADMIN: "platform_admin",
};

const CONTENT_TYPES = {
  BLOG: "blog",
  ARTICLE: "article",
  NEWS: "news",
  UPDATE: "update",
};

const COMPETITION_STATUS = {
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration_open",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const RANKING_PERIODS = {
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  ALL_TIME: "all_time",
};

const WEBINAR_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed",
};

module.exports = {
  ROLES,
  CONTENT_TYPES,
  COMPETITION_STATUS,
  RANKING_PERIODS,
  WEBINAR_STATUS,
};