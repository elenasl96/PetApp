import { storage } from "../FirebaseConfig.js";

const storageManager = {
  toStorage: function (uid, file, section) {
    if (file) {
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
          return storageManager.fromStorage(section, filename).then((url) => {
            urlToStore = url;
            //console.log("url:" + urlToStore);
            return urlToStore;
          });
        });
      //filename must be saved for future accesses;
    } else {
      return storageManager.fromStorage(section, "default.jpg").then((url) => {
        urlToStore = url;
        //console.log("url:" + urlToStore);
        return urlToStore;
      });
    }
  },

  fromStorage: function (section, filename) {
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
        return url;
      })
      .catch(function (error) {
        console.log("error");
      });
  },

  deleteFile: function (url) {
    // [START storage_delete_file]
    // Create a reference to the file to delete
    var storageRef = storage.refFromURL(url);

    // Delete the file
    storageRef
      .delete()
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log("Uh-oh, an error occurred!");
      });
    // [END storage_delete_file]
  },
};

export default storageManager;
