const utils = {
  timestamp: function () {
    let date = new Date();
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let month = date.getMonth();
    month = month + 1;
    if (month < 10) month = "0" + month;
    let year = date.getFullYear();
    return day + "/" + month + "/" + year;
  },

  timestampAccurate: function () {
    let date = new Date();
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    let month = date.getMonth();
    month = month + 1;
    if (month < 10) month = "0" + month;
    let year = date.getFullYear();
    return day + "/" + month + "/" + year;
  },
};

export default utils;
