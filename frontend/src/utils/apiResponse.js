export function getPayload(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export function getListResponse(response) {
  const envelope = response?.data ?? {};
  const payload = envelope.data;

  if (Array.isArray(payload)) {
    return { ...envelope, data: payload };
  }

  if (payload && typeof payload === "object") {
    return {
      ...envelope,
      data: Array.isArray(payload.data) ? payload.data : [],
      pagination: payload.pagination ?? envelope.pagination,
    };
  }

  return { ...envelope, data: [] };
}