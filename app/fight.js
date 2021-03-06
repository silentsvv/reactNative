import React from 'react';
import { StyleSheet, Alert,Text, FlatList, StatusBar, View, TextInput, ProgressBarAndroid,Button,TouchableHighlight,TouchableOpacity } from 'react-native';
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
          time: 0
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
          time: 0
        }
      ],
      set: {
        maxDesLen : 50, //最大的战况输出数
        maxItemLen : 50, //最大道具数
        probability : 0, //!获得道具几率
        time: 1000, //回合时间
        money: 60 //金币基数
      },
      location: {
        pageX: 10,
        pageY: 20,
        height: 0
      },
      equipData: {},
      isShow: false,
      money: 0,
      randomColor: "666"
    }
	}

  componentWillMount() {
    this.timer && clearTimeout(this.timer);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
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
      let time = item.time
      for(let j in item) {
        if(time != undefined) {
          console.log("!!!you")
          if(j === "HP") {
            extra.HP += extra.HP + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "attack") {
            extra.attack += extra.attack + Math.round(item[j] * (1+ 0.1* time))
            
          }
          if(j === "minAttack") {
            extra.minAttack += extra.minAttack + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "maxAttack") {
            extra.maxAttack += extra.maxAttack + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "strength") {
            extra.strength += extra.strength + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "intelligence") {
            extra.intelligence += extra.intelligence + Math.round(item[j] * (1+ 0.1* time))

          }
          if(j === "agility") {
            extra.agility += extra.agility + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "critical") {
            extra.critical += extra.critical + Math.round(item[j] * (1+ 0.1* time))
          }
          if(j === "dodge") {
            extra.dodge += extra.dodge + Math.round(item[j] * (1+ 0.1* time))
          }
        }else {
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
    let randomColor = "#" + Math.floor((Math.random()*10)) + "" + Math.floor((Math.random()*10)) + "" + Math.floor((Math.random()*10))
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
      randomColor: randomColor,
      isFight: true
    },()=> {
      this.fighting()
    })
  }

  fighting() {
    let role = this.state.role
    let enemy = this.state.enemy
    let bag = this.state.bag
    let money = this.state.money
    let description = [].concat(this.state.description)
    let _this = this
    let date = new Date()
    let timeNow = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

    if(this.state.isFight) {
      if(role.agility >= enemy.agility && !role.isTurn) {
        let attack = role.minAttack + Math.floor(Math.random()*(role.maxAttack - role.minAttack))
        let damage = attack - enemy.defense > 0 ? attack - enemy.defense : 0
        enemy.nowHP = enemy.nowHP - damage
        let str,isFight
        if(enemy.nowHP <= 0) {
          let exp = this.state.role.level * 20
          let getMoney = 30 //金币设定
          let random = Math.floor(Math.random() * 100)
          if(random >= this.state.set.probability && bag.length < this.state.set.maxItemLen) {
            let equipLength = equipment.length
            let roll = Math.floor(Math.random() * equipLength)
            let equip = Object.assign({},equipment[roll])
            bag.push(equip)
          }
          str = <Text>[{timeNow}]<Text style={{color: "#f20"}}>战斗胜利！</Text>获得<Text style={{color: "#40b5ef"}}>{exp}</Text>经验,<Text style={{color: "#f7a60d"}}>{getMoney}</Text>金币</Text>
          role.EXP += exp
          money += getMoney
          role.nowHP = role.HP
          
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
          str = <Text>[{timeNow}]你对<Text style={{color:this.state.randomColor}}>{enemy.name}</Text>造成了<Text style={{color:"red"}}>{damage}</Text>伤害</Text>
          isFight = true
        }
        if(description.length >= this.state.set.maxDesLen) {
          description.splice(0,1)
        }
        description.push({log:str})
        role.isTurn = true
        this.setState({
          isFight: isFight,
          enemy: enemy,
          description: description,
          role: role,
          bag: bag
        },()=> {
          this.refs._flatList.scrollToEnd()
        })
        

        if(enemy.nowHP <= 0) {
          this.encounter()
        }else {
          setTimeout(function(){
            _this.fighting()
          }, _this.state.set.time)
        }
      }else {
        let damage = enemy.attack - role.defense > 0 ? enemy.attack - role.defense : 0
        role.nowHP = role.nowHP - damage
        let str,isFight
        if(role.nowHP <= 0) {
          str = <Text>{this.state.role.name}战斗失败!</Text>
          role.nowHP = role.HP
          isFight = false
        }else {
          // str = `${enemy.name}对${this.state.role.name}造成了${damage}伤害`
          str = <Text>[{timeNow}]<Text style={{color:this.state.randomColor}}>{enemy.name}</Text>对你造成了<Text style={{color:"red"}}>{damage}</Text>伤害</Text>
          isFight = true
        }
        if(description.length >= this.state.set.maxDesLen) {
          description.splice(0,1)
        }
        description.push({log:str})
        role.isTurn = false
        this.setState({
          isFight: isFight,
          enemy: enemy,
          description: description,
          role: role
        },()=> {
          this.refs._flatList.scrollToEnd()
        })
        if(role.nowHP <= 0) {
          this.encounter()
        }else {
          setTimeout(function(){
            _this.fighting()
          }, _this.state.set.time)
        }
      }
    }
  }

  _keyExtractor(item, index) {
    return ""+index
  }


  _renderItem({item}) {
    return <Text style={[styles.fn12, styles.gray]}>{item.log}</Text>
  }

  _onPressButton(evt,item,index) {
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

  _sale(item,index) {
    let bag = [].concat(this.state.bag)
    let money = this.state.money + item.level * this.state.set.money
    bag.splice(index,1)[0]

    this.setState({
      money: money,
      bag: bag
    })
  }

  _upgrade(item,index) {
    let bag = [].concat(this.state.bag)
    let target = bag[index]
    target.time++
    this.setState({
      bag: bag
    })
  }

  _renderBag({item,index}) {
    return <View style={styles.bagItem}>
      <TouchableOpacity 
        onPress={evt => this._onPressButton(item,index)}
        onLongPress= {
          (evt) => {
            let location = this.state.location
            location.pageY = Math.floor(evt.nativeEvent.pageY)
            this.setState({
              location: location,
              equipData: item,
              isShow: true
            })
          }
        }
        onPressOut={() => {
          setTimeout(()=> {
            this.setState({
              isShow: false
            })
          },1000)
        }}
      >
        <Text style={[styles.itemName,styles.fn14]}>{item.name}{item.time>0?"+"+item.time:""}</Text>
      </TouchableOpacity>
      <View style={styles.bagControl}>
        <TouchableOpacity onPress={()=> this._upgrade(item,index)}>
          <Text style={[styles.itemOn,styles.fn12],{padding:2, color:"#f20"}}>强化</Text>
        </TouchableOpacity>
        <TouchableHighlight onPress={()=> this._sale(item,index)}>
          <Text style={[styles.itemUp,styles.fn12],{padding:2, color:"#2f5884"}}>卖出</Text>
        </TouchableHighlight>
      </View>
    </View>
  }

  render() {
  	return (
      <View style={styles.mainWrapper} onLayout={(e) => {
          console.log(e.nativeEvent,1)
          let location = this.state.location
          location.height = e.nativeEvent.layout.height
          this.setState({
            location: location
          })
        }}>
        <StatusBar
         hidden={false}
         translucent={false}
         barStyle={'default'}
        /> 
        <View style={styles.topWrapper}>
          <View style={[styles.flexPart,styles.bgWhite,styles.padLeft]}>
              <Text style={styles.fn24}>{this.state.role.name} lv{this.state.role.level}</Text>
              <Text style={styles.simpleFn}>力量:<Text style={styles.value}>{this.state.role.strength + this.state.extra.strength}</Text></Text>
              <Text style={styles.simpleFn}>智力:<Text style={styles.value}>{this.state.role.intelligence  + this.state.extra.intelligence}</Text></Text>
              <Text style={styles.simpleFn}>敏捷:<Text style={styles.value}>{this.state.role.agility  + this.state.extra.agility}</Text></Text>
              <Text style={styles.simpleFn}>暴击:<Text style={styles.value}>{this.state.role.critical  + this.state.extra.critical}</Text></Text>
              <Text style={styles.simpleFn}>闪避:<Text style={styles.value}>{this.state.role.dodge  + this.state.extra.dodge}</Text></Text>
              <Text style={styles.simpleFn}>攻击力:{this.state.role.minAttack} - {this.state.role.maxAttack}</Text>
          </View>
          <View style={[styles.flexPart,styles.bgWhite,styles.equipWrapper]}>
            <TouchableOpacity>
              <Text style={styles.fn24}>装备</Text>
            </TouchableOpacity>
              <Text style={styles.simpleFn}>武器:{this.state.tools.weapon.name == undefined?"无":(this.state.tools.weapon.name + (this.state.tools.weapon.time?"+"+this.state.tools.weapon.time:""))}</Text>
              <Text style={styles.simpleFn}>衣服:{this.state.tools.clothes.name == undefined?"无":this.state.tools.clothes.name}</Text>
              <Text style={styles.simpleFn}>鞋子:{this.state.tools.shoes.name == undefined?"无":this.state.tools.shoes.name}</Text>
              <Text style={styles.simpleFn}>戒指:{this.state.tools.ring.name == undefined?"无":this.state.tools.ring.name}</Text>
              <Text style={styles.simpleFn}>项链:{this.state.tools.necklace.name == undefined?"无":this.state.tools.necklace.name}</Text>
          </View>
          <View style={[styles.flexPart,styles.bgWhite, styles.padLeft]}>
              <Text style={styles.fn24}>对手</Text>
              <Text style={[styles.bold,this.state.enemy.type === "boss"?styles.red:""]}>{this.state.enemy.name}{this.state.enemy.type === "boss"?"(首领)":""}</Text>
              <Text>生命值：{this.state.enemy.HP}</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.enemy.nowHP/this.state.enemy.HP}/>
              <Text style={styles.bold}>赵日天</Text>
              <Text>生命值：{this.state.role.HP}</Text>
              <ProgressBarAndroid style={styles.line} color="#f22" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.nowHP/this.state.role.HP}/>
              <ProgressBarAndroid style={styles.line} color="blue" styleAttr="Horizontal" indeterminate={false} progress={this.state.role.EXP/this.state.role.maxEXP}/>
              <Text>金币:{this.state.money}</Text>
          </View>
        </View>
        <View style={styles.bottomWrapper}>
          <View style={[styles.flexPart2,styles.bgWhite,styles.padLeft]}>
            <Text style={styles.fn24}>战斗</Text>
            <FlatList
              ref="_flatList"
              data={this.state.description}
              extraData={this.state}
              keyExtractor={(item,index) => index}
              renderItem={this._renderItem.bind(this)}
            />
          </View>
          <View style={[styles.flexPart,styles.bgWhite,styles.bagWrapper,styles.padLeft]}>
            <View style={styles.bag}>
              <Text style={styles.fn24}>背包</Text><Text style={styles.bagMaxLen}>{this.state.bag.length}/50</Text>
            </View>
            <FlatList
              data={this.state.bag}
              extraData={this.state}
              onLayout={(e) => {
                console.log(e.nativeEvent,1)
                let location = this.state.location
                location.pageX = e.nativeEvent.layout.width
                this.setState({
                  location: location
                })
              }}
              keyExtractor={(item,index) => index}
              renderItem={this._renderBag.bind(this)}
            />
          </View>
        </View>
        {this.state.isShow?(<EquipDetail data={this.state.equipData} {...this.state.location}/>):(null)}
      </View>
  	)
  }
}

