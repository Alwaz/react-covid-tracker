import React from "react";
import { Map as Leaflet, TileLayer } from "react-leaflet";
import "./map.css";
import { showData } from "./util";

const Map = ({ countries, center, zoom, casesType }) => {
  return (
    <div className="map">
      <Leaflet center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {showData(countries, casesType)}
      </Leaflet>
    </div>
  );
};

export default Map;
