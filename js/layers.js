addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {title: "Productivity", description: "Double point generation", cost: new Decimal(1), unlocked() { return true }},
        12: {title: "Efficiency", description: "Double again", cost: new Decimal(10), unlocked() { return hasUpgrade("p",11) }},
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["blank", "10px"], "upgrades"],
    layerShown(){return true}
})

addLayer("q", {
    name: "quantum",
    symbol: "Q",
    position: 1,
    startData() { return {unlocked: false, points: new Decimal(0), auto: false}},
    color: "#7B2CF6",
    requires: new Decimal(100),
    resource: "quantum points",
    baseResource: "prestige points",
    baseAmount() {return player.p.points},
    type: "normal",
    exponent: 0.7,
    gainMult() { let mult = new Decimal(1); return mult },
    gainExp() { return new Decimal(1) },
    row: 1,
    hotkeys: [{key: "q", description: "Q: Reset for quantum points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}],
    upgrades: {
        11: {title: "Quantum Generator", description: "Generates quantum passively.", cost: new Decimal(5), unlocked() { return true }},
        12: {title: "Auto Quantum", description: "Automatically prestige quantum when possible.", cost: new Decimal(50), unlocked() { return hasUpgrade(this.layer,11) }},
        21: {title: "Quantum Multiplier", description: "Increase quantum gain by 2x.", cost: new Decimal(100), unlocked() { return hasUpgrade(this.layer,12) }},
        22: {title: "Quantum Automation Mastery", description: "Improves passive generation.", cost: new Decimal(500), unlocked() { return hasUpgrade(this.layer,21) }},
        31: {title: "Quantum Accelerator", description: "3x quantum gain boost.", cost: new Decimal(1000), unlocked() { return hasUpgrade(this.layer,22) }},
        32: {title: "Quantum Resonance", description: "Unlock buyables.", cost: new Decimal(5000), unlocked() { return hasUpgrade(this.layer,31) }},
        41: {title: "Quantum Supremacy", description: "5x gain multiplier.", cost: new Decimal(50000), unlocked() { return hasUpgrade(this.layer,32) }},
        42: {title: "Quantum Nexus", description: "Advanced buyables.", cost: new Decimal(500000), unlocked() { return hasUpgrade(this.layer,41) }},
    },
    buyables: {
        11: {
            title: "Quantum Module",
            cost(x=player.q.buyables[11]) { return new Decimal(10).times(Decimal.pow(2,x)) },
            effect(x=player.q.buyables[11]) { return x.plus(1) },
            display() { return "Cost: " + format(this.cost()) + "\\nAmount: " + format(player.q.buyables[11]) + "\\nEffect: +" + format(this.effect()) + "x" },
            canAfford() { return player.q.points.gte(this.cost()) },
            buy() { player.q.points = player.q.points.sub(this.cost()); player.q.buyables[11] = player.q.buyables[11].add(1) },
            unlocked() { return hasUpgrade("q",32) }
        }
    },
    clickables: {
        11: {display() { return "Automation: " + (player.q.auto ? "ON" : "OFF") }, canClick() { return true }, onClick() { player.q.auto = !player.q.auto }, unlocked() { return true }}
    },
    passiveGeneration() { return hasUpgrade("q",11) ? (hasUpgrade("q",22) ? 1 : 0.5) : 0 },
    autoPrestige() { return hasUpgrade("q",12) || player.q.auto },
    automate() {
        const L = "q"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["blank", "10px"], "upgrades", ["blank", "15px"], "buyables", ["blank", "15px"], "clickables"],
    layerShown(){return true}
})

addLayer("r", {
    name: "reality",
    symbol: "R",
    position: 2,
    startData() { return {unlocked: false, points: new Decimal(0), auto: false}},
    color: "#FF7A00",
    requires: new Decimal(1000),
    resource: "reality points",
    baseResource: "quantum points",
    baseAmount() {return player.q.points},
    type: "normal",
    exponent: 0.6,
    gainMult() { let mult = new Decimal(1); return mult },
    gainExp() { return new Decimal(1) },
    row: 2,
    hotkeys: [{key: "r", description: "R: Reset for reality points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}],
    upgrades: {
        11: {title: "Reality Generator", description: "Generates reality passively.", cost: new Decimal(25), unlocked() { return true }},
        12: {title: "Auto Reality", description: "Automatically prestige reality when possible.", cost: new Decimal(200), unlocked() { return hasUpgrade(this.layer,11) }},
        21: {title: "Reality Multiplier", description: "Increase reality gain by 2x.", cost: new Decimal(1000), unlocked() { return hasUpgrade(this.layer,12) }},
        22: {title: "Reality Mastery", description: "Double passive generation.", cost: new Decimal(10000), unlocked() { return hasUpgrade(this.layer,21) }},
        31: {title: "Reality Supremacy", description: "3x gain boost.", cost: new Decimal(100000), unlocked() { return hasUpgrade(this.layer,22) }},
        32: {title: "Reality Nexus", description: "Unlock advanced buyables.", cost: new Decimal(1000000), unlocked() { return hasUpgrade(this.layer,31) }},
    },
    buyables: {
        11: {
            title: "Reality Module",
            cost(x=player.r.buyables[11]) { return new Decimal(100).times(Decimal.pow(3,x)) },
            effect(x=player.r.buyables[11]) { return x.plus(1).times(2) },
            display() { return "Cost: " + format(this.cost()) + "\\nAmount: " + format(player.r.buyables[11]) + "\\nEffect: x" + format(this.effect()) },
            canAfford() { return player.r.points.gte(this.cost()) },
            buy() { player.r.points = player.r.points.sub(this.cost()); player.r.buyables[11] = player.r.buyables[11].add(1) },
            unlocked() { return hasUpgrade("r",32) }
        }
    },
    clickables: {
        11: {display() { return "Automation: " + (player.r.auto ? "ON" : "OFF") }, canClick() { return true }, onClick() { player.r.auto = !player.r.auto }, unlocked() { return true }}
    },
    passiveGeneration() { return hasUpgrade("r",11) ? (hasUpgrade("r",22) ? 0.6 : 0.25) : 0 },
    autoPrestige() { return hasUpgrade("r",12) || player.r.auto },
    automate() {
        const L = "r"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["blank", "10px"], "upgrades", ["blank", "15px"], "buyables", ["blank", "15px"], "clickables"],
    layerShown(){return true}
})
