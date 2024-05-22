import React, { Component, ChangeEvent, MouseEvent } from "react";

type FilePickerProps = {
  onCreate: (name: string) => void;
  onOpen: (name: string) => void;
  designNames: string[];
};

type FilePickerState = {
  name: string;  // text in the name text box
};

/** Displays the list of created design files. */
export class FilePicker extends Component<FilePickerProps, FilePickerState> {

  constructor(props: FilePickerProps) {
    super(props);
    this.state = { name: '' };
  }

  render = (): JSX.Element => {
    const designNames = this.props.designNames;

    return (
      <div>
        <h3>Create a New Design</h3>
        <input 
          type="text" 
          value={this.state.name} 
          onChange={this.doNameChange} 
          placeholder="Enter design name" 
        />
        <button onClick={this.doCreateClick}>Create</button>
        <h3>Existing Designs</h3>
        <ul>
          {designNames.map(name => (<li key={name}><a href="#" onClick={() => this.props.onOpen(name)}>{name}</a></li>))}
        </ul>
      </div>
    );
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ name: evt.target.value });
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onCreate(this.state.name);
  };
}
