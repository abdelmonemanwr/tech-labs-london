import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Calculator from "./Calculator";

export class CalculatorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private container: HTMLDivElement;
  private value: number = 0;
  private root: ReactDOM.Root | null = null; // Declare root

  constructor() {}

  init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.container = container;

    if (!this.root) {
      this.root = ReactDOM.createRoot(this.container);
    }

    this.render();
  }

  // Method that gets called when the result changes in the Calculator
  private onResultChange = (value: number) => {
    this.value = value;
    this.notifyOutputChanged(); // Notify the system about the updated result
  };

  // Renders the Calculator component
  private render(): void {
    if (this.root) {
      this.root.render(
        React.createElement(Calculator, {
          onResultChange: this.onResultChange,
        })
      );
    } else {
      console.error("Root not initialized properly.");
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    if (this.value !== null && this.value !== undefined) {
      this.notifyOutputChanged();
      this.render();
    }
  }

  // Return the outputs to the parent (PowerApps)
  getOutputs(): IOutputs {
    return {
      value: this.value,
    };
  }

  // Clean up when the control is destroyed
  destroy(): void {
    if (this.root) {
      this.root.unmount();
    }
  }
}
