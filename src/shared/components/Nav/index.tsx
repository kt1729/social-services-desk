import { BiCameraMovie } from 'react-icons/bi';
import { MdHome, MdSearch, MdFavoriteBorder } from 'react-icons/md';
import { TbMovie } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

import './Nav.css';

const Nav = () => (
  <nav className='nav'>
    <ul>
      <li>
        <NavLink to='/'>
          <MdHome />
          <span>Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink to='/search'>
          <MdSearch />
          <span>Search</span>
        </NavLink>
      </li>
      {/* <li>
        <NavLink to='/favorites'>
          <MdFavoriteBorder />
          <span>Favorites</span>
        </NavLink>
      </li> */}
    </ul>
  </nav>
);

export default Nav;
