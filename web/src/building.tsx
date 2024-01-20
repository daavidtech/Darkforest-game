import { useParams } from "react-router-dom"
import "./building.css"
import { Tooltip } from "./tooltip"

export type BuildingType = "clayhouse" |
	"storagepit" |
	"farm" |
	"school" |
	"barrack" |
	"ironmine" |
	"woodcutter"

export type BuildingDesc = {
	title: string
	type: BuildingType
	img: string
	width: number
	height: number
	woodCost?: number
	ironCost?: number
	clayCost?: number
	woodProduction?: number
	ironProduction?: number
	innovation?: number
	constructionTime: number
	grainProduction?: number
}

const buildings: BuildingDesc[] = [
	{
		title: "Clay House",
		type: "clayhouse",
		img: "/savimaja.png",
		width: 1,
		height: 1,
		constructionTime: 120
	},
	{
		title: "Storage Pit",
		type: "storagepit",
		img: "/storagepit.png",
		width: 1,
		height: 1,
		constructionTime: 120
	},
	{
		title: "Farm",
		type: "farm",
		img: "/farm_1.png",
		width: 1,
		height: 1,
		constructionTime: 150,
		grainProduction: 60
	},
	{
		title: "School",
		type: "school",
		img: "/school.png",
		width: 2,
		height: 2,
		woodCost: 100,
		ironCost: 50,
		innovation: 10,
		constructionTime: 300
	},
	{
		title: "Barrack",
		type: "barrack",
		img: "/barrack_1.png",
		width: 3,
		height: 2,
		woodCost: 100,
		ironCost: 50,
		innovation: 10,
		constructionTime: 1000
	},
	{
		title: "Iron Mine",
		type: "ironmine",
		img: "/ironmine.png",
		width: 4,
		height: 4,
		constructionTime: 1000,
		ironProduction: 10
	},
	{
		title: "Woodcutter",
		type: "woodcutter",
		img: "/woodcut.png",
		width: 3,
		height: 2,
		constructionTime: 200,
		woodProduction: 5
	}
]

const BuildingRow = (props: BuildingDesc & {
	onClick: () => void
}) => {
	const tooltip = `Time: ${props.constructionTime}s
${props.woodCost ? `Wood: ${props.woodCost}` : ""}
${props.ironCost ? `Iron: ${props.ironCost}` : ""}
${props.innovation ? `Innovation: ${props.innovation}` : ""}`

	return (
		<div
			draggable={true}
			className="buildingRow"
			onClick={props.onClick}
			style={{ display: "flex", flexDirection: "column", border: "1px solid black" }}>
			<Tooltip text={tooltip}>
				<div style={{ display: "flex", flexDirection: "column" }}>
					{props.title}
					<img src={props.img} width={100} />
					{`${props.width}x${props.height}`}
				</div>
			</Tooltip>
		</div>
	)
}

export const BuildingsList = (props: {
	onClick: (building: BuildingDesc) => void
}) => {
	return (
		<div style={{ backgroundColor: "white" }}>
			{buildings.map((b) => {
				return <BuildingRow {...b} onClick={() => props.onClick(b)} />
			})}
		</div>
	)
}

const BuildingUnitRow = (props: {
	name: string
	currentCount: number
	maxCount: number
	woodCost: number
	ironCost: number
}) => {
	return (
		<div style={{ display: "flex" }}>
			<div>
				<div>
					{props.name}
				</div>
				<div style={{ display: "flex" }}>
					<div>Wood: {props.woodCost}</div>
					<div>Iron: {props.ironCost}</div>
				</div>
			</div>
			<div>
				<input type="text" />
			</div>
			<div>
				<button>{props.maxCount}</button>
			</div>
		</div>
	)
}

export const BuildingPage = () => {
	const { buildingId } = useParams()

	return (
		<div style={{ backgroundColor: "white", maxWidth: "800px" }}>
			<h2>Units</h2>
			<BuildingUnitRow name="Spearman" currentCount={0} woodCost={10} ironCost={5} maxCount={500} />
			<BuildingUnitRow name="Archer" currentCount={0} woodCost={10} ironCost={5} maxCount={256} />
			<button>Train</button>
		</div>
	)
}