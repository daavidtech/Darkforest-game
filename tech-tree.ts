
export type TechTreeItem = {
    requirements: string[]
}

export const techTreeMap = {
    "fire": {
        requirements: []
    },
    "iron": {
        requirements: []
    },
    "ironAxe": {
        requirements: ["iron"]
    },
    "nuclearFission": {
        requirements: []
    },
    "semiconductor": {
        requirements: []
    },
    "computer": {
        requirements: []
    },
    "missile": {
        requirements: ["computer"]
    },
    "tank": {
        requirement: ["factory", "iron"]
    }
}