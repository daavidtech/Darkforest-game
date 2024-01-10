import { useParams } from "react-router-dom"
import "./building.css"
import { Tooltip } from "./tooltip"

export type BuildingDesc = {
	title: string
	img: string
	width: number
	height: number
	wood?: number
	iron?: number
	innovation?: number
	constructionTime: number
}

const buildings: BuildingDesc[] = [
	{
		title: "Clay House",
		img: "/savimaja.png",
		width: 1,
		height: 1,
		constructionTime: 120
	},
	{
		title: "Storage Pit",
		img: "/storagepit.png",
		width: 1,
		height: 1,
		constructionTime: 120
	},
	{
		title: "Farm",
		img: "/farm_1.png",
		width: 1,
		height: 1,
		constructionTime: 150
	},
	{
		title: "School",
		img: "/school.png",
		width: 2,
		height: 2,
		wood: 100,
		iron: 50,
		innovation: 10,
		constructionTime: 300
	},
	{
		title: "Barrack",
		img: "/barrack_1.png",
		width: 3,
		height: 2,
		wood: 100,
		iron: 50,
		innovation: 10,
		constructionTime: 1000
	}
]

const BuildingRow = (props: BuildingDesc & {
	onClick: () => void
}) => {
	const tooltip = `Time: ${props.constructionTime}s
${props.wood ? `Wood: ${props.wood}` : ""}
${props.iron ? `Iron: ${props.iron}` : ""}
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

export const BuildingPage = () => {
	const { buildingId } = useParams()

	return (
		<div>
			Building {buildingId}
		</div>
	)
}