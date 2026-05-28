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
    milestones: {
        0: {requirementDescription: "100 Points", done() {return player.points.gte(100)}, effectDescription: "Unlock prestige upgrades"},
        1: {requirementDescription: "10,000 Points", done() {return player.points.gte(10000)}, effectDescription: "You can prestige twice as fast", unlocked() {return hasMilestone("p", 0)}},
    },
    achievements: {
        11: {name: "First Steps", done() {return player.p.best.gte(1)}, goalTooltip: "Gain 1 prestige point", doneTooltip: "Welcome to prestige!"},
        12: {name: "Point Collector", done() {return player.points.gte(1000)}, goalTooltip: "Collect 1000 points", doneTooltip: "You're on your way!"},
    },
    bars: {
        progressBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            progress() { return player.points.log(10).div(9) },
            fillStyle: {"background-color": "#4BDC13"},
            textStyle: {"color": "#000"},
            display() { return format(player.points) + " / 1e9"}
        }
    },
    infoboxes: {
        lore: {
            title: "Points",
            body: "Gain points by clicking or passively. Prestige to reset and gain prestige points which multiply point generation.",
            bodyStyle: {"color": "#FFF"}
        }
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["blank", "10px"], "upgrades", ["blank", "15px"], ["display-text", "Milestones:"], "milestones", ["blank", "15px"], ["infobox", "lore"]],
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
    milestones: {
        0: {requirementDescription: "5 Quantum Points", done() {return player.q.best.gte(5)}, effectDescription: "Unlock first tier upgrades"},
        1: {requirementDescription: "50 Quantum Points", done() {return player.q.best.gte(50)}, effectDescription: "Quantum generation increased", unlocked() {return hasMilestone("q", 0)}},
        2: {requirementDescription: "500 Quantum Points", done() {return player.q.best.gte(500)}, effectDescription: "Unlock advanced upgrades", unlocked() {return hasMilestone("q", 1)}},
    },
    achievements: {
        11: {name: "Quantum Leap", done() {return player.q.best.gte(1)}, goalTooltip: "Gain 1 quantum point", doneTooltip: "Welcome to the quantum realm!"},
        12: {name: "Auto Quantum Master", done() {return hasUpgrade("q", 12)}, goalTooltip: "Buy the auto-prestige upgrade", doneTooltip: "Automation unlocked!"},
        21: {name: "Quantum Rich", done() {return player.q.best.gte(10000)}, goalTooltip: "Reach 10,000 quantum points", doneTooltip: "You're wealthy!"},
    },
    challenges: {
        11: {
            name: "Quantum Silence",
            completionLimit: 1,
            challengeDescription() {return "Gain quantum points without passive generation" + (hasChallengeCompletions("q", this.id) >= this.completionLimit ? " (Completed)" : "")},
            unlocked() { return player.q.best.gte(10) },
            goalDescription: 'Have 100 quantum points while in this challenge',
            canComplete() { return player.q.points.gte(100) },
            rewardDescription: "Unlock advanced upgrades",
        },
    },
    bars: {
        quantum: {
            direction: RIGHT,
            width: 300,
            height: 25,
            progress() { return player.q.points.log(10).div(8) },
            fillStyle: {"background-color": "#7B2CF6"},
            display() { return format(player.q.points) }
        }
    },
    infoboxes: {
        main: {
            title: "Quantum Layer",
            body: "Quantum points multiply your point generation. Build up quantum and unlock advanced tiers!",
            bodyStyle: {"color": "#FFF"}
        }
    },
    passiveGeneration() { return hasUpgrade("q",11) ? (hasUpgrade("q",22) ? 1 : 0.5) : 0 },
    autoPrestige() { return hasUpgrade("q",12) || player.q.auto },
    automate() {
        const L = "q"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["bar", "quantum"], ["blank", "10px"], "upgrades", ["blank", "15px"], "buyables", ["blank", "15px"], ["display-text", "Milestones:"], "milestones", ["blank", "15px"], ["infobox", "main"], ["blank", "15px"], "challenges", ["blank", "15px"], "clickables"],
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
    milestones: {
        0: {requirementDescription: "10 Reality Points", done() {return player.r.best.gte(10)}, effectDescription: "Unlock milestone tier 1"},
        1: {requirementDescription: "100 Reality Points", done() {return player.r.best.gte(100)}, effectDescription: "Reality generation increased", unlocked() {return hasMilestone("r", 0)}},
        2: {requirementDescription: "1,000 Reality Points", done() {return player.r.best.gte(1000)}, effectDescription: "Unlock higher tier upgrades", unlocked() {return hasMilestone("r", 1)}},
    },
    achievements: {
        11: {name: "Reality Check", done() {return player.r.best.gte(1)}, goalTooltip: "Gain 1 reality point", doneTooltip: "Reality is what you make it!"},
        12: {name: "Master of Reality", done() {return hasUpgrade("r", 21)}, goalTooltip: "Buy the Reality Multiplier", doneTooltip: "Your power grows!"},
        21: {name: "Ultimate Reality", done() {return player.r.best.gte(100000)}, goalTooltip: "Reach 100,000 reality points", doneTooltip: "You've conquered reality!"},
    },
    challenges: {
        11: {
            name: "Reality Bound",
            completionLimit: 1,
            challengeDescription() {return "No automation allowed" + (hasChallengeCompletions("r", this.id) >= this.completionLimit ? " (Completed)" : "")},
            unlocked() { return player.r.best.gte(50) },
            goalDescription: 'Manually achieve 500 reality points in this challenge',
            canComplete() { return player.r.points.gte(500) },
            rewardDescription: "Unlock new buyables",
        },
    },
    bars: {
        reality: {
            direction: RIGHT,
            width: 300,
            height: 25,
            progress() { return player.r.points.log(10).div(7) },
            fillStyle: {"background-color": "#FF7A00"},
            display() { return format(player.r.points) }
        }
    },
    infoboxes: {
        main: {
            title: "Reality Layer",
            body: "Reality points are the ultimate multiplier. Harness their power to reshape existence itself!",
            bodyStyle: {"color": "#FFF"}
        }
    },
    passiveGeneration() { return hasUpgrade("r",11) ? (hasUpgrade("r",22) ? 0.6 : 0.25) : 0 },
    autoPrestige() { return hasUpgrade("r",12) || player.r.auto },
    automate() {
        const L = "r"
        if (!player[L].unlocked) return
        if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
        if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
    },
    tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["bar", "reality"], ["blank", "10px"], "upgrades", ["blank", "15px"], "buyables", ["blank", "15px"], ["display-text", "Milestones:"], "milestones", ["blank", "15px"], ["infobox", "main"], ["blank", "15px"], "challenges", ["blank", "15px"], "clickables"],
    layerShown(){return true}
})
