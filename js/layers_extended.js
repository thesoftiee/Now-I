// Extended layers - massive progression with rich features
// Layers: ee, ff, gg, hh, ii, jj, kk, ll, mm, nn, oo, pp, qq, rr, ss, tt, uu, vv, ww, xx, yy, zz, and more
// Total: adds 24 more layers for massive gameplay depth

const extendedLayerIds = ["ee","ff","gg","hh","ii","jj","kk","ll","mm","nn","oo","pp","qq","rr","ss","tt","uu","vv","ww","xx","yy","zz"]
const extendedColors = ["#E74C3C","#3498DB","#2ECC71","#F39C12","#9B59B6","#1ABC9C","#E67E22","#34495E","#16A085","#D35400","#C0392B","#BDC3C7","#27AE60","#2980B9","#8E44AD","#00BCD4","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA15E"]

for (let i=0;i<extendedLayerIds.length;i++){
    const id = extendedLayerIds[i]
    const layerId = id
    const prev = i===0? 'dd' : extendedLayerIds[i-1]
    const pow = new Decimal(10).pow(15 + i) // massive requirements
    const row = 4 + Math.floor(i/4)
    
    addLayer(id, {
        name: id,
        symbol: id.toUpperCase().charAt(0) + id.toUpperCase().charAt(1),
        position: i+3,
        startData() { return {unlocked: false, points: new Decimal(0), auto: false, bonus: new Decimal(1)}},
        color: extendedColors[i % extendedColors.length],
        requires: pow,
        resource: id + " points",
        baseResource: prev + " points",
        baseAmount() { return player[prev] ? player[prev].points : new Decimal(0) },
        type: "normal",
        exponent: 0.6 - Math.min(i*0.005,0.2),
        gainMult() { let m = new Decimal(1); if (player[layerId].bonus) m = m.times(player[layerId].bonus); return m },
        gainExp() { return new Decimal(1) },
        row: row,
        displayRow: row,
        hotkeys: [ {key: "", description: "", onPress(){if (canReset(this.layer)) doReset(this.layer)}} ],
        
        upgrades: {
            11: {title: "Generator I", description: "Start generating " + id + " passively.", cost: new Decimal(5), unlocked() { return true }},
            12: {title: "Generator II", description: "Double passive gain.", cost: new Decimal(50), unlocked() { return hasUpgrade(layerId,11) }},
            13: {title: "Generator III", description: "Triple passive gain.", cost: new Decimal(500), unlocked() { return hasUpgrade(layerId,12) }},
            21: {title: "Multiplier I", description: "+50% gain.", cost: new Decimal(100), unlocked() { return hasUpgrade(layerId,12) }},
            22: {title: "Multiplier II", description: "+100% gain.", cost: new Decimal(1000), unlocked() { return hasUpgrade(layerId,21) }},
            23: {title: "Multiplier III", description: "+200% gain.", cost: new Decimal(10000), unlocked() { return hasUpgrade(layerId,22) }},
            31: {title: "Auto-Prestige I", description: "Auto prestige when possible.", cost: new Decimal(250), unlocked() { return hasUpgrade(layerId,13) }},
            32: {title: "Auto-Prestige II", description: "Improved auto-prestige.", cost: new Decimal(2500), unlocked() { return hasUpgrade(layerId,31) }},
            41: {title: "Synergy I", description: "Buyables are 20% cheaper.", cost: new Decimal(500), unlocked() { return hasUpgrade(layerId,23) }},
            42: {title: "Synergy II", description: "Buyables are 50% cheaper.", cost: new Decimal(5000), unlocked() { return hasUpgrade(layerId,41) }},
            51: {title: "Ascension", description: "Unlock advanced buyables.", cost: new Decimal(50000), unlocked() { return hasUpgrade(layerId,42) }},
        },
        
        buyables: {
            11: {
                title: "Module I",
                cost(x=player[layerId].buyables[11]) {
                    let base = new Decimal(10).times(Decimal.pow(2,x))
                    if (hasUpgrade(layerId,41)) base = base.times(0.8)
                    if (hasUpgrade(layerId,42)) base = base.times(0.5)
                    return base
                },
                effect(x=player[layerId].buyables[11]) { return x.plus(1).times(1.5) },
                display() { return "Cost: " + format(this.cost()) + "<br>Owned: " + format(player[layerId].buyables[11]) + "<br>Bonus: x" + format(this.effect()) },
                canAfford() { return player[layerId].points.gte(this.cost()) },
                buy() { player[layerId].points = player[layerId].points.sub(this.cost()); player[layerId].buyables[11] = player[layerId].buyables[11].add(1) },
                unlocked() { return true }
            },
            12: {
                title: "Module II",
                cost(x=player[layerId].buyables[12]) {
                    let base = new Decimal(100).times(Decimal.pow(3,x))
                    if (hasUpgrade(layerId,41)) base = base.times(0.8)
                    if (hasUpgrade(layerId,42)) base = base.times(0.5)
                    return base
                },
                effect(x=player[layerId].buyables[12]) { return x.times(2).plus(1) },
                display() { return "Cost: " + format(this.cost()) + "<br>Owned: " + format(player[layerId].buyables[12]) + "<br>Bonus: +" + format(this.effect()) + "x" },
                canAfford() { return player[layerId].points.gte(this.cost()) },
                buy() { player[layerId].points = player[layerId].points.sub(this.cost()); player[layerId].buyables[12] = player[layerId].buyables[12].add(1) },
                unlocked() { return hasUpgrade(layerId,51) }
            },
        },
        
        clickables: {
            11: {display() { return "Automation: " + (player[layerId].auto ? "ON" : "OFF") }, canClick() { return true }, onClick() { player[layerId].auto = !player[layerId].auto }, unlocked() { return true }}
        },
        
        milestones: {
            0: {requirementDescription: "1,000 " + id + " points", done() {return player[layerId].best.gte(1000)}, effectDescription: "Unlock second milestone"},
            1: {requirementDescription: "1,000,000 " + id + " points", done() {return player[layerId].best.gte(1000000)}, effectDescription: "+50% to all gains", unlocked() {return hasMilestone(layerId, 0)}},
        },
        
        achievements: {
            11: {name: "Welcome to " + id.toUpperCase(), done() {return player[layerId].best.gte(1)}, goalTooltip: "Gain 1 " + id + " point", doneTooltip: "New frontier!"},
            12: {name: "Collector", done() {return player[layerId].best.gte(100000)}, goalTooltip: "Reach 100k " + id + " points", doneTooltip: "Collector supreme!"},
            21: {name: "Auto Master", done() {return hasUpgrade(layerId, 32)}, goalTooltip: "Buy Auto-Prestige II", doneTooltip: "Full automation!"},
        },
        
        challenges: {
            11: {
                name: "No Upgrades",
                completionLimit: 1,
                challengeDescription() {return "Gain without upgrades" + (hasChallengeCompletions(layerId, this.id) >= this.completionLimit ? " (Done)" : "")},
                unlocked() { return player[layerId].best.gte(10000) },
                goalDescription: 'Reach 100,000 ' + id + ' points',
                canComplete() { return player[layerId].points.gte(100000) },
                rewardDescription: "+10% passive generation",
            },
        },
        
        bars: {
            progress: {
                direction: RIGHT,
                width: 300,
                height: 25,
                progress() { return Math.min(player[layerId].points.log(10).div(15).toNumber(), 1) },
                fillStyle: {"background-color": extendedColors[i % extendedColors.length]},
                display() { return format(player[layerId].points) }
            }
        },
        
        infoboxes: {
            main: {
                title: id.toUpperCase() + " - Layer " + (i+13),
                body: "Progress infinitely through " + id + ". Each layer builds upon the last, multiplying your power exponentially!",
                bodyStyle: {"color": "#FFF", "font-size": "12px"}
            }
        },
        
        nodeStyle() { 
            return {
                "background-color": extendedColors[i % extendedColors.length],
                "border-radius": "5px",
                "box-shadow": "0 0 10px " + extendedColors[i % extendedColors.length]
            }
        },
        glowColor: extendedColors[i % extendedColors.length],
        
        passiveGeneration() { 
            let gen = new Decimal(0)
            if (hasUpgrade(layerId,11)) gen = gen.plus(0.5)
            if (hasUpgrade(layerId,12)) gen = gen.times(2)
            if (hasUpgrade(layerId,13)) gen = gen.times(1.5)
            if (player[layerId].buyables[11]) gen = gen.times(player[layerId].buyables[11].plus(1))
            if (hasMilestone(layerId, 1)) gen = gen.times(1.5)
            return gen 
        },
        autoPrestige() { return hasUpgrade(layerId,31) || player[layerId].auto },
        automate() {
            const L = layerId
            if (!player[L].unlocked) return
            if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
            if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
            if ((hasUpgrade(L,31) || player[L].auto) && tmp[L].canReset) doReset(L)
        },
        
        tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["bar", "progress"], ["blank", "10px"], ["display-text", "Upgrades:"], "upgrades", ["blank", "15px"], ["display-text", "Modules:"], "buyables", ["blank", "15px"], ["display-text", "Milestones & Achievements:"], ["row", ["milestones", "achievements"]], ["blank", "15px"], ["display-text", "Challenges:"], "challenges", ["blank", "15px"], ["infobox", "main"], ["blank", "15px"], "clickables"],
        
        layerShown(){ return true }
    })
}
