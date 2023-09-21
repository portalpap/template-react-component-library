import React, { useEffect, useState } from 'react';
import './Input.scss';
import clone from 'lodash.clone';
import { RsFormControl } from '../form/FormControl';
import Icon from '../icon/Icon';

export type AutoCompleteType =
	| 'off'
	| 'autocomplete'
	| 'on'
	| 'name'
	| 'honorific-prefix'
	| 'given-name'
	| 'additional-name'
	| 'family-name'
	| 'honorific-suffix'
	| 'nickname'
	| 'email'
	| 'username'
	| 'new-password'
	| 'current-password'
	| 'one-time-code'
	| 'organization-title'
	| 'organization'
	| 'street-address'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'address-level4'
	| 'address-level3'
	| 'address-level2'
	| 'address-level1'
	| 'country'
	| 'country-name'
	| 'postal-code'
	| 'cc-name'
	| 'cc-given-name'
	| 'cc-additional-name'
	| 'cc-family-name'
	| 'cc-number'
	| 'cc-exp'
	| 'cc-exp-month'
	| 'cc-exp-year'
	| 'cc-csc'
	| 'cc-type'
	| 'transaction-currency'
	| 'transaction-amount'
	| 'language'
	| 'bday'
	| 'bday-day'
	| 'bday-month'
	| 'bday-year'
	| 'sex'
	| 'tel'
	| 'tel-country-code'
	| 'tel-national'
	| 'tel-area-code'
	| 'tel-local'
	| 'tel-local-prefix'
	| 'tel-local-suffix'
	| 'tel-extension'
	| 'impp'
	| 'url'
	| 'photo';

export interface InputProps {
	type: 'text' | 'password' | 'number' | 'textarea' | 'tel' | 'email' | 'hidden' | 'date';
	look: 'standard' | 'filled' | 'outlined' | 'none';
	control: RsFormControl;
	color?: string;
	backgroundColor?: string;
	borderColor?: string;
	name?: string;
	id?: string;
	updateControl?: (control: RsFormControl) => void;
	className?: string;
	placeholder?: string;
	cols?: number;
	rows?: number;
	disabled?: boolean;
	unStyled?: boolean;
	noAutocomplete?: boolean;
	autocompleteType?: AutoCompleteType | string; // Defaults to "on"
	searchIcon?: boolean;
	maxLength?: number; // Only works with text input type
	minLength?: number; // Only works with text input type
	minValue?: number; // Only works with number, range, date, datetime-local, month, time and week.
	maxValue?: number; // Only works with number, range, date, datetime-local, month, time and week.
	iconImg?: string;
	iconSize?: number;
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	inputRef?: React.RefObject<any>;
	pattern?: string;
	onChange?: (
		event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
		control: RsFormControl
	) => void;
}

