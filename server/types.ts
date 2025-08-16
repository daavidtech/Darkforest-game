
export class Player {

}

export class StatsChange {
    public stat: string
    public amount: number
    public interval?: number // in milliseconds if none is provided it is a one-time change
}

export type Effect = StatsChange

export type Entity = {
    id: string
    type: string
    effects: Effect[]
}

export class Sequence {
    actions: Action[]
}

export enum Operator {

}

export class Condition {
    left: Action
    right: Action
    operator: Operator
    action: Action
}

export type Action = Sequence | Condition

export class TimedAction {
    public time: number
    public action: Action
}