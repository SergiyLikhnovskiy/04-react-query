import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import fetchMovie from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movie", { query, page }],
    queryFn: () => fetchMovie({ query, page }),

    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  const movieResponse = data?.results ?? [];
  const totalPage = data?.total_pages ?? 0;

  const searchMovie = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const onOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const onCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (query && data?.results.length === 0) {
      toast.error("No movies found for your request");
    }
  }, [data, query]);

  return (
    <>
      {selectedMovie && (
        <MovieModal onClose={onCloseModal} movie={selectedMovie} />
      )}
      <Toaster />
      <SearchBar onSubmit={searchMovie} />
      {isError && <ErrorMessage />}
      {isSuccess && totalPage > 1 && (
        <ReactPaginate
          pageCount={totalPage}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movieResponse} onSelect={onOpenModal} />
      )}
    </>
  );
}
export default App;
