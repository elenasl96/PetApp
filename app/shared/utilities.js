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
    return (
      day +
      "/" +
      month +
      "/" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  },
  editDistance: function (s1, s2) {
    console.log(s1 + " - " + s2);
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  },

  similarity: function (s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (
      (longerLength - this.editDistance(longer, shorter)) /
      parseFloat(longerLength)
    );
  },
};

export default utils;
