//Open a database
//Create Objectstore
//Make transactions
let db;
let openRequest = indexedDB.open("myDatabase"); //openDatabase
openRequest.addEventListener("success", (e) => {
    console.log("DB Success");
    db = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("DB Error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded and also for initial DB creation");
    db = openRequest.result; //initially

    //step2 
    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});
})





