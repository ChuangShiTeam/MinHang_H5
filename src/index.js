import dva from "dva";
import Router from "./router"
import "./view/Style.css";

const app = dva();

app.router(Router);

document.getElementById("loading").remove();

app.start('#root');