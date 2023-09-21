import React, { useCallback, useEffect, useState } from 'react';
import './Select.scss';
import ReactSelect, { SelectComponentsConfig, StylesConfig } from 'react-select';
import { ActionMeta, OptionsType, Theme, ValueType } from 'react-select/src/types';
import Box from '../box/Box';
import clone from 'lodash.clone';
import { RsFormControl } from '../../form/FormControl';
import Creatable from 'react-select/creatable';

type MakeAllNever<T extends Object> = { [K in keyof T]: never };
export type OptionType<V = string | number, L = string | number> = {
	value: V;
	label: L;
};

export type GroupType = {
	label: string;
	options: OptionType[];
};

export type IsMulti = boolean | false;
export type ReactSelectProps = ReactSelect['props'];
export type ReactCreatableProps = Creatable<OptionType, IsMulti>['props'];

type ConditionalCreatableProps =
	| ({
			isCreatable: true;
	  } & SelectCreatableProps)
	| ({
			isCreatable?: false;
	  } & MakeAllNever<SelectCreatableProps>);

/** NOTE: `SelectShared` is a Type not a Interface */
export type SelectSharedProps = {
	/** ~~~~~~ Required Props ~~~~~~*/

	control: RsFormControl;
	/** Array of options that populate the Select menu */
	options: OptionType[] | GroupType[];

	/** ~~~~~~ RsForm Control Props ~~~~~~*/

	/** Control value is based on the options value prop */
	updateControl?: (control: RsFormControl) => void;
	onRsFormChange?: (event: ValueType<OptionType, IsMulti>, control: RsFormControl) => void;

	/** ~~~~~~ Custom Props ~~~~~~ */

	/** The theme to use for the Select */
	theme?: 'none' | 'rsInput';
	/** Handle what happens when the clear button is pressed */
	onFormClear?: () => void;

	/** ~~~~~~ Container Optional Props ~~~~~~*/

	/** The id to set on the SelectContainer component */
	id?: string;
	/** className attribute applied to the SelectContainer component */
	className?: string;
	/** Width of the SelectContainer component */
	width?: string | number;

	/** ~~~~~~ Select Optional Props ~~~~~~ */

	/** Close the Select menu when the user selects an option */
	closeMenuOnSelect?: ReactSelectProps['closeMenuOnSelect'];
	/** Is the Select value clearable */
	isClearable?: ReactSelectProps['isClearable'];
	/** Is the Select disabled */
	isDisabled?: ReactSelectProps['isDisabled'];
	/** Is the Select in a state of loading (async) */
	isLoading?: ReactSelectProps['isLoading'];
	/** Support multiple selected options */
	isMulti?: boolean; // NOTE: This is specifically set to boolean because react-selects type is badily typed
	/** Complex object used to override the looks and functionality of the selected options inside the input section */
	components?: SelectComponentsConfig<OptionType, IsMulti>; // NOTE: This isn't ReactSelectProps['components'] because is creatable is conditionally added
	/** Is the Select direction right-to-left */
	isRtl?: ReactSelectProps['isRtl'];
	/** Whether to enable search functionality */
	isSearchable?: ReactSelectProps['isSearchable'];
	/** Async: Text to display when loading options */
	loadingMessage?: ReactSelectProps['loadingMessage'];
	/** Minimum height of the menu before flipping */
	minMenuHeight?: ReactSelectProps['minMenuHeight'];
	/** Maximum height of the menu before scrolling */
	maxMenuHeight?: ReactSelectProps['maxMenuHeight'];
	/** Whether the menu is open */
	menuIsOpen?: ReactSelectProps['menuIsOpen'];
	/** Default placement of the menu in relation to the control. 'auto' will flip
	 * when there isn't enough space below the control. */
	menuPlacement?: ReactSelectProps['menuPlacement'];
	/** The CSS position value of the menu, when "fixed" extra layout management is required */
	menuPosition?: ReactSelectProps['menuPosition'];
	/** Text to display when there are no options */
	noOptionsMessage?: ReactSelectProps['noOptionsMessage'];
	/** Handle blur events on the control */
	onBlur?: ReactSelectProps['onBlur'];
	/** Handle focus events on the control */
	onFocus?: ReactSelectProps['onFocus'];
	/** Handle change events on the input */
	onInputChange?: ReactSelectProps['onInputChange'];
	/** Handle the menu opening */
	onMenuOpen?: ReactSelectProps['onMenuOpen'];
	/** Handle the menu closing */
	onMenuClose?: ReactSelectProps['onMenuClose'];
	/** Allows control of whether the menu is opened when the Select is focused */
	openMenuOnFocus?: ReactSelectProps['openMenuOnFocus'];
	/** Allows control of whether the menu is opened when the Select is clicked */
	openMenuOnClick?: ReactSelectProps['openMenuOnClick'];
	/** Number of options to jump in menu when page{up|down} keys are used */
	pageSize?: ReactSelectProps['pageSize'];
	/** Placeholder text for the Select value */
	placeholder?: ReactSelectProps['placeholder'];
	/** Style modifier methods */
	styles?: StylesConfig<OptionType, IsMulti>;
	/** Sets the tabIndex attribute on the input */
	tabIndex?: ReactSelectProps['tabIndex'];
	/** Select the currently focused option when the user presses tab */
	tabSelectsValue?: ReactSelectProps['tabSelectsValue'];
};

