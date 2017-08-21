import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class EquipDetail extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <View style={styles.equipWrap}>
			<Text>屠龙刀</Text>
			<Text>攻击: 212 - 333</Text>
			<Text>力量: 20</Text>
			<Text>敏捷: 12</Text>
			<Text>升级所需金币</Text>
		</View>		
	}
}

const styles = StyleSheet.create({
	equipWrap: {
		position: "absolute",
		left: "0%",
		top: "0%",
		width: 200,
		height: 300,
		zIndex: 99,
		backgroundColor: "#fff"
	}
})
