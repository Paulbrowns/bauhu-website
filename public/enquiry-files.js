(() => {
  const DB_NAME = 'bauhu-enquiry';
  const STORE = 'files';

  const open = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  async function tx(mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const store = transaction.objectStore(STORE);
      const result = action(store);
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
    }).finally(() => db.close());
  }

  async function addFiles(files) {
    const records = [];
    for (const file of files) {
      const record = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        blob: file
      };
      await tx('readwrite', (store) => store.put(record));
      records.push(record);
    }
    return records;
  }

  async function list() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  }

  async function remove(id) {
    await tx('readwrite', (store) => store.delete(id));
  }

  async function clear() {
    await tx('readwrite', (store) => store.clear());
  }

  window.BauhuEnquiryFiles = { addFiles, list, remove, clear };
})();