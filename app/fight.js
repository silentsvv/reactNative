import React from 'react';
import { StyleSheet, Text, FlatList, StatusBar, View, TextInput, ProgressBarAndroid,Button } from 'react-native';
import monster from '../data/monster'

export default class Fight extends React.Component {
	constructor() {
		super()
		this.state = {
      description: [
      ],
      tools: [
        {
          weapon: ""
        },
        {
          clothes: ""
        },
        {
          shoes: ""
        },
        {
          ring: ""
        },
        {
          necklace: ""
        },
      ],
      enemy: {},
      role: {
        HP: 2333,
        nowHP: 2333,
        attack: 266,
        defense: 22,
        name: "赵日天",
        strength: 65,
        intelligence: 40,
        agility: 40,
        critical: 20,
        dodge: 40,
        EXP: 0,
        maxEXP: 0, 
        level: 1,
        isTurn: false
  		},
      isFight: false,
      bag: [
        {
          name: "杀猪刀",
          type: "weapon",
          level: 1,
          minAttack: 22,
          maxAttack: 34,
          strength: 5,
          intelligence: 0,
          agility: 0,
          critical: 0,
          dodge: 0,
          up: 0
        },
        {
          name: "阿迪王",
          type: "weapon",
          level: 1,
          strength: 0,
          intelligence: 0,
          agility: 30,
          critical: 0,
          dodge: 0,
          up: 0
        },
      ]
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

    let attack = this.state.role.strength * 5
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
    if(this.state.isFight) {
      if(role.agility >= enemy.agility && !role.isTurn) {
        let damage = role.attack - enemy.defense > 0 ? role.attack-enemy.defense : 0
        enemy.nowHP = enemy.nowHP - damage
        let description = this.state.description
        let str,isFight
        if(enemy.nowHP <= 0) {
          let exp = this.state.role.level * 20
          str = `${this.state.role.name}战斗胜利！获得${exp}经验`
          role.EXP += exp
          if(role.maxEXP == 0) {
            role.maxEXP = (Math.pow(role.level - 1, 3) + 60)/5 * ((role.level - 1) * 2 +60)
          }
          if(role.EXP >= role.maxEXP) {
            role.level += 1
            role.EXP = 0
            role.maxEXP = (Math.pow(role.level - 1, 3) + 60)/5 * ((role.level - 1) * 2 +60)
            role.strength = role.strength + role.level * 3
            role.intelligence = role.intelligence + role.level * 1
            role.agility = role.agility + role.level * 1
            role.critical = role.critical + role.level * 2
            role.damage = role.damage + role.level * 1
          }
          isFight = false
        }else {
          str = `${this.state.role.name}对${enemy.name}造成了${damage}伤害`
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
          console.log(this.state.role)
        }else {
          setTimeout(()=>{this.fighting()},1000)
        }
      }else {
        let damage = enemy.attack - role.defense > 0 ? enemy.attack - role.defense : 0
        role.nowHP = role.nowHP - damage
        let description = this.state.description
        let str,isFight
        if(role.nowHP <= 0) {
          str = `${this.state.role.name}战斗失败！`
          isFight = false
        }else {
          str = `${enemy.name}对${this.state.role.name}造成了${damage}伤害`
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

  _renderBag({item}) {
    let translate;
    console.log(item)
    return <View><Text>{item.name}</Text><Text>装备</Text><Text>强化</Text></View>
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

  render() {
  	return (
      <View style={styles.mainWrapper}>
        <StatusBar
         hidden={false}
         translucent={false}
         barStyle={'default'}
        /> 
        <View style={styles.userWrapper}>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>{this.state.role.name} lv{this.state.role.level}</Text>
              <Text style={styles.simpleFn}>力量:{this.state.role.strength}</Text>
              <Text style={styles.simpleFn}>智力:{this.state.role.intelligence}</Text>
              <Text style={styles.simpleFn}>敏捷:{this.state.role.agility}</Text>
              <Text style={styles.simpleFn}>暴击:{this.state.role.critical}</Text>
              <Text style={styles.simpleFn}>闪避:{this.state.role.dodge}</Text>
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
              <Text>生命值：{this.state.enemy.HP}</Text>
              <Text>{this.state.enemy.type}</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.enemy.nowHP/this.state.enemy.HP}/>
              <Text style={styles.bold}>赵日天</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.nowHP/this.state.role.HP}/>
              <ProgressBarAndroid style={styles.line} color="blue" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.EXP/this.state.role.maxEXP}/>
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
          <View style={styles.flexPart}>
            <Text style={styles.fn24}>背包</Text>
            <FlatList
              data={this.state.bag}
              renderItem={this._renderBag}
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
