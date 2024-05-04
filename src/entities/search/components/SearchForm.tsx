import { FC, useState, FormEvent } from 'react';

import { ISearchQuery } from '../model/types';

interface IProps {
  setSearchQuery: (searchQuery: ISearchQuery) => void;
}

const defaultQueryState: ISearchQuery = {
  name: '',
  query: '',
};

export const SearchForm: FC<IProps> = ({ setSearchQuery }) => {
  const [queryMovies, setQueryMovies] = useState<ISearchQuery>(defaultQueryState);
  const [querySeries, setQuerySeries] = useState<ISearchQuery>(defaultQueryState);
  const [queryPerson, setQueryPerson] = useState<ISearchQuery>(defaultQueryState);

  const handleSubmitFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (queryMovies.query.length) {
      setSearchQuery(queryMovies);
      return;
    }
    if (querySeries.query.length) {
      setSearchQuery(querySeries);
      return;
    }
    if (queryPerson.query.length) {
      setSearchQuery(queryPerson);
    }
  };

  return (
    <form action='/search' className='search-form' onSubmit={handleSubmitFilter}>
      <div className='form-item'>
        <div className='form-label'>Movies:</div>
        <div className='form-field'>
          <input
            type='text'
            name='movies'
            placeholder='Enter the name of the movie'
            value={queryMovies.query}
            onChange={e => {
              setQueryMovies({ name: e.target.name, query: e.target.value });
              setQuerySeries(defaultQueryState);
              setQueryPerson(defaultQueryState);
            }}
          />
        </div>
      </div>
      <div className='form-item'>
        <div className='form-label'>Series:</div>
        <div className='form-field'>
          <input
            type='text'
            name='series'
            placeholder='Enter the name of the series'
            value={querySeries.query}
            onChange={e => {
              setQuerySeries({ name: e.target.name, query: e.target.value });
              setQueryMovies(defaultQueryState);
              setQueryPerson(defaultQueryState);
            }}
          />
        </div>
      </div>
      <div className='form-item'>
        <div className='form-label'>Actors:</div>
        <div className='form-field'>
          <input
            type='text'
            name='persons'
            placeholder='Enter the name of the actor'
            value={queryPerson.query}
            onChange={e => {
              setQueryPerson({ name: e.target.name, query: e.target.value });
              setQuerySeries(defaultQueryState);
              setQueryMovies(defaultQueryState);
            }}
          />
        </div>
      </div>
      <div className='form-submit'>
        <button type='submit'>Search</button>
      </div>
    </form>
  );
};
