import { useQuery } from '@apollo/client';
import {
  MovieList,
} from '@entities/movies';
import { sortMoviesByReleaseDate } from '@shared/api/tmdb';
import ErrorMessage from '@shared/components/ErrorMessage';
import Loading from '@shared/components/Loading';

import './home.css';
import { IDiscoverData, IDiscoverVariables } from '@widgets/discover/movies/model/types';
import { GET_DISCOVER_MOVIES } from '@widgets/discover/movies/api/queries';
import { useState } from 'react';

const HomePage = () => {

  const [page, setPage] = useState(1);
  
  const {
    loading: upcomingLoading,
    error: upcomingErrorMessage,
    data: upcomingData,
  } = useQuery<IDiscoverData, IDiscoverVariables>(
    GET_DISCOVER_MOVIES,
    {
      variables: {
        input: {
          genreId : '',
          year: '',
          language: '',
          sortBy: "popularity.desc",
          company: '',
          provider: '',
          page,
        },
      },
    },
  );


  const {
    loading: nowPlayingLoading,
    error: nowPlayingErrorMessage,
    data: nowPlayingData,
  } = useQuery<IDiscoverData, IDiscoverVariables>(
    GET_DISCOVER_MOVIES,
    {
      variables: {
        input: {
          genreId : '',
          year: '',
          language: '',
          sortBy: "popularity.desc",
          company: '',
          provider: '',
          page,
        },
      },
    },
  );


  
  if (upcomingLoading || nowPlayingLoading) return <Loading />;
  if (upcomingErrorMessage) return <ErrorMessage error={upcomingErrorMessage} />;
  if (nowPlayingErrorMessage) return <ErrorMessage error={nowPlayingErrorMessage} />;
  if (!upcomingData || !nowPlayingData) return null;

  const { results: upcoming } = upcomingData.discoverMovies;
  const { results: nowPlaying } = nowPlayingData.discoverMovies;

  return (
    <>
      <button className='m-1' >Login</button>
      <h2 className='page-title'>List of Resources</h2>      
      <h2>Watching now:</h2>
      <MovieList movies={sortMoviesByReleaseDate(nowPlaying).slice(0, 20)} />
    </>
  );
};

export default HomePage;
