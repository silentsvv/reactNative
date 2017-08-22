import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class EquipDetail extends React.Component {
	constructor() {
		super()
		this.state = {
			height: 0
		}
	}

	_setHeight(e) {
		console.log(e.nativeEvent.layout)
		this.setState({
			height: e.nativeEvent.layout.height
		})
	}

	_attack(time) {
		if(this.props.data.minAttack && this.props.data.maxAttack){
			if(time > 0) {
				return <Text>攻击:{this.props.data.minAttack} - {this.props.data.maxAttack} + {Math.floor(this.props.data.minAttack * 0.1 * time)}</Text>
			}else {
				return <Text>攻击:{this.props.data.minAttack} - {this.props.data.maxAttack}</Text>
			}
		}else {
			return null
		}
	}

	_render(data, text, time) {
		if(data != 0){
			if(time > 0) {
				return <Text>{text}:{data} + {Math.floor(data * 0.1 * time)}</Text>
			}else {
				return <Text>{text}:{data}</Text>
			}
		}else {
			return null
		}
	}


	render() {
		return (
			<View style={[styles.detail,{
				top:this.props.pageY + this.state.height > this.props.height? null:this.props.pageY, 
				bottom: this.props.pageY + this.state.height > this.props.height? (this.props.height - this.props.pageY): null, 
				right: (this.props.pageX)}]} onLayout={(e) => this._setHeight(e)}
				>
				{this._attack(this.props.data.time)}
				{this._render(this.props.data.strength, "力量", this.props.data.time)}
				{this._render(this.props.data.intelligence, "智力", this.props.data.time)}
				{this._render(this.props.data.agility, "敏捷", this.props.data.time)}
				{this._render(this.props.data.critical, "暴击", this.props.data.time)}
				{this._render(this.props.data.dodge, "闪避", this.props.data.time)}
				<Text>类型:{this.props.data.type == "shoes"? "鞋子":"武器"}</Text>
				<Text>等级:{this.props.data.level}</Text>
				<Text>金币:{this.props.data.level * 60}</Text>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	detail: {
		position: "absolute", backgroundColor: "#fff",
		zIndex: 999,
		borderWidth: 1,
		minWidth: 100,
		borderColor: "#ccc",
		padding: 4
	},
	hide: {

	}
});