/** NOTE: `SelectCreatableProps` is an Type not a Interface */
export type SelectCreatableProps = {
	/** Allow options to be created while the `isLoading` prop is true. Useful to
	 * prevent the "create new ..." option being displayed while async results are
	 * still being loaded. */
	allowCreateWhileLoading?: ReactCreatableProps['allowCreateWhileLoading'];
	/** Sets the position of the createOption element in your options list. Defaults to 'last' */
	createOptionPosition?: ReactCreatableProps['createOptionPosition'];
	/** If provided, this will be called with the input value when a new option is
	 * created, and `onChange` will **not** be called. Use this when you need more
	 * control over what happens when new options are created. */
	onCreateOption?: ReactCreatableProps['onCreateOption'];
	/** Gets the label for the "create new ..." option in the menu. Is given the
	 * current input value. */
	formatCreateLabel?: ReactCreatableProps['formatCreateLabel'];
	/** Determines whether the "create new ..." option should be displayed based on
	 * the current input value, select value and options array. */
	isValidNewOption?: ReactCreatableProps['isValidNewOption'];
	/** Returns the data for the new option when it is created. Used to display the
	 * value, and is passed to `onChange`. */
	getNewOptionData?: ReactCreatableProps['getNewOptionData'];
};

/** NOTE: `SelectProps` is a Type not a Interface */
export type SelectProps = SelectSharedProps & ConditionalCreatableProps;

