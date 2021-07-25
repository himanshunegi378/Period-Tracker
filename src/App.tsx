import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { CalendarView } from "./views/calendar/Calendar.view";
import { Stats } from "./views/stats/Stats.view";

function App() {
    return (
        <div>
            <Switch>
                <Route path="/" exact>
                    <CalendarView />
                </Route>
                <Route path="/stats">
                    <Stats />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
