// @flow
import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";

import Home from "../Home";
import Set from "../Set";
import NewSet from "../NewSet";
import NewFlashcard from "../NewFlashcard";
import EditFlashcard from "../EditFlashcard";
import PracticeFlashcard from "../PracticeFlashcard";
import "./styles.css";

class App extends React.Component<{}> {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <div className="App">
          <Paper className="wrapper" elevation={24}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/sets/new" component={NewSet} />
              <Route exact path="/sets/:setId" component={Set} />
              <Route
                exact
                path="/sets/:setId/flashcards/new"
                component={NewFlashcard}
              />
              <Route
                exact
                path="/sets/:setId/flashcards/:flashcardId/practice"
                component={PracticeFlashcard}
              />
              <Route
                exact
                path="/sets/:setId/flashcards/:flashcardId/edit"
                component={EditFlashcard}
              />
              <Redirect to="/" />
            </Switch>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
