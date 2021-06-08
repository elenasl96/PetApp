import constants from "../../../shared/constants";
import React, { useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default class Feed {
  constructor(title, text, type) {
    this.title = title;
    this.text = text;
    this.type = type;
  }

  getTitle() {
    return this.title;
  }

  getText() {
    return this.text;
  }

  getType() {
    return this.type;
  }

  getColor() {
    if (this.type == constants.FEED_TYPE.age) {
      return "#bee1e6";
    } else if (this.type == constants.FEED_TYPE.breed) {
      return "#dfe7fd";
    } else if (this.type == constants.FEED_TYPE.general) {
      return "#d8f3dc";
    } else if ((this.type = constants.FEED_TYPE.size)) {
      return "#fad2e1";
    }
  }

  getIcon() {
    console.log(this.type);
    if (this.type === constants.FEED_TYPE.age) {
      return (
        <Ionicons name="md-color-wand" size={24} color={this.getColor()} />
      );
    } else if (this.type === constants.FEED_TYPE.breed) {
      return <Ionicons name="ios-male" size={24} color={this.getColor()} />;
    } else if (this.type === constants.FEED_TYPE.general) {
      return <Ionicons name="ios-heart" size={24} color={this.getColor()} />;
    } else if (this.type === constants.FEED_TYPE.size) {
      return <Ionicons name="md-fitness" size={24} color={this.getColor()} />;
    } else {
      return <Text></Text>;
    }
  }

  toFirestore() {
    return {
      title: this.title,
      text: this.text,
      type: this.type,
    };
  }
}
