import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}
export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movi) => (
        <li key={movi.id} onClick={() => onSelect(movi)}>
          <div className={css.card}>
            <img
              className={css.image}
              src={`https://image.tmdb.org/t/p/w500${movi.poster_path}`}
              alt={movi.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movi.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
