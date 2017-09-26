import React from "react";
import {Router, Route, IndexRedirect} from "dva/router";
import Main from "./view/Main";
import Index from "./view/Index";

import constant from "./util/constant";

function RouterConfig({history}) {

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route component={Main}>
                    <Route path="/index" component={Index}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
