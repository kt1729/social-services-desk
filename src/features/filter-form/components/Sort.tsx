import FormSelect from '@shared/components/Form/select';
import { useFilter } from '@shared/hooks/useFilter';

const sortTypes = [
  { id: 'popularity.desc', value: 'Popularity ↓' },
  { id: 'popularity.asc', value: 'Popularity ↑' },
];

const Sort = () => {
  const { setSortBy } = useFilter();

  return <FormSelect options={sortTypes} onChangeHandler={setSortBy} />;
};

export default Sort;