const Select: React.FC<SelectProps> = (props) => {
	const {
		control,
		updateControl,
		onRsFormChange,
		theme,
		onFormClear,
		id,
		className,
		width,
		isCreatable,
		...selectProps
	} = props;
	const { styles, options, isMulti } = selectProps;

	const [controlState, setControl] = useState(control);
	const [value, setValue] = useState<ValueType<OptionType, IsMulti>>();

	const createOptionArray = React.useCallback((options: OptionType[] | GroupType[]): OptionType[] => {
		let newOptionsArray: OptionType[] = [];
		if (isGroupOption(options)) {
			options.forEach((item) => {
				newOptionsArray = [...newOptionsArray, ...item.options];
			});
		} else {
			newOptionsArray = options;
		}
		return newOptionsArray;
	}, []);

	useEffect(() => {
		setControl(control);

		if (!Array.isArray(options) || options.length === 0) return;

		if (control.value.toString().length > 0) {
			const controlValue = control.value;
			const newOptionsArray = createOptionArray(options);

			if (typeof controlValue === 'number' || typeof controlValue === 'string') {
				setValue(newOptionsArray.filter((item) => item.value === control.value));
			} else if (Array.isArray(controlValue)) {
				let defaultOptions: OptionType[] = [];
				controlValue.forEach((item: string | number) => {
					const filteredOptions = newOptionsArray.filter((option) => item === option.value);
					defaultOptions = [...defaultOptions, ...filteredOptions];
				});
				setValue(defaultOptions);
			}
		}
	}, [control, options, createOptionArray]);

	const hasError = React.useMemo(() => {
		return controlState?.errors.length > 0;
	}, [controlState]);

	const computedClassName = React.useMemo(() => {
		let computedClassName = 'rsSelect';
		if (theme && theme !== 'none') computedClassName += ` theme-${theme}`;
		if (hasError) computedClassName += ` error`;
		if (className) computedClassName += ` ${className}`;
		return computedClassName;
	}, [theme, hasError, className]);

	function isGroupOption(options: OptionType[] | GroupType[]): options is GroupType[] {
		return options[0].hasOwnProperty('options');
	}

	useEffect(() => {
		const controlElement = document.querySelector("[class*='control']"); //control
		const placeholderElement = document.querySelector(".rsSelect [class*='placeholder']"); //placeholder
		if (!controlElement || !placeholderElement) return;

		if (hasError) {
			controlElement.classList.add('error');
			placeholderElement.classList.add('error');
		} else {
			controlElement.classList.remove('error');
			placeholderElement.classList.remove('error');
		}
	}, [hasError]);

	async function handleChange(value: OptionsType<OptionType> | OptionType | null, action: ActionMeta<OptionType>) {
		let target: string | number | string[] | number[] = '';

		if (Array.isArray(value)) {
			target = value.map((item) => item.value);
			if (target.length === 0) target = isMulti ? [] : '';
		} else if (value === null) {
			target = isMulti ? [] : '';
		} else if ('value' in value) {
			target = value.value;
		}

		setValue(value);
		if (action.action === 'clear' && onFormClear) onFormClear();

		const updated = clone(control);
		if (updated) {
			updated.value = target;
			if (updated.value.toString().length === 0) {
				updated.clearErrors();
			} else {
				await updated.validate();
			}

			setControl(updated);
			if (updateControl) updateControl(updated);
		}
		if (onRsFormChange) onRsFormChange(value, updated);
	}

	function renderErrors() {
		const errorNodes: React.ReactNode[] = [];
		const errors = controlState.errors;
		for (let index = 0; index < errors.length; index++) {
			const errorMessage = controlState.getErrorMessage(errors[index]);
			errorNodes.push(
				<div key={`${index}Error`} className="rsInputErrorMessage">
					{errorMessage}
				</div>
			);
		}
		return errorNodes;
	}

	function renderStyles() {
		if (!width) return;
		let mutableWidth = width;
		if (typeof width === 'number') mutableWidth += 'px';

		return { width: mutableWidth };
	}

	const generateSelectTheme = useCallback(
		(providedTheme: Theme) => {
			const rsInputTheme: Theme = {
				...providedTheme,
				colors: {
					...providedTheme.colors,
					primary25: '#cecece',
					primary: '#856eaf'
				},
				borderRadius: 0
			};

			switch (theme) {
				case 'none':
					return providedTheme;
				case 'rsInput':
					return rsInputTheme;
				default:
					return providedTheme;
			}
		},
		[theme]
	);

	const generateSelectStyles = useCallback(() => {
		const rsInputStyles: StylesConfig<OptionType, IsMulti> = {
			...styles,
			control: (providedStyle) => ({
				...providedStyle,
				minHeight: '30px'
			}),
			option: (providedStyle, optionState) => ({
				...providedStyle,
				backgroundColor: optionState.isSelected ? '#856eaf' : 'white',
				color: optionState.isSelected ? 'white' : 'black'
			})
		};

		switch (theme) {
			case 'none':
				return;
			case 'rsInput':
				return rsInputStyles;
			default:
				return;
		}
	}, [theme, styles]);

	function renderCreateableSelect() {
		return (
			<Creatable
				{...selectProps}
				value={value}
				styles={generateSelectStyles()}
				theme={generateSelectTheme}
				onChange={handleChange}
			/>
		);
	}

	function renderBasicSelect() {
		return (
			<ReactSelect
				{...selectProps}
				value={value}
				styles={generateSelectStyles()}
				theme={generateSelectTheme}
				onChange={handleChange}
			/>
		);
	}

	return (
		<>
			<Box className={computedClassName} style={renderStyles()} id={id}>
				{isCreatable ? renderCreateableSelect() : renderBasicSelect()}
			</Box>
			{renderErrors()}
		</>
	);
};

export default Select;
