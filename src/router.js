import React from "react";
import {Router, Route, IndexRedirect} from "dva/router";
import Main from "./view/Main";
import Index00 from "./view/00/Index";

import constant from "./util/constant";

function RouterConfig({history}) {

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route component={Main}>
                    <Route path="/00/index" component={Index00}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
