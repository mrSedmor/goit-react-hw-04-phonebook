import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContactFrom, Filter, ContactList } from 'components';
import * as api from 'services/api';
import css from './app.module.css';
import initialContacts from 'data/contacts.json';

function sortContacts(contacts) {
  const collator = new Intl.Collator('en', { sensitivity: 'base' }).compare;
  contacts.sort(({ name: a }, { name: b }) => collator(a, b));
  return contacts;
}

function getFilteredContacts(filter, contacts) {
  if (filter === '') {
    return contacts;
  }

  const normalizedFilter = filter.toLocaleLowerCase();
  return contacts.filter(({ name }) =>
    name.toLocaleLowerCase().includes(normalizedFilter)
  );
}

export default function App() {
  const [contacts, setContacts] = useState(() => {
    const contacts = api.restore();
    if (contacts.length === 0) {
      return sortContacts(initialContacts);
    }
    return contacts;
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.store(contacts);
  }, [contacts]);

  function handleAddContact(contact) {
    const normalizedName = contact.name.toLocaleLowerCase();

    if (
      contacts.find(({ name }) => name.toLocaleLowerCase() === normalizedName)
    ) {
      toast.error(`${contact.name} is already in contacts.`);
      return false;
    }

    const id = nanoid(8);
    const updatedContacts = sortContacts([{ id, ...contact }, ...contacts]);

    setContacts(updatedContacts);
    return true;
  }

  function handleDeleteContact(id) {
    setContacts(contacts => {
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      return updatedContacts;
    });
  }

  const filteredContacts = getFilteredContacts(filter, contacts);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Phonebook</h1>
      <ContactFrom onAddContact={handleAddContact} />

      <h2 className={css.subtitle}>Contacts</h2>
      <Filter value={filter} onChange={setFilter} />

      <ContactList contacts={filteredContacts} onDelete={handleDeleteContact} />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        className={css.toast}
      />
    </div>
  );
}
