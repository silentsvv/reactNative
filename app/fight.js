import React from 'react';
import { StyleSheet, Text, FlatList, StatusBar, View, TextInput, ProgressBarAndroid,Button,TouchableHighlight,TouchableOpacity } from 'react-native';
import monster from '../data/monster'
import equipment from '../data/equipment'
import EquipDetail from './equipDetail'

export default class Fight extends React.Component {
	constructor() {
		super()
		this.state = {
      description: [
      ],
      tools: {
        weapon: {},
        clothes: {},
        shoes: {},
        ring: {},
        necklace: {},
      },
      enemy: {},
      role: {
        HP: 2333,
        nowHP: 2333,
        attack: 80,
        defense: 22,
        name: "赵日天",
        strength: 65,
        intelligence: 40,
        agility: 40,
        critical: 20,
        dodge: 40,
        minAttack: 0,
        maxAttack: 0,
        EXP: 0,
        maxEXP: 0, 
        level: 1,
        isTurn: false,
        money: 0
  		},
      extra: {},
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
          type: "shoes",
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
    this.viewArray = []
	}

  componentWillMount() {
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

  _updateStatus() {
    let tools = this.state.tools
    let weapon = tools.weapon
    let clothes = tools.clothes
    let shoes = tools.shoes
    let ring = tools.ring
    let necklace = tools.necklace

    let arr = [weapon,clothes,shoes,ring,necklace]

    let extra = {
      HP: 0,
      attack: 0,
      minAttack: 0,
      maxAttack: 0,
      defense: 0,
      strength: 0,
      intelligence: 0,
      agility: 0,
      critical: 0,
      dodge: 0,
    }

    for(let i = 0, max = arr.length; i < max; i++) {
      let item = arr[i]
      for(let j in item) {
        if(j === "HP") {
          extra.HP += extra.HP + item[j]
        }
        if(j === "attack") {
          extra.attack += extra.attack + item[j]
        }
        if(j === "minAttack") {
          extra.minAttack += extra.minAttack + item[j]
        }
        if(j === "maxAttack") {
          extra.maxAttack += extra.maxAttack + item[j]
        }
        if(j === "strength") {
          extra.strength += extra.strength + item[j]
        }
        if(j === "intelligence") {
          extra.intelligence += extra.intelligence + item[j]
        }
        if(j === "agility") {
          extra.agility += extra.agility + item[j]
        }
        if(j === "critical") {
          extra.critical += extra.critical + item[j]
        }
        if(j === "dodge") {
          extra.dodge += extra.dodge + item[j]
        }
      }
    }

    let attack = (this.state.role.strength + extra.strength) * 1
    let minAttack = Math.floor(attack * 0.8) + extra.minAttack
    let maxAttack = Math.floor(attack * 1.2) + extra.maxAttack
    let role = this.state.role

    Object.assign(role,{minAttack,maxAttack})

    this.setState({
      role: role,
      extra: extra
    })
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

    this._updateStatus();

    this.setState({
      enemy: newMonster,
      isFight: true
    },()=> {
      this.fighting()
    })
  }

  fighting() {
    let role = this.state.role
    let enemy = this.state.enemy
    let bag = this.state.bag
    if(this.state.isFight) {
      if(role.agility >= enemy.agility && !role.isTurn) {
        let attack = role.minAttack + Math.floor(Math.random()*(role.maxAttack - role.minAttack))
        let damage = attack - enemy.defense > 0 ? attack - enemy.defense : 0
        enemy.nowHP = enemy.nowHP - damage
        let description = this.state.description
        let str,isFight
        if(enemy.nowHP <= 0) {
          let exp = this.state.role.level * 20
          let money = 30
          let random = Math.floor(Math.random() * 100)
          if(random >= 0) {
            let equipLength = equipment.length
            let roll = Math.floor(Math.random() * equipLength)
            let equip = equipment[roll]
            bag.push(equip)
          }
          str = `${this.state.role.name}战斗胜利！获得${exp}经验,${money}金币`
          role.EXP += exp
          role.money += money
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
          role: role,
          bag: bag
        })
        this.refs._flatList.scrollToEnd()

        if(enemy.nowHP <= 0) {
          this.encounter()
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

  _keyExtractor(item, index) {
    return ""+index
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

  _onPressButton(item,index) {
    this.viewArray[index].measure((a, b, width, height, px, py) => {
      console.log(a, b, width, height, px, py)
    })
    let bag = [].concat(this.state.bag)
    let tools = this.state.tools
    let getItem = bag.splice(index,1)[0]
    if(tools[getItem.type].name == undefined) {
      tools[getItem.type] = getItem
    }else {
      bag.push(tools[getItem.type])
      tools[getItem.type] = getItem
    }
    this.setState({
      tools: tools,
      bag: bag
    })
    this._updateStatus()
  }

  _renderBag({item,index}) {
    return <View style={styles.bagItem} ref={(ref) => {
      this.viewArray[index]=ref
    }}
    >
      <Text style={[styles.itemName,styles.fn14]}>{item.name}</Text>
      <View style={styles.bagControl}>
        <TouchableOpacity onPress={evt => this._onPressButton(item,index)}>
          <Text style={[styles.itemOn,styles.fn12]}>装备</Text>
        </TouchableOpacity>
        <TouchableHighlight>
          <Text style={[styles.itemUp,styles.fn12]}>强化</Text>
        </TouchableHighlight>
      </View>
    </View>
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
              <Text style={styles.simpleFn}>力量:{this.state.role.strength + this.state.extra.strength}</Text>
              <Text style={styles.simpleFn}>智力:{this.state.role.intelligence  + this.state.extra.intelligence}</Text>
              <Text style={styles.simpleFn}>敏捷:{this.state.role.agility  + this.state.extra.agility}</Text>
              <Text style={styles.simpleFn}>暴击:{this.state.role.critical  + this.state.extra.critical}</Text>
              <Text style={styles.simpleFn}>闪避:{this.state.role.dodge  + this.state.extra.dodge}</Text>
              <Text style={styles.simpleFn}>攻击力:{this.state.role.minAttack} - {this.state.role.maxAttack}</Text>
          </View>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>装备</Text>
              <Text style={styles.simpleFn}>武器:{this.state.tools.weapon.name == undefined?"无":this.state.tools.weapon.name}</Text>
              <Text style={styles.simpleFn}>衣服:{this.state.tools.clothes.name == undefined?"无":this.state.tools.clothes.name}</Text>
              <Text style={styles.simpleFn}>鞋子:{this.state.tools.shoes.name == undefined?"无":this.state.tools.shoes.name}</Text>
              <Text style={styles.simpleFn}>戒指:{this.state.tools.ring.name == undefined?"无":this.state.tools.ring.name}</Text>
              <Text style={styles.simpleFn}>项链:{this.state.tools.necklace.name == undefined?"无":this.state.tools.necklace.name}</Text>
          </View>
          <View style={styles.flexPart}>
              <Text style={styles.fn24}>对手</Text>
              <Text style={[styles.bold,this.state.enemy.type === "boss"?styles.red:""]}>{this.state.enemy.name}{this.state.enemy.type === "boss"?"(首领)":""}</Text>
              <Text>生命值：{this.state.enemy.HP}</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.enemy.nowHP/this.state.enemy.HP}/>
              <Text style={styles.bold}>赵日天</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.nowHP/this.state.role.HP}/>
              <ProgressBarAndroid style={styles.line} color="blue" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.EXP/this.state.role.maxEXP}/>
              <Text>金币:{this.state.role.money}</Text>
          </View>
        </View>
        <View style={styles.bottomBox}>
          <View style={styles.flexPart2}>
            <Text style={styles.fn24}>战斗</Text>
            <FlatList
              ref="_flatList"
              data={this.state.description}
              extraData={this.state}
              keyExtractor={(item,index) => index}
              renderItem={this._renderItem.bind(this)}
            />
          </View>
          <View style={styles.flexPart}>
            <View style={styles.bagWrap}>
              <Text style={styles.fn24}>背包</Text><Text style={styles.bagMaxLen}>{this.state.bag.length}/50</Text>
            </View>
            <FlatList
              data={this.state.bag}
              extraData={this.state}
              keyExtractor={(item,index) => index}
              renderItem={this._renderBag.bind(this)}
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
  bagItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "visible"
  },
  bagControl: {
    flexDirection: "row",
  },
  bagWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  bagMaxLen: {
    paddingRight: 20
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
  fn14: {
    fontSize: 14
  },
  fn12: {
    fontSize: 12
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
  },
  red: {
    color: "red"
  }
});
