import { FC } from 'react';

import { Link } from 'react-router-dom';


import { IMovie } from '../model/types';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const MovieItem: FC<IMovie> = ({ poster_path, title, name, id, vote_average }) => {
  if (!poster_path) return null;

  return (
    <div className='movie-item'>
      <Link to={`/${id}`}>
        <div className="card movie-card">
          <p className="title no-decoration">title</p>
          <p className='no-decoration' >here some content about the title</p>
        </div>
      </Link>
    </div>
  );
};
