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
    layerShown(){return true}
})

addLayer("q", {
    name: "quantum",
    symbol: "Q",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        auto: false,
    }},
    color: "#7B2CF6",
    requires: new Decimal(100),
    resource: "quantum points",
    baseResource: "prestige points",
    baseAmount() {return player.p.points},
    type: "normal",
    exponent: 0.7,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "q", description: "Q: Reset for quantum points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Quantum Generator",
            description: "Generates quantum passively.",
            cost: new Decimal(5),
            unlocked() { return true }
        },
        12: {
            title: "Auto Quantum",
            description: "Automatically prestige quantum when possible.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade(this.layer,11) }
        },
        21: {
            title: "Quantum Multiplier",
            description: "Increase quantum gain by 2x.",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade(this.layer,12) }
        },
        22: {
            title: "Quantum Automation Mastery",
            description: "Improves passive generation and autobuy behavior.",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade(this.layer,21) }
        }
    },
    passiveGeneration() { return hasUpgrade("q",11) ? (hasUpgrade("q",22) ? 1 : 0.5) : 0 },
    autoPrestige() { return hasUpgrade("q",12) || player.q.auto },
    automate() {
        const L = "q"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades)
            for (let u in tmp[L].upgrades)
                if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        // buy buyables if present
        if (tmp[L].buyables)
            for (let b in tmp[L].buyables)
                if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    clickables: {
        11: {
            display() { return "Automation: " + (player.q.auto ? "ON" : "OFF") },
            canClick() { return true },
            onClick() { player.q.auto = !player.q.auto },
            unlocked() { return true }
        }
    },
    layerShown(){return true}
})

addLayer("r", {
    name: "reality",
    symbol: "R",
    position: 2,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        auto: false,
    }},
    color: "#FF7A00",
    requires: new Decimal(1000),
    resource: "reality points",
    baseResource: "quantum points",
    baseAmount() {return player.q.points},
    type: "normal",
    exponent: 0.6,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "r", description: "R: Reset for reality points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Reality Generator",
            description: "Generates reality passively.",
            cost: new Decimal(25),
            unlocked() { return true }
        },
        12: {
            title: "Auto Reality",
            description: "Automatically prestige reality when possible.",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade(this.layer,11) }
        },
        21: {
            title: "Reality Multiplier",
            description: "Increase reality gain by 2x.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade(this.layer,12) }
        }
    },
    passiveGeneration() { return hasUpgrade("r",11) ? (hasUpgrade("r",21) ? 0.6 : 0.25) : 0 },
    autoPrestige() { return hasUpgrade("r",12) || player.r.auto },
    automate() {
        const L = "r"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades)
            for (let u in tmp[L].upgrades)
                if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        if (tmp[L].buyables)
            for (let b in tmp[L].buyables)
                if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    clickables: {
        11: {
            display() { return "Automation: " + (player.r.auto ? "ON" : "OFF") },
            canClick() { return true },
            onClick() { player.r.auto = !player.r.auto },
            unlocked() { return true }
        }
    },
    layerShown(){return true}
})
