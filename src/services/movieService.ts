import axios from "axios";
import type { Movie } from "../types/movie";

interface fetchMovieProps {
  query: string;
  page?: number;
}

interface fetchMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovie({
  query,
  page = 1,
}: fetchMovieProps): Promise<fetchMovieResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const response = await axios.get<fetchMovieResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}
