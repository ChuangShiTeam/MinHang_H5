import dva from "dva";
import Router from "./router"
import "./view/Style.css";

const app = dva();

app.router(Router);

for (let i = 0; i < document.styleSheets.length; i++) {
    let rule = document.styleSheets[i].cssRules;
    for (let j = 0; j < rule.length; j++) {
        if (rule[j].selectorText === '.ant-modal-body') {
            rule[j].style.height = document.documentElement.clientHeight - 290 + 'px';
            break;
        }
    }
}

document.getElementById("loading").remove();

app.start('#root');