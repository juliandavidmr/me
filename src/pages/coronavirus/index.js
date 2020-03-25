import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import './styles.css';
import { LineChart, XAxis, Line, YAxis, Tooltip } from "recharts";

const IndexPage = () => {
	// Client-side Runtime Data Fetching
	const [comfirmed, setConfirmed] = useState(0)
	const [recovered, setRecovered] = useState(0)
	const [deaths, setDeaths] = useState(0)
	const [date, setDate] = useState(0)
	const [data, setData] = useState(0)

	useEffect(() => {
		// get data from GitHub api
		fetch(`https://pomber.github.io/covid19/timeseries.json`)
			.then(response => response.json()) // parse JSON from request
			.then(resultData => {
				// set data for the number of stars
				const countryData = resultData["Colombia"].filter(r => r.confirmed > 0);

				const lastResult = countryData[countryData.length - 1];
				const { date, confirmed, recovered, deaths } = lastResult;

				setData(countryData);
				setConfirmed(confirmed);
				setRecovered(recovered);
				setDeaths(deaths);
				setDate(date);
			})
	}, [])

	return (
		<Layout key={recovered}>
			<div className="coronavirus">
				<h3>COVID-19 Coronavirus Statistics</h3>
				<section>
					<h4>Colombia</h4>

					<LineChart width={600} height={300} data={data}>
						<XAxis dataKey="x" />
						<YAxis />
						<Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
						<Line type="monotone" dataKey="deaths" stroke="#bb0a1e" />
						<Line type="monotone" dataKey="recovered" stroke="#82ca9d" />
						<Tooltip />
					</LineChart>

					<p><strong>Confirmed:</strong> {comfirmed}</p>
					<p><strong>Recovered:</strong> {recovered}</p>
					<p><strong>Deaths:</strong> {deaths}</p>
				</section>
				<br />
				<p><i><small>Updated at {date}</small></i></p>
				<br />
				<br />
				<small><i>Powered by <a href="https://github.com/pomber/covid19" rel="noopener noreferrer">Covid19 Repository</a></i></small>
				<br />
				<br />
			</div>
		</Layout>
	)
}
export default IndexPage