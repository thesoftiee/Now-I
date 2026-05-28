// Extra layers to extend game length — chained progression
// Layers: s, t, u, v, w, x, y, z, aa, bb, cc, dd

const extraLayerIds = ["s","t","u","v","w","x","y","z","aa","bb","cc","dd"]
const colors = ["#C0392B","#8E44AD","#2980B9","#16A085","#F39C12","#D35400","#2C3E50","#7F8C8D","#27AE60","#9B59B6","#34495E","#E74C3C"]

for (let i=0;i<extraLayerIds.length;i++){
    const id = extraLayerIds[i]
    const layerId = id
    const prev = i===0? 'r' : extraLayerIds[i-1]
    const pow = new Decimal(10).pow(3 + i) // requirements grow: 1e3, 1e4, ...
    addLayer(id, {
        name: id==="aa"? "alpha" : id==="bb"? "beta" : id==="cc"? "gamma" : id==="dd"? "delta" : id,
        symbol: id.toUpperCase(),
        position: i+3,
        startData() { return {unlocked: false, points: new Decimal(0), auto: false}},
        color: colors[i % colors.length],
        requires: pow,
        resource: id + " points",
        baseResource: prev + " points",
        baseAmount() { return player[prev] ? player[prev].points : new Decimal(0) },
        type: "normal",
        exponent: 0.65 - Math.min(i*0.01,0.25),
        gainMult() { return new Decimal(1) },
        gainExp() { return new Decimal(1) },
        row: 3 + Math.floor(i/4),
        hotkeys: [ {key: id, description: id.toUpperCase()+": Reset for " + id + " points", onPress(){if (canReset(this.layer)) doReset(this.layer)}} ],
        upgrades: {
            11: {title: "Boost", description: "Increase point gain by 10%.", cost: new Decimal(5), unlocked() { return true }},
            12: {title: "Strong Boost", description: "Increase gain by 50%.", cost: new Decimal(25), unlocked() { return hasUpgrade(this.layer,11) }},
            21: {title: "Precision Boost", description: "Gain 25% more.", cost: new Decimal(100), unlocked() { return hasUpgrade(this.layer,12) }},
            22: {title: "Automation Module", description: "Enable auto-prestige.", cost: new Decimal(250), unlocked() { return hasUpgrade(this.layer,21) }},
            31: {title: "Passive Generation", description: "Passive gain of 0.5x.", cost: new Decimal(500), unlocked() { return hasUpgrade(this.layer,22) }},
            32: {title: "Advanced Modules", description: "Unlock buyables.", cost: new Decimal(5000), unlocked() { return hasUpgrade(this.layer,31) }},
        },
        buyables: {
            11: {
                title: "Module",
                cost(x=player[layerId].buyables[11]) { return new Decimal(10).times(Decimal.pow(2,x)) },
                effect(x=player[layerId].buyables[11]) { return x.plus(1) },
                display() { return "Cost: " + format(this.cost()) + "\\nAmount: " + format(player[layerId].buyables[11]) + "\\nEffect: +" + format(this.effect()) + "x" },
                canAfford() { return player[layerId].points.gte(this.cost()) },
                buy() { player[layerId].points = player[layerId].points.sub(this.cost()); player[layerId].buyables[11] = player[layerId].buyables[11].add(1) },
                unlocked() { return hasUpgrade(layerId,32) }
            }
        },
        clickables: {
            11: {display() { return "Automation: " + (player[layerId].auto ? "ON" : "OFF") }, canClick() { return true }, onClick() { player[layerId].auto = !player[layerId].auto }, unlocked() { return true }}
        },
        milestones: {
            0: {requirementDescription: "100 " + id + " points", done() {return player[layerId].best.gte(100)}, effectDescription: "Unlock tier 1 upgrades"},
            1: {requirementDescription: "1,000 " + id + " points", done() {return player[layerId].best.gte(1000)}, effectDescription: "Generation doubled", unlocked() {return hasMilestone(layerId, 0)}},
        },
        achievements: {
            11: {name: "Welcome to " + id, done() {return player[layerId].best.gte(1)}, goalTooltip: "Gain 1 " + id + " point", doneTooltip: "New layer unlocked!"},
            12: {name: id + " Enthusiast", done() {return hasUpgrade(layerId, 22)}, goalTooltip: "Buy the Automation Module", doneTooltip: "Automation engaged!"},
        },
        challenges: {
            11: {
                name: "No Buyables",
                completionLimit: 1,
                challengeDescription() {return "Gain points without buyables" + (hasChallengeCompletions(layerId, this.id) >= this.completionLimit ? " (Done)" : "")},
                unlocked() { return player[layerId].best.gte(500) },
                goalDescription: 'Reach 5,000 ' + id + ' points',
                canComplete() { return player[layerId].points.gte(5000) },
                rewardDescription: "Milestone bonus",
            },
        },
        bars: {
            progress: {
                direction: RIGHT,
                width: 300,
                height: 25,
                progress() { return player[layerId].points.log(10).div(10) },
                fillStyle: {"background-color": colors[i % colors.length]},
                display() { return format(player[layerId].points) }
            }
        },
        infoboxes: {
            main: {
                title: id.toUpperCase() + " Layer",
                body: "Progress through " + id + " and unlock new challenges and upgrades.",
                bodyStyle: {"color": "#FFF"}
            }
        },
        passiveGeneration() { return hasUpgrade(layerId,31) ? tmp[layerId].buyables[11].effect().times(0.5) : (player[layerId].buyables[11] ? player[layerId].buyables[11].times(0.1) : new Decimal(0)) },
        autoPrestige() { return hasUpgrade(layerId,22) || player[layerId].auto },
        automate() {
            const L = layerId
            if (!player[L].unlocked) return
            if (tmp[L].upgrades) for (let u in tmp[L].upgrades) if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
            if (tmp[L].buyables) for (let b in tmp[L].buyables) if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
            if ((hasUpgrade(L,22) || player[L].auto) && tmp[L].canReset) doReset(L)
        },
        tabFormat: [["main-display"], ["prestige-button"], ["resource-display"], ["bar", "progress"], ["blank", "10px"], "upgrades", ["blank", "15px"], "buyables", ["blank", "15px"], ["display-text", "Milestones:"], "milestones", ["blank", "15px"], ["infobox", "main"], ["blank", "15px"], "challenges", ["blank", "15px"], "achievements", ["blank", "15px"], "clickables"],
        layerShown(){ return true }
    })
}

// Simple helper upgrades availability check uses existing functions in core game
