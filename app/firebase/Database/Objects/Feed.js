import constants from "../../../shared/constants";
import React, { useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default class Feed {
  constructor(id,name,title, text, type) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.text = text;
    this.type = type;
  }

  getId(){
    return this.id;
  }

  getName(){
    return this.name;
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
      return "green";
    } else if (this.type == constants.FEED_TYPE.breed) {
      return "blue";
    } else if (this.type == constants.FEED_TYPE.general) {
      return "orange";
    } else if ((this.type = constants.FEED_TYPE.size)) {
      return "powderblue";
    }
  }

  getIcon() {
    console.log(this.type);
    if (this.type === constants.FEED_TYPE.age) {
      return (
        <Ionicons name="bandage-outline" size={24} color={this.getColor()} />
      );
    } else if (this.type === constants.FEED_TYPE.breed) {
      return <Ionicons name="male-female" size={24} color={this.getColor()} />;
    } else if (this.type === constants.FEED_TYPE.general) {
      return (
        <Ionicons name="md-heart-outline" size={24} color={this.getColor()} />
      );
    } else if (this.type === constants.FEED_TYPE.size) {
      return <Ionicons name="md-fitness" size={24} color={this.getColor()} />;
    } else {
      return <Text></Text>;
    }
  }

  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      title: this.title,
      text: this.text,
      type: this.type,
    };
  }
}
