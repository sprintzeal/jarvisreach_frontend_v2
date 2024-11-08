import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: 
  import.meta.env.VITE_LIVE_API_BASE_URL,
      // "https://api.jarvisreach.com/api",

  credentials: "include",
  prepareHeaders: (headers) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth?.result?.token) {
      headers.set("Authorization", `Bearer ${auth.result.token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Products", "Analytics"],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 0,
});
