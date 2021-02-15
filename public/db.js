const { request } = require("express");

let db;

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

function saveRecord() {
    
};

function checkDb() {

};

window.addEventListener("online", checkDb);
