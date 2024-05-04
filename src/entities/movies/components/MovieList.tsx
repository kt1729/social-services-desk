import { FC, memo } from 'react';

import { MovieItem } from './MovieItem';
import { IMovie } from '../model/types';
import './movies.css';

interface IProps {
  movies: IMovie[];
}

const MoviesList: FC<IProps> = ({ movies }) => {
  if (!movies || !movies.length) return <p>No movies found</p>;

  return (
    <div className='movies-list'>
      {movies.map(movie => (
        <MovieItem key={movie.id} {...movie} />
      ))}
    </div>
  );
};

export const MovieList = memo(MoviesList);
