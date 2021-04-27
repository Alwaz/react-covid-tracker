import "./App.css";
import Map from "./Map";
import Infobox from "./Infobox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { Card, CardContent } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setZoomCenter] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCaseType] = useState("cases");

  // fetching  worldwide data here
  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //fetching countries data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //country name
            value: country.countryInfo.iso2, // UK,USA
          }));
          setCountries(countries);
          setMapCountries(data);
          setTableData(data);
        });
    };

    getCountriesData();
  }, []);

  const onChangeCountry = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // this will diaplay whatever country is selected.
        setCountry(countryCode);
        // this will store the whole data
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setZoomCenter(3);
      });
    console.log("worlwide info", countryInfo);
  };

  return (
    <div className="app">
      <div className="app_left">
        {/* header */}
        {/* Title + select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            {/*bem naming convention*/}
            <Select
              variant="outlined"
              value={country}
              onChange={onChangeCountry}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* Rendering Info Boxes here */}

        <div className="app__stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCaseType("cases")}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            title="Coronavirus Cases"
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            title="Recovered"
          />
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            title="Death"
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>{" "}
      {/*end of app left*/}
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by Country</h3>
        </CardContent>

        {/* Table */}
        <CardContent>
          <Table countries={tableData}></Table>

          <h3>World Wide {casesType}</h3>

          {/* Graph */}
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
