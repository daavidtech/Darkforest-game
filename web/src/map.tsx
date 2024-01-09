
import { Fragment, useEffect, useRef, useState } from "react"
import { BuildingDesc, BuildingsList } from "./building"
import { Building, cache, notifyChanges, useCache } from "./cache"
import { DateTime } from "luxon" 
import { useNavigate } from "react-router-dom"

export const Map = (props: {
	current: BuildingDesc | undefined
	rowsCount: number
	columnsCount: number
	buildings: Building[]
	onBuildingSet: (p: any) => void
}) => {
	const navigate = useNavigate()

	const [currCord, setCurrCord] = useState<{ x: null | number, y: null | number}>({ x: null, y: null })

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

	let canset = true

	const onClick = (x: number, y: number) => {
		if (!canset) {
			return
		}

		if (!props.current) {
			const building = props.buildings.find(b => b.x <= x && x < b.x + b.width && b.y <= y && y < b.y + b.height)

			if (!building) {
				return
			}

			navigate(`/building/${building.buildingId}`)

			return
		}
		
		props.onBuildingSet({x, y})
	}

	for (let i = 0; i < props.rowsCount; i++) {
		const columns: any[] = []
		
		for (let j = 0; j < props.columnsCount; j++) {
			let backgroundColor = "white"
			const b = props.buildings.find(b => b.x <= j && j < b.x + b.width && b.y <= i && i < b.y + b.height)

			if (b) {
				backgroundColor = "lightgreen"
			}

			if (props.current) {
				const current = props.current

				const xActive = currCord.x != null && currCord.x <= j && j < currCord.x + current.width
				const yActive = currCord.y != null && currCord.y <= i && i < currCord.y + current.height

				if (xActive && yActive) {
					if (b) {
						backgroundColor = "red"
						canset = false
					} else {
						backgroundColor = "lightblue"
					}	
				}
			}

			columns.push(
			<div style={{ 
				height: "80px", 
				flexGrow: 1, 
				textAlign: "center",
				backgroundColor
			}}
			onClick={() => onClick(j, i)}>
				{i}:{j}
			</div>)
		}

		rows.push(<div style={{
			display: "flex",
			flexDirection: "row"
		}}>
			{columns}
		</div>)
	}

	return <div ref={ref} style={{width: props.columnsCount * 60 + "px", border: "solid 1px black" }}>
		{rows}
	</div>
}

export const MapPage = () => {
	const [current, setCurrent] = useState<BuildingDesc | undefined>(undefined)
	const { buildings, size } = useCache(m => {
		return {
			buildings: m.mapBuildings.get(1),
			size: m.mapSize
		}
	})

	return (
		<Fragment>
			<div style={{ display: "flex" }}>
				<BuildingsList onClick={d => { setCurrent(d) }} />
				<div>
					<input type="range" min={1} max={12} style={{ width: "300px" }}
						onChange={e => {
							cache.mapSize = parseInt(e.target.value)
							notifyChanges()
						}} value={size} />
					<Map
						current={current}
						rowsCount={size}
						columnsCount={size}
						onBuildingSet={(p) => {
							const map = cache.mapBuildings.get(1)

							if (!map) {
								return
							}

							if (!current) {
								return
							}

							map.push({
								buildingId: cache.newBuildingId++,
								x: p.x,
								y: p.y,
								width: current.width,
								height: current.height,
								contructionDoneAt: DateTime.now().plus({ minutes: 30 }).toJSDate(),
								level: 1
							})

							setCurrent(undefined)
						}}
						buildings={buildings}
					/>
				</div>
			</div>
			
		</Fragment>
	)
}