import React from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import Fight from './app/fight'
var ScrollableTabView = require('react-native-scrollable-tab-view');

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			selectedTab: "home"
		}
	}

  render() {
  	return (
  			<ScrollableTabView tabBarPosition="bottom">
		      <View tabLabel='战斗'>
		      	<Fight/>
		      </View>
		      <View tabLabel='技能'><Text>favorite</Text></View>
		      <View tabLabel='设置'><Text>project</Text></View>
		    </ScrollableTabView>
  	)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});