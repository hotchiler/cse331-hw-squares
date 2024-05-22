import React, { Component } from "react";
import { solid, split, Square } from './square';
import { FileEditor } from "./FileEditor";
import { FilePicker } from "./FilePicker";
import { listFiles, loadFile, saveFile } from './server';

/** Describes set of possible app page views */
type Page = 
  | { kind: "picker", loading: boolean }
  | { kind: "editor", name: string, loading: boolean };

/** Stores state for the current page of the app to show */
type AppState = {
  show: Page;
  designNames: string[];
  currentDesign?: Square;
};

/**
 * Displays the square application containing either a list of file names
 * to pick from or an editor for files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      show: { kind: "picker", loading: true },
      designNames: [],
      currentDesign: undefined
    };
  }

  componentDidMount = (): void => {
    this.doFetchDesignNamesResponse();
  }

  doFetchDesignNamesResponse = () : void => listFiles((names) => this.setState({ designNames: names, show: { kind: "picker", loading: false } }));

  render = (): JSX.Element => {
    const show = this.state.show;
    const designNames = this.state.designNames;

    if (show.loading) {
      return <div>Loading...</div>;
    }

    if (show.kind === "picker") {
      return <FilePicker onCreate={this.doHandleCreateClick} designNames={designNames} onOpen={this.doHandleOpenClick} />;
    } else if (show.kind === "editor") {
      return this.state.currentDesign ? (
        <FileEditor initialState={this.state.currentDesign} designName={show.name} onSave={this.doHandleSaveClick} onBack={this.doHandleBackClick} />
      ) : (
        <div>Loading...</div>
      );
    }

    return <div>Loading...</div>;
  };

  doHandleCreateClick = (name: string): void => {
    const initialSquare: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    this.setState({ show: { kind: "editor", name, loading: false }, currentDesign: initialSquare });
  };

  doHandleSaveClick = (name: string, root: Square): void => {
    this.setState({ show: { kind: "editor", name, loading: true } });
    // not simple function expression but unsure how else to express it
    saveFile(name, root, (_savedName, saved) => {if (saved) {this.doFetchDesignNamesResponse();}});};

  doHandleBackClick = (): void => {
    this.setState({ show: { kind: "picker", loading: true }, currentDesign: undefined });
    this.doFetchDesignNamesResponse();
  };

  doHandleOpenClick = (name: string): void => {
    this.setState({ show: { kind: "editor", name, loading: true } });
    // not simple function expression but unsure how else to express it
    loadFile(name, (loadedName, sq) => {
      if (sq) {
        this.setState({ currentDesign: sq, show: { kind: "editor", name: loadedName, loading: false } });
      } else {
        this.setState({ show: { kind: "picker", loading: false } });
      }
    });
  };
}
