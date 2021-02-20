// const { request } = require("express");
let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(e) {
  const db = e.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(e) {
  db = e.target.result;

  if (navigator.onLine) {
    checkDb();
  }
};

request.onerror = function(e) {
  console.log("Houston, we found an error: " + e.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(record);

  console.log(record);
}

function checkDb() {
  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          transaction = db.transaction(["pending"], "readwrite");
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDb);
