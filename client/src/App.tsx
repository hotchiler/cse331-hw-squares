import React, { Component } from "react";
import { solid, split, Square } from './square';
import { FileEditor } from "./FileEditor";
import { FilePicker } from "./FilePicker";
import { nil, cons, compact_list } from "./list";
import { AssocList, contains_key, get_keys, get_value } from "./assoc";

/** Describes set of possible app page views */
type Page = 
  | { kind: "picker" }
  | { kind: "editor", name: string };

/** Stores state for the current page of the app to show */
type AppState = {
  show: Page;
  designs: AssocList<Square>; // Stores the designs
};

/**
 * Displays the square application containing either a list of file names
 * to pick from or an editor for files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      show: { kind: "picker" },
      designs: nil
    };
  }
  
  render = (): JSX.Element => {
    const show = this.state.show;
    const designs = this.state.designs;


    if (show.kind === "picker") {
      const designNames = compact_list(get_keys(designs));
      return <FilePicker onCreate={this.doHandleCreateClick} designNames={designNames} onOpen={this.doHandleOpenClick} />;
    } else if (show.kind === "editor") {
      const initialSquare: Square = contains_key(show.name, designs)
        ? get_value(show.name, designs)
        : split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
      return <FileEditor initialState={initialSquare} designName={show.name} onSave={this.doHandleSaveClick} onBack={this.doHandleBackClick} />;
    }
    return <div>Loading...</div>;
  };

  doHandleCreateClick = (name: string): void => {
    this.setState({ show: { kind: "editor", name } });
  };

  doHandleSaveClick = (name: string, root: Square): void => {
    this.setState(prevState => ({ designs: cons([name, root], prevState.designs), show: { kind: "picker" }}));
    console.log(`Saved design: ${name}`, root);
  };

  doHandleBackClick = (): void => {
    this.setState({ show: { kind: "picker" } });
  };

  doHandleOpenClick = (name: string): void => {
    this.setState({ show: { kind: "editor", name } });
  };
}
