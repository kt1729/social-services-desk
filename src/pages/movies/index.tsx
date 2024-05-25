import { FilterForm } from '@features/filter-form';
import { MoviesDiscover } from '@widgets/discover/movies';

const MoviesPage = () => (
  <>
    {/* <FilterForm filterType='movies' /> */}
    <h1>
    <button className='m-1 float-right' >Login</button>

    </h1>
    <br/>
    <h2 className='page-title'>Available Resources</h2>  
    <MoviesDiscover />
  </>
);

export default MoviesPage;
