import { FC } from 'react';

import { Genres } from '@entities/genres';
import { Networks } from '@entities/networks';
import { ProductionCompanies } from '@entities/production-companies';

import Countries from './Countries';
import Providers from './Providers';
import Sort from './Sort';
import Years from './Years';
import { FilterType } from '../model/types';
import '../filter-form.css';

interface IProps {
  filterType: FilterType;
}

export const FilterForm: FC<IProps> = ({ filterType }) => (
  <form className='filter-form'>
    <div className='form-item'>
      <div className='form-label'>Genre:</div>
      <Genres filterType={filterType} />
    </div>
    <div className='form-item'>
      <div className='form-label'>Year:</div>
      <Years />
    </div>
    <div className='form-item'>
      <div className='form-label'>Country:</div>
      <Countries />
    </div>
    {filterType === 'movies' && (
      <>
        <div className='form-item'>
          <div className='form-label'>Television company:</div>
          <ProductionCompanies />
        </div>
        <div className='form-item'>
          <div className='form-label'>TV provider:</div>
          <Providers />
        </div>
      </>
    )}
    {filterType === 'series' && (
      <div className='form-item'>
        <div className='form-label'>Web:</div>
        <Networks />
      </div>
    )}
    <div className='form-item'>
      <div className='form-label'>Sorting:</div>
      <Sort />
    </div>
  </form>
);
