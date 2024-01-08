
import React, { Fragment, useEffect, useRef, useState } from "react"

export const Map = (prosps: {
	active: boolean
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
				const oneWidth = containerWidth / prosps.columnsCount
				x = Math.floor(containerX / oneWidth)
			}

			if (containerY > 0 && containerY < containerHeight) {
				const oneHeight = containerHeight / prosps.rowsCount
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
	}, [currCord, prosps.columnsCount, prosps.rowsCount, ref])

	const rows = []

	for (let i = 0; i < prosps.rowsCount; i++) {
		const columns: any[] = []
		
		for (let j = 0; j < prosps.columnsCount; j++) {
			columns.push(
			<div style={{ 
				height: "80px", 
				flexGrow: 1, 
				textAlign: "center",
				backgroundColor: prosps.active && currCord.x === j && currCord.y == i ? "lightblue" : "white"
			}}
			onClick={() => {
				prosps.onBuildingSet({
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
	const [active, setActive] = useState(false)
	const [buildings, setBuildings] = useState([])

	return (
		<Fragment>
			<button onClick={() => setActive(!active)}>
				Rakennus
			</button>
			<Map
				active={active}
				rowsCount={5}
				columnsCount={5}
				onBuildingSet={(p) => {
					// DO something
				}}
				activeBuilding={[]}
				buildings={[]}
			/>
		</Fragment>
	)
}