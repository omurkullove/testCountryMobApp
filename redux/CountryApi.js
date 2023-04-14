/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CountrySlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://restcountries.com/v3.1", // e.g. https://yourapi.com
  }),
  endpoints: build => ({
    fetchAllCountries: build.query({
      query: () => "/all",
    }),
    fetchCountriesByRegion: build.query({
      query: region => `/region/${region}`,
    }),
    searcgCountries: build.query({
      query: value => `/name/${value}`,
    }),
    fetchOne: build.query({
      query: code => `/alpha/${code}`,
    }),
  }),

  reducerPath: "CountrySlice",
  tagTypes: ["CountrySlice"],
});

export const {
  useLazyFetchAllCountriesQuery,
  useLazyFetchCountriesByRegionQuery,
  useLazySearcgCountriesQuery,
  useLazyFetchOneQuery,
} = CountrySlice;
