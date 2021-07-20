import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { CalendarView } from "./views/calendar/Calendar.view";

function App() {
    return (
        <div>
            <Switch>
                <Route path="/" exact>
                    <CalendarView />
                </Route>
            </Switch>
        </div>
    );
}

export default App;
