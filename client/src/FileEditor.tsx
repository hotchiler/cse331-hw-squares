import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, getSubtree, split, solid, Color, setSubtree } from './square';
import { SquareElem } from "./square_draw";
import { prefix, len } from "./list";

type FileEditorProps = {
  /** Initial state of the file. */
  initialState: Square;

  /** Name of the design */
  designName: string;

  /** Called to ask parent to save file contents in server. */
  onSave: (name: string, root: Square) => void;
  onBack: () => void;
  // TODO: may want to add more props
};

type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};

/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);
    this.state = { root: props.initialState };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <SquareElem width={600n} height={600n}
          square={this.state.root} selected={this.state.selected}
          onClick={this.doSquareClick} />
        <div>
          <button onClick={this.doSplitClick}>Split</button>
          <button onClick={this.doMergeClick}>Merge</button>
          <select onChange={this.doColorChange}>
            <option value="white">White</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
          <button onClick={this.doHandleSaveClick}>Save</button>
          <button onClick={this.doHandleBackClick}>Back</button>
        </div>
      </div>
    );
  };

  doSquareClick = (path: Path): void => {
    this.setState({ selected: path });
  };

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.selected === undefined) {
      return;
    }

    const selectedSquare = getSubtree(this.state.root, this.state.selected);

    this.setState({
      root: setSubtree(this.state.root, this.state.selected,
        split(selectedSquare, selectedSquare, selectedSquare, selectedSquare)),
      selected: undefined
    });
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.selected === undefined) {
      return;
    }

    const selectedSquare = getSubtree(this.state.root, this.state.selected);
    const parentPath = prefix(len(this.state.selected) - 1n, this.state.selected);

    if (selectedSquare.kind === "split") {
      return;
    }

    this.setState({
      root: setSubtree(this.state.root, parentPath, solid(selectedSquare.color)),
      selected: undefined
    });
  };

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    const selected = this.state.selected;
    const root = this.state.root;
    if (!selected) {
      return;
    }

    const colorValue = evt.target.value;

    if (isValidColor(colorValue)) {
      const newSquare = solid(colorValue);
      const newRoot = setSubtree(root, selected, newSquare);
      this.setState({ root: newRoot, selected: undefined });
    }
  };

  doHandleSaveClick = (): void => {
    const root = this.state.root;
    const onSave = this.props.onSave;
    const designName = this.props.designName;
    onSave(designName, root);
  };

  doHandleBackClick = (): void => {
    this.props.onBack();
  };
  
}

const isValidColor = (color: any): color is Color => {
  const validColors: Color[] = ["white", "red", "orange", "yellow", "green", "blue", "purple"];
  return validColors.includes(color);
};
