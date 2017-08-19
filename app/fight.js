import React from 'react';
import { StyleSheet, Text, FlatList, StatusBar, View, TextInput, ProgressBarAndroid,UIManager } from 'react-native';
import monster from '../data/monster'

export default class Fight extends React.Component {
	constructor() {
		super()
		this.state = {
			user: {
				name: "赵日天",
        attr: [
          {strength: 65},
          {intelligence: 40},
          {agility: 40},
          {critical: 20},
          {dodge: 40}
        ]
			},
      description: [
      ],
      tools: [
        {
          weapon: "杀猪刀"
        },
        {
          clothes: "杀猪刀"
        },
        {
          shoes: "杀猪刀"
        },
        {
          ring: "杀猪刀"
        },
        {
          necklace: "杀猪刀"
        },
      ],
      enemy: {},
      role: {
        HP: 2333,
        nowHP: 2333,
        attack: 266,
        defense: 22,
        agility: 60,
        isTurn: false
  		},
      isFight: false
    }
	}

  componentWillMount() {
    console.log(monster)
  }

  componentDidMount() {
    this._init()
  }

  _init() {
    this.encounter()
  }

  encounter() {
    this.loadEnemy()
  }

  loadEnemy() {
    let random = Math.floor(Math.random()*monster.length);
    let HP = Math.floor((Math.floor(Math.random()*40) + 80)/100 * monster[random].HP);
    let newMonster = {
      name: monster[random].name,
      HP: HP,
      nowHP: HP,
      attack: monster[random].attack*Math.floor((Math.floor(Math.random()*40) + 80)/100),
      defense: monster[random].defense*Math.floor((Math.floor(Math.random()*40) + 80)/100),
      agility: monster[random].agility*Math.floor((Math.floor(Math.random()*40) + 80)/100),
      lever: monster[random].lever,
      type: monster[random].type
    }
    let enemy = monster[random];

    let attack = this.state.user.attr[0].strength * 5
    let role = this.state.role
    role.attack = attack

    this.setState({
      role: role,
      enemy: newMonster,
      isFight: true
    },()=> {
      this.fighting()
    })
  }

  fighting() {
    let role = this.state.role
    let enemy = this.state.enemy
    console.log(111)
    if(this.state.isFight) {
      if(role.agility >= enemy.agility && !role.isTurn) {
        console.log(222)
        let damage = role.attack-enemy.defense
        enemy.nowHP = enemy.nowHP - damage
        let description = this.state.description
        let str,isFight
        if(enemy.nowHP <= 0) {
          str = `${this.state.user.name}战斗胜利！`
          isFight = false
        }else {
          str = `${this.state.user.name}对${enemy.name}造成了${damage}伤害`
          isFight = true
        }
        description.push({log:str})
        role.isTurn = true
        this.setState({
          isFight: isFight,
          enemy: enemy,
          description: description,
          role: role
        })
        this.refs._flatList.scrollToEnd()

        if(enemy.nowHP <= 0) {
          this.encounter()
        }else {
          setTimeout(()=>{this.fighting()},1000)
        }
      }else {
        console.log(333)
        let damage = enemy.attack-role.defense
        role.nowHP = role.nowHP - damage
        let description = this.state.description
        let str,isFight
        if(role.nowHP <= 0) {
          str = `${this.state.user.name}战斗失败！`
          isFight = false
        }else {
          str = `${enemy.name}对${this.state.user.name}造成了${damage}伤害`
          isFight = true
        }
        description.push({log:str})
        role.isTurn = false
        this.setState({
          isFight: isFight,
          enemy: enemy,
          description: description,
          role: role
        })
        this.refs._flatList.scrollToEnd()
        if(role.nowHP <= 0) {
          this.encounter()
        }else {
          setTimeout(()=>{this.fighting()},1000)
        }
      }
    }
  }

  countRoleAttack() {
    let attack = this.state.user.attr[0].strength * 5
    let role = this.state.role
    role.attack = attack
    this.setState({
      role: role
    })
  }

  _renderItem({item}) {
    let translate;
    switch(Object.keys(item)[0]) {
      case "strength":
        translate = "力量";
        break;
      case "intelligence":
        translate = "智力";
        break;
      case "agility":
        translate = "敏捷";
        break;
      case "critical":
        translate = "暴击";
        break;
      case "dodge":
        translate = "闪避";
        break;
      case "log":
        translate = "log"
        break;
      case "item":
        translate = "tools"
        break;
      default:
        translate = "none"
    }
    if(translate == "log") {
      return <Text>{item.log}</Text>
    }else if(translate == "tools") {
      return <Text>{item.item}</Text>
    }else{
      return <Text style={styles.simpleFn}>{translate}:{item[Object.keys(item)[0]]}</Text>
    }
  }

  _renderTools({item}) {
    let translate;
    switch(Object.keys(item)[0]) {
      case "weapon":
        translate = "武器";
        break;
      case "clothes":
        translate = "衣服";
        break;
      case "shoes":
        translate = "鞋子";
        break;
      case "ring":
        translate = "戒子";
        break;
      case "necklace":
        translate = "项链";
        break;
      default:
        translate = "none"
    }
    if(translate == "log") {
      return <Text>{item.log}</Text>
    }else if(translate == "tools") {
      return <Text>{item.item}</Text>
    }else{
      return <Text style={styles.simpleFn}>{translate}:{item[Object.keys(item)[0]]}</Text>
    }
  }

  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.textInput.focus();
  }

  render() {
  	return (
      <View style={styles.mainWrapper}>
        <StatusBar
         hidden={false}  //是否隐藏状态栏。  
         translucent={false}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
         barStyle={'default'} // enum('default', 'light-content', 'dark-content')   
        /> 
        <View style={styles.userWrapper}>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>{this.state.user.name}</Text>
              <FlatList
                data={this.state.user.attr}
                renderItem={this._renderItem}
              />
          </View>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>装备</Text>
              <FlatList
                data={this.state.tools}
                renderItem={this._renderTools}
              />
          </View>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>对手</Text>
              <Text style={styles.bold}>{this.state.enemy.name}</Text>
              <Text>{this.state.enemy.HP}</Text>
              <Text>{this.state.enemy.type}</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.enemy.nowHP/this.state.enemy.HP}/>
              <Text style={styles.bold}>赵日天</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.nowHP/this.state.role.HP}/>
          </View>
        </View>
        
        <View style={styles.bottomBox}>
          <View style={styles.flexPart2}>
            <Text style={styles.fn24}>战斗</Text>
            <FlatList
              ref="_flatList"
              data={this.state.description}
              extraData={this.state}
              renderItem={this._renderItem.bind(this)}
            />
          </View>
          <TextInput ref={(c) => this._input = c} />
          <View style={styles.flexPart}>
            <Text style={styles.fn24}>背包</Text>
            <FlatList
              data={this.state.tools}
              renderItem={this._renderItem}
            />
          </View>
        </View>
      </View>
  	)
  }
}

const styles = StyleSheet.create({
  userWrapper: {
    flexDirection: "row",
    paddingTop: 25,
    height: "36%"
  },
  bottomBox: {
    flexDirection: "row",
    paddingTop: 25,
    height: "64%"
  },


  userAttr: {

  },
  


  flexPart: {
    flex: 1,
  },
  flexPart2: {
    flex: 2,
  },
  fn24: {
    fontSize: 24
  },
  bold: {
    fontWeight: "600"
  },
  simpleFn: {
    fontSize: 16,
    lineHeight: 24
  },
  line: {
    width: "80%"
  }
});
