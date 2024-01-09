
import React, { Fragment, useEffect, useRef, useState } from "react"
import { BuildingDesc, BuildingsList } from "./building"

export const Map = (props: {
	current: BuildingDesc | undefined
	rowsCount: number
	columnsCount: number
	buildings: any[]
	activeBuilding: any[]
	onBuildingSet: (p: any) => void
}) => {
	const [currCord, setCurrCord] = useState<
	{ x: null | number, y: null | number}>({ x: null, y: null })

	const ref = useRef<HTMLDivElement>()

	useEffect(() => {
		const left = ref.current?.offsetLeft ?? 0
		const top = ref.current?.offsetTop ?? 0

		function onMouseMove(e: MouseEvent) {
			const clientX = e.clientX
			const clientY = e.clientY

			const containerX = clientX - left
			const containerY = clientY - top

			const containerWidth = ref.current?.clientWidth ?? 0
			const containerHeight = ref.current?.clientHeight ?? 0

			let x = null
			let y = null

			if (containerX > 0 && containerX < containerWidth) {
				const oneWidth = containerWidth / props.columnsCount
				x = Math.floor(containerX / oneWidth)
			}

			if (containerY > 0 && containerY < containerHeight) {
				const oneHeight = containerHeight / props.rowsCount
				y = Math.floor(containerY / oneHeight)
			}

			
			if (currCord.x !== x || currCord.y !== y) {
				console.log("mouse x: ",x, "mouse y:", y)
				setCurrCord({
					x: x,
					y: y
				})
			}
		}

		window.addEventListener("mousemove", onMouseMove)

		return () => {
			window.removeEventListener("mousemove", onMouseMove)
		}
	}, [currCord, props.columnsCount, props.rowsCount, ref])

	const rows = []

	for (let i = 0; i < props.rowsCount; i++) {
		const columns: any[] = []
		
		for (let j = 0; j < props.columnsCount; j++) {
			const xActive = props.current ? currCord.x !== null && currCord.x >= j && currCord.x < j + props.current.width : undefined
			const yActive = props.current ? currCord.y !== null && currCord.y >= i && currCord.y < i + props.current.height : undefined

			columns.push(
			<div style={{ 
				height: "80px", 
				flexGrow: 1, 
				textAlign: "center",
				backgroundColor: xActive && yActive ? "lightblue" : "white"
			}}
			onClick={() => {
				props.onBuildingSet({
					x: j,
					y: i
				})
			}}
			>{i}:{j}</div>)
		}

		rows.push(<div style={{
			display: "flex",
			flexDirection: "row"
		}}>
			{columns}
		</div>)
	}

	return <div ref={ref} style={{width: "300px", border: "solid 1px black" }}>
		{rows}
	</div>
}

export const MapPage = () => {
	const [current, setCurrent] = useState<BuildingDesc | undefined>(undefined)
	const [buildings, setBuildings] = useState([])

	return (
		<Fragment>
			<div style={{ display: "flex" }}>
				<BuildingsList onClick={d => {
					console.log("set current: ", d)
					setCurrent(d)
				}} />
				<div>
					<Map
						current={current}
						rowsCount={5}
						columnsCount={5}
						onBuildingSet={(p) => {
							setCurrent(p)
						}}
						activeBuilding={[]}
						buildings={[]}
					/>
				</div>
			</div>
			
		</Fragment>
	)
}