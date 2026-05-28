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
        symbol: id.toUpperCase().replace(/AA|BB|CC|DD/,(m)=>m),
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
            11: {
                title: "Boost",
                description: "Increase point gain by 10%.",
                cost: new Decimal(5),
                effect() { return new Decimal(1.1) },
                unlocked() { return true }
            },
            12: {
                title: "Strong Boost",
                description: "Increase point gain by 50%.",
                cost: new Decimal(25),
                effect() { return new Decimal(1.5) },
                unlocked() { return hasUpgrade(this.layer,11) }
            }
        ,
            21: {
                title: "Precision Boost",
                description: "Further increase gain by 25%.",
                cost: new Decimal(100),
                unlocked() { return hasUpgrade(this.layer,12) }
            }
        },
        buyables: {
            11: {
                title: "Passive Module",
                cost(x=player[layerId].buyables[11]) { return new Decimal(5).times(Decimal.pow(2,x)) },
                effect(x=player[layerId].buyables[11]) { return new Decimal(1).plus(x.times(0.1)) },
                canAfford() { return canAffordPurchase(layerId, this, this.cost()) },
                buy() { run(this.pay, this) },
                pay() { player[layerId].buyables[11] = player[layerId].buyables[11].add(1); player[layerId].spentOnBuyables = player[layerId].spentOnBuyables.add(this.cost()) },
                unlocked() { return true }
            }
        },
        clickables: {
            11: {
                display() { return "Automation: " + (player[layerId].auto ? "ON" : "OFF") },
                canClick() { return true },
                onClick() { player[layerId].auto = !player[layerId].auto },
                unlocked() { return true }
            }
        },
        passiveGeneration() { return hasUpgrade(layerId,11) ? tmp[layerId].buyables[11].times(1).plus(1) : (player[layerId].buyables[11] ? player[layerId].buyables[11].times(0.1) : new Decimal(0)) },
        autoPrestige() { return hasUpgrade(layerId,12) || player[layerId].auto },
        automate() {
            const L = layerId
            if (!player[L].unlocked) return
            if (tmp[L].upgrades)
                for (let u in tmp[L].upgrades)
                    if (isPlainObject(tmp[L].upgrades[u]) && canAffordUpgrade(L,u) && !hasUpgrade(L,u)) buyUpg(L,u)
            if (tmp[L].buyables)
                for (let b in tmp[L].buyables)
                    if (tmp[L].buyables[b].canBuy) buyBuyable(L,b)
            if ((hasUpgrade(L,12) || player[L].auto) && tmp[L].canReset) doReset(L)
        },
        layerShown(){ return true }
    })
}

// Simple helper upgrades availability check uses existing functions in core game
