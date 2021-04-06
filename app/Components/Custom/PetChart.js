import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';

import {
  LineChart
} from 'react-native-chart-kit';

export default class Chart extends React.Component {

  state = {
    labels : [],
    data: [],
  }

  constructor(props){
    super(props);
  }

  ComponentDidMount()  {
  }

  render() {

    return (
        <View style={styles.container}>
          <View>
            <LineChart
              data = {{
                labels : this.props.labels,
                datasets : [{ data : this.props.data, }],
              }}
              width={Dimensions.get('window').width - 16} // from react-native
              height={200}
              //yAxisLabel={}
              chartConfig={{
                //backgroundColor: 'white',
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
    //backgroundColor: '#ecf000',
  },
});