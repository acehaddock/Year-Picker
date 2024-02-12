import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class YearPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _input: HTMLInputElement;
	private _value: Date | undefined;
	private _notifyOutputChanged: () => void;
	private _refreshData: EventListenerOrEventListenerObject;
	private _updateValue: () => void;

    /**
     * Empty constructor.
     */
        constructor()
        {
            var style = document.createElement("style");

            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(".YearPicker input[type=\"number\"] { /* your styles here */ }"));
            style.appendChild(document.createTextNode(".YearPicker input[type=\"number\"]:hover { /* your styles here */ }"));

            if (document.head) {
                document.head.appendChild(style);
            } else {
                document.addEventListener("DOMContentLoaded", function() {
                    if (document.head) {
                        document.head.appendChild(style);
                    }
                });
            }
        }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
        public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, container: HTMLDivElement): void
        {
            // Add control initialization code
            //this._value = context.parameters.value?.raw;
            this._value = context.parameters.value?.raw ?? undefined;

            this._notifyOutputChanged = notifyOutputChanged;
            this._refreshData = this.refreshData.bind(this);
            this._updateValue = this.updateValue.bind(this);
            
            this._input = document.createElement("input")
            this._input.setAttribute("type", "number");
            this._input.addEventListener("input", this._refreshData);
            
            container.appendChild(this._input);
        }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        //this._value = context.parameters.value.raw;
        this._value = context.parameters.value?.raw ?? undefined;
        this._updateValue();
    }
    private updateValue() {
		if (this._value === undefined) {
			this._input.setAttribute("value","");
			return;
		}

		this._input.setAttribute("value", this._value.getFullYear().toString());
	}

	private refreshData(evt: Event) {
		if (this._input.value === "" || 
			this._input.value === null ||
			this._input.value === undefined) {
			this._value = undefined;
			this._updateValue();
			this._notifyOutputChanged();
			return;
		}

		let rawNumber = (this._input.value as any) as number;
		if (rawNumber < 1000) return;

		let newValue = new Date(rawNumber,0);
		if (newValue < new Date(1753,0)) {
			alert("Minimum year in CDS is 1753");
			this._updateValue();
			return;
		}

		this._value = newValue;
		this._notifyOutputChanged();
	}
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {value: this._value};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
