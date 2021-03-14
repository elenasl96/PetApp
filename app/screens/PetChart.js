/*Example of React Native Chart Kit*/
import * as React from 'react';
//import React
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
//import Basic React Native Components

import {
  LineChart
} from 'react-native-chart-kit';
//import React Native chart Kit for different kind of Chart

export default class PetChart extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <View>
            {/*Example of Bezier LineChart*/}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                padding: 16,
                marginTop: 16,
              }}>
              Bezier Line Chart
            </Text>
            <LineChart
              data={{
                labels: ['January', 'February', 'March', 'April'],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={Dimensions.get('window').width - 16} // from react-native
              height={220}
              yAxisLabel={'$'}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', // solid background lines with no dashes
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
  },
});