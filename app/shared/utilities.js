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
    var hours = date.getHours();
    if (hours < 10) hours = "0" + hours;
    var minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    var seconds = date.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
  },
};

export default utils;