const Input: React.FC<InputProps> = (props) => {
	const [control, setControl] = React.useState(props.control);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	useEffect(() => {
		setControl(props.control);
		if (props.updateControl) props.updateControl(control);
	}, [props.control]);

	function renderErrors() {
		const errorNodes: React.ReactNode[] = [];
		const errors = control.errors;
		for (let index = 0; index < errors.length; index++) {
			const errorMessage = control.getErrorMessage(errors[index]);
			errorNodes.push(
				<div key={`${index}Error`} className="rsInputErrorMessage">
					{errorMessage}
				</div>
			);
		}
		return errorNodes;
	}

	function hasError(): boolean {
		return control.errors.length > 0;
	}

	async function changeHandler(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
		// Required to persist in React 16.X but not 17.X., Otherwise await() will lose the object
		event.persist();
		const target = event.target;
		const originalValue = target.value;
		// Set the element to focused so Chrome will not throw an error when trying to set the cursor position
		setIsFocused(true);

		const startPosition = target.selectionStart || 0;
		const endPosition = target.selectionEnd || 0;
		const updated = clone(props.control);
		if (updated) {
			updated.value = target.value;
			if (updated.value.length === 0) {
				updated.clearErrors();
			} else {
				await updated.validate();
			}
			setControl(updated);
			if (props.updateControl) props.updateControl(updated);
		}
		const updatedValue = updated.value.toString();
		let cursorOffset = calculateInputCursorPosition(startPosition, updatedValue, originalValue);
		// Set the cursor position to the same position as it was before offset by what was added or removed from the updated value
		target.setSelectionRange(startPosition + cursorOffset, endPosition + cursorOffset);
		if (props.onChange) props.onChange(event, updated);
	}

	function calculateInputCursorPosition(startPosition: number, updatedValue: string, originalValue: string): number {
		let cursorOffset = 0;
		if (updatedValue.length !== originalValue.length) {
			// Find what was changed between the cursor position and the start of the string
			if (updatedValue.length > originalValue.length) {
				// If there was an insertion before the startPosition, change cursor offset by 1 and increase the startPosition by 1
				const insertions = findInsertedPositions(originalValue, updatedValue);
				for (let i = 0; i < insertions.length; i++)
					if (insertions[i] < startPosition) {
						startPosition++;
						cursorOffset++;
					}
			} else {
				// If there was a removal before the startPosition, change cursor offset by -1
				const removals = findRemovedPositions(originalValue, updatedValue);
				for (let i = 0; i < removals.length; i++)
					if (removals[i] < startPosition) {
						cursorOffset--;
					}
			}
		}
		return cursorOffset;
	}

	function findInsertedPositions(originalValue: string, updatedValue: string): number[] {
		const insertions = [];
		let originalValueIndex = 0;

		for (let i = 0; i < updatedValue.length; i++)
			if (originalValue[originalValueIndex] !== updatedValue[i]) insertions.push(i);
			else originalValueIndex++;

		return insertions;
	}

	function findRemovedPositions(originalValue: string, updatedValue: string): number[] {
		const removals = [];
		let updatedValueIndex = 0;

		for (let i = 0; i < originalValue.length; i++)
			if (updatedValue[updatedValueIndex] !== originalValue[i]) removals.push(i);
			else updatedValueIndex++;

		return removals;
	}

	function getStyles() {
		let styles: any = {};
		if (props.color) styles['color'] = props.color;
		if (props.backgroundColor) styles['backgroundColor'] = props.backgroundColor;
		if (props.borderColor) styles['borderColor'] = props.borderColor;

		return styles;
	}

	function getClasses() {
		let classes = ['rsInput'];
		if (!props.unStyled) classes.push('uiStyled');
		if (props.look === 'standard') classes.push('standard');
		else if (props.look === 'filled') classes.push('filled');
		else if (props.look === 'outlined') classes.push('outlined');

		if (hasError()) classes.push('error');
		if (props.type === 'textarea') classes.push('textarea');
		if (props.className) classes.push(props.className);

		return classes.join(' ');
	}

	function getAutocompleteType(): string {
		if (props.noAutocomplete) return 'off';
		if (props.autocompleteType) return props.autocompleteType;
		return 'on';
	}

	function renderTextArea(className: string) {
		return (
			<textarea
				id={props.id}
				ref={props.inputRef}
				name={props.name}
				className={className}
				placeholder={props.placeholder || ` `}
				style={props.color ? { color: props.color } : {}}
				onChange={changeHandler}
				autoComplete={getAutocompleteType()}
				disabled={props.disabled}
				cols={props.cols}
				rows={props.rows}
				value={control.value as number | string | string[]}
			/>
		);
	}

	function renderInput(className: string, nativePlaceholder: boolean) {
		return (
			<input
				id={props.id}
				ref={props.inputRef}
				type={isFocused && props.type !== 'password' ? 'text' : props.type}
				name={props.name}
				className={className}
				placeholder={nativePlaceholder ? props.placeholder : ` `}
				style={props.color ? { color: props.color } : {}}
				value={control.value as number | string | string[]}
				onChange={changeHandler}
				disabled={props.disabled}
				autoComplete={getAutocompleteType()}
				maxLength={props.maxLength}
				minLength={props.minLength}
				pattern={props.pattern}
				min={props.minValue}
				max={props.maxValue}
				onFocus={(event) => {
					setIsFocused(true);
					if (props.onFocus) props.onFocus(event);
				}}
				onBlur={(event) => {
					setIsFocused(false);
					if (props.onBlur) props.onBlur(event);
				}}
			/>
		);
	}

	function renderPlaceholder() {
		if (props.searchIcon) {
			return (
				<>
					<Icon iconImg={'rsInput-search'} size={props.iconSize || 16} />
					{props.placeholder}
				</>
			);
		} else if (!props.searchIcon && !!props.iconImg) {
			return (
				<>
					<Icon iconImg={props.iconImg} size={props.iconSize || 16} />
					{props.placeholder}{' '}
				</>
			);
		} else {
			return props.placeholder;
		}
	}

	function renderStyledInputs() {
		return (
			<div className={getClasses()}>
				<div className={'inputLabelArea'} style={getStyles()}>
					{props.type === 'textarea' ? (
						<>
							{renderTextArea('inputTextArea')}
							<label className={'labelTextArea'}>{props.placeholder}</label>
						</>
					) : (
						<>
							{renderInput('input', false)}
							<label className={'label'}>{renderPlaceholder()}</label>
						</>
					)}
				</div>
				{renderErrors()}
			</div>
		);
	}

	function renderUnstyledInputs() {
		return (
			<>
				{props.type === 'textarea' ? renderTextArea(getClasses()) : renderInput(getClasses(), true)}
				{renderErrors()}
			</>
		);
	}

	return <>{props.unStyled ? renderUnstyledInputs() : renderStyledInputs()}</>;
};

export default Input;
