import React from "react";
import "./infoBox.css";
import { CardContent, Card, Typography } from "@material-ui/core";

const Infobox = ({ isRed, title, cases, active, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && `infoBox--selected`} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        {/* Tile */}
        <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

        {/* cases */}
        <h2 className="infoBox__cases">{cases}</h2>

        {/* totle case */}
        <Typography classname="infoBox__total" color="textSecondary">{total} Total</Typography>
        
      </CardContent>
    </Card>
  );
};

export default Infobox;
