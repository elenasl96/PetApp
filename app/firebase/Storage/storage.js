import { storage as firebaseStorage } from "../firebaseconfig.js";

//----------------Photo storage------------------------------------------------------------------------------

const storage = {

  toStorage: function (uid, file) {
    console.log("ToStorage");
    //var urlToStore;
    //Reference to firebase storage
    storageRef = firebaseStorage.ref();

    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg",
    };

    //Create a filename
    let date = new Date().getTime();
    let filename = uid + date;

    var urlToStore;
    // Upload file and metadata
    return storageRef
      .child("images/" + filename)
      .put(file, metadata)
      .then(() => {
        return storage.fromStorage(filename).then((url) => {
          urlToStore = url;
          return urlToStore;
        });
      });
    //filename must be saved for future accesses;
  },

  fromStorage: function (filename) {
    storageRef = firebaseStorage.ref();
    var imageRef = storageRef.child("images/" + filename);
    return imageRef
      .getDownloadURL()
      .then(function (url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        console.log("url " + url);
        return url;
      })
      .catch(function (error) {
        console.log("error");
      });
  },

};

export default storage;