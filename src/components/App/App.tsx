import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import fetchMovie from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const searchMovie = async (query: string) => {
    setIsLoading(true);
    setIsError(false);
    setMovies([]);

    try {
      const data = await fetchMovie({ query });
      const response = data.results;
      if (response.length === 0) {
        toast.error("No movies found for your request.");
      }
      setMovies(response);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenModule = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const onCloseModule = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      {selectedMovie && (
        <MovieModal onClose={onCloseModule} movie={selectedMovie} />
      )}
      <Toaster />
      <SearchBar onSubmit={searchMovie} />
      {isError && <ErrorMessage />}
      {isLoading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={onOpenModule} />
      )}
    </>
  );
}

export default App;
