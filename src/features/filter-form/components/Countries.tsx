import FormSelect from '@shared/components/Form/select';
import { useFilter } from '@shared/hooks/useFilter';

const countries = [
  { id: '', value: 'All' },
  { id: 'en', value: 'USA' },
  { id: 'tr', value: 'Turkey' },
];

const Countries = () => {
  const { setLanguage } = useFilter();

  return <FormSelect options={countries} onChangeHandler={setLanguage} />;
};

export default Countries;
