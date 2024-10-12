import { db } from './firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const DataComponent = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const addItem = async () => {
    try {
      await addDoc(collection(db, "items"), { name: input });
      setInput('');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    setItems(querySnapshot.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add Item" />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item, index) => <li key={index}>{item.name}</li>)}
      </ul>
    </div>
  );
};

export default DataComponent;
