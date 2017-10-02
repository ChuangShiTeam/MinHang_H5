import React from "react";
import {Router, Route, IndexRedirect} from "dva/router";
import Main from "./view/Main";
import Index00 from "./view/00/Index";
import Index01 from "./view/01/Index";
import Index02 from "./view/02/Index";

import constant from "./util/constant";

function RouterConfig({history}) {

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route component={Main}>
                    <Route path="/00/index" component={Index00}/>
                    <Route path="/01/index" component={Index01}/>
                    <Route path="/02/index" component={Index02}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
