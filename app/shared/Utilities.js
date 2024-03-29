const utils = {
  getAgeString: function (age) {
    var string;
    if (age < 0) {
      console.log("Age must be a positive integer");
      string = "error";
    }

    age = this.getAge(age);

    if (age <= 6 && age >= 0) string = "Young";

    if (age > 6 && age <= 12) string = "Medium";

    if (age > 12) string = "Old";
    return string;
  },

  getYearOfBirth: function (age) {
    return new Date().getFullYear() - parseInt(age);
  },

  getAge: function (yearOfBirth) {
    var currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth;
  },

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

  searchInPlaces: function (placeName, search) {
    placeName = placeName.toLowerCase().replace(/\s/g, "");
    search = search.toLowerCase().replace(/\s/g, "");
    return (
      this.similarity(placeName, search) > 0.5 ||
      placeName.includes(search) ||
      search.includes(placeName)
    );
  },

  compareDistance: function (a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  },

  calcDistance: function (pointA, pointB) {
    //console.log(pointA.latitude);
    var a = pointA.latitude - pointB.latitude;
    var b = pointA.longitude - pointB.longitude;
    return Math.sqrt(a * a + b * b);
  },
};

export default utils;
