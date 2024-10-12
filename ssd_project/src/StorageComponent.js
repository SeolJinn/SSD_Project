import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';

const StorageComponent = () => {
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const handleFileUpload = () => {
    const storageRef = ref(storage, `files/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('File available at', url);
      });
    });
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default StorageComponent;