const styles = StyleSheet.create({
  //最外层包裹
  mainWrapper: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#cdcdcd",
    borderColor: "#cdcdcd",
    borderBottomWidth: 1
  },

  //顶部区域包裹
  topWrapper: {
    flexDirection: "row",
    paddingTop: 25,
    flex: 3
  },

  //底部区域包裹
  bottomWrapper: {
    flexDirection: "row",
    paddingTop: 5,
    flex: 5
  },

  //对手信息区域
  padding5: {
    
  },

  //装备区域
  equipWrapper: {
    marginRight: 5,
  },

  //背包区域
  bagWrapper: {
    marginLeft: 5,
  },

  //背包装备行样式
  bagItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "visible",
    borderColor: "#eee",
    borderBottomWidth: 1,
  },


  //背包行样式设置
  bagControl: {
    flexDirection: "row",
  },

  //背包标题区域
  bag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#eee",
    borderBottomWidth: 1
  },

  //背包数字显示
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
    fontSize: 14,
    lineHeight: 24,
  },
  value: {
    color: "#eac547"
  },
  line: {
    width: "80%"
  },
  red: {
    color: "red"
  },
  gray: {
    color: "#333"
  },
  bgWhite: {
    backgroundColor: "#fff"
  },
  padLeft: {
    paddingLeft: 5
  } 
});
