import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MapPage } from './map.tsx';
import { SiginPage } from './signin.tsx';
import { RegisterPage } from './register.tsx';
import { Navbar } from './navbar.tsx';
import { ResourcesPage } from './resources.tsx';
import { BuildingPage } from './building.tsx';
import { startProduction } from './production.ts';

startProduction()

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div className="background">
				<Navbar />
				<Outlet />
			</div>
		),
		children: [
			{
				path: "/",
				element: <div>Darkforest</div>
			},
			{
				path: "/home",
				element: <div>Home</div>
			},
			{
				path: "/map",
				element: <MapPage />
			},
			{
				path: "/signin",
				element: <SiginPage />
			},
			{
				path: "/register",
				element: <RegisterPage />
			},
			{
				path: "/resources",
				element: <ResourcesPage />
			},
			{
				path: "/building/:buildingId",
				element: <BuildingPage />
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
