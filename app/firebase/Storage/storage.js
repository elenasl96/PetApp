import { storage } from "../firebaseconfig.js";

//----------------Photo storage------------------------------------------------------------------------------

const storageManager = {
  /*
  upload = async (uid,uri,section) => {
      const response = await fetch(uri);
      const file = await response.blob();
      console.log("File");
      this.toStorage(uid, file,section);
  }; */

  toStorage: function (uid,file,section ) {

    console.log("ToStorage");
    //var urlToStore;
    //Reference to firebase storage
    var storageRef = storage.ref();

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
      .child(section + "/" + filename)
      .put(file, metadata)
      .then(() => {
        return storageManager.fromStorage(section,filename).then((url) => {
          urlToStore = url;
          return urlToStore;
        });
      });
    //filename must be saved for future accesses;
  },

  fromStorage: function (section,filename) {
    var storageRef = storage.ref();
    var imageRef = storageRef.child(section + "/" + filename);
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

export default storageManager;