import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import Svg, { Ellipse } from "react-native-svg";

function Index(props) {
  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <View style={styles.scrollArea}>
          <ScrollView
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
          >
            <View style={styles.feed}>
              <ScrollView
                contentContainerStyle={styles.feed_contentContainerStyle}
              ></ScrollView>
            </View>
            <View style={styles.myPets}>
              <ScrollView
                contentContainerStyle={styles.myPets_contentContainerStyle}
              ></ScrollView>
            </View>
            <Svg viewBox="0 0 74 74" style={styles.menuButton}>
              <Ellipse
                stroke="rgba(255,255,255,1)"
                strokeWidth={0}
                fill="rgba(229,122,0,1)"
                cx={37}
                cy={37}
                rx={37}
                ry={37}
              ></Ellipse>
            </Svg>
          </ScrollView>
        </View>
      </View>
      <View style={styles.annaBlackRow}>
        <Text style={styles.annaBlack}>Anna Black</Text>
        <Svg viewBox="0 0 47.09 47.09" style={styles.myProfile}>
          <Ellipse
            stroke="rgba(230, 230, 230,1)"
            strokeWidth={0}
            fill="rgba(230, 230, 230,1)"
            cx={24}
            cy={24}
            rx={24}
            ry={24}
          ></Ellipse>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 47,
    height: 47
  },
  group: {
    width: 375,
    height: 715,
    marginTop: 58,
    marginLeft: -317
  },
  scrollArea: {
    width: 375,
    height: 715,
    backgroundColor: "rgba(230, 230, 230,1)"
  },
  scrollArea_contentContainerStyle: {
    height: 715,
    width: 375
  },
  feed: {
    width: 375,
    height: 281,
    backgroundColor: "rgba(230, 230, 230,1)",
    marginTop: 12
  },
  feed_contentContainerStyle: {
    height: 281,
    width: 375
  },
  myPets: {
    width: 375,
    height: 150,
    backgroundColor: "rgba(230, 230, 230,1)",
    marginTop: 14
  },
  myPets_contentContainerStyle: {
    height: 150,
    width: 375
  },
  menuButton: {
    width: 74,
    height: 74,
    marginTop: 138,
    marginLeft: 151
  },
  annaBlack: {
    color: "#121212",
    marginTop: 15
  },
  myProfile: {
    width: 47,
    height: 47,
    marginLeft: 16
  },
  annaBlackRow: {
    height: 47,
    flexDirection: "row",
    marginTop: -773,
    marginLeft: -86
  }
});

export default Index;
