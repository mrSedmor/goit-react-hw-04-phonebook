import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import css from './contact-form.module.css';
import sharedCss from 'shared.module.css';
import { useEffect } from 'react';

const INITIAL_VALUES = {
  name: '',
  number: '',
};

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
      "Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
    )
    .required('Name is required'),
  number: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
      'Phone number must be digits and can contain spaces, dashes, parentheses and can start with +'
    )
    .required('Phone number is required'),
});

export default function ContactForm({ onAddContact }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: INITIAL_VALUES,
  });

  function handleAddContact(data) {
    if (!onAddContact(data)) {
      setError('name', {
        message: `${getValues('name')} is already in contacts.`,
      });
      // reset();
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  function handleReset(event) {
    event.preventDefault();
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleAddContact)}>
      <label className={css.fieldWrapper}>
        <span className={css.label}>Name</span>
        <input
          className={css.input}
          type="text"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          placeholder="Rosie Simpson"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <p className={css.error}>{errors.name.message}</p>}
      </label>

      <label className={css.fieldWrapper}>
        <span className={css.label}>Number</span>
        <input
          className={css.input}
          type="tel"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          placeholder="459-12-56"
          {...register('number')}
          aria-invalid={errors.number ? 'true' : 'false'}
        />
        {errors.number && <p className={css.error}>{errors.number.message}</p>}
      </label>
      <div className={css.controls}>
        <button className={sharedCss.btn} type="submit">
          Add contact
        </button>
        <button className={sharedCss.btn} type="button" onClick={handleReset}>
          Reset form
        </button>
      </div>
    </form>
  );
}

ContactForm.propTypes = {
  onAddContact: PropTypes.func.isRequired,
};
