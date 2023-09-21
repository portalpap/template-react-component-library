import { RsValidator, RsValidatorEnum } from './Validator';

/** Tracks the value and validation status of an individual form control. */

/** Regular expression for email validation. */
export const EmailRegex = new RegExp(
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/
);
/** Allows the following characters: A-Z, a-z, 0-9, hyphen, period, comma, space */
export const InvalidCharactersRegex = new RegExp(/^[A-Za-z0-9-.,\s]*$/);
/** Allows the following characters: A-Z, a-z, 0-9, hyphen, period, comma, space */
export const NameRegex = new RegExp(/^[A-Za-z0-9-.,\s]*$/); //

export class RsFormControl {
	/** @internal */
	private _errors: number[] = [];
	private _initialValue: string | number | string[] | number[] = '';
	/**
	 * Creates a new `RsFormControl` instance.
	 * @param _key Form control key which should match your form model property.
	 * @param _value Initializes the control with an initial value.
	 * @param _validators Array of validators applied to this form control
	 */
	constructor(
		private _key: string,
		private _value: string | number | string[] | number[],
		private _validators?: RsValidator[]
	) {
		this._initialValue = _value;
	}

	get key() {
		return this._key;
	}

	get value() {
		return this._value;
	}
	set value(value: string | number | string[] | number[]) {
		this._value = value;
	}

	get errors() {
		return this._errors;
	}

	resetToInitial() {
		this._value = this._initialValue;
		this._errors = [];
	}

	isAtInitialValue(): boolean {
		return this._value === this._initialValue;
	}

	/**
	 * Get error message by searching validator string
	 * @param index
	 * @returns {string}
	 */
	getErrorMessage(index: number) {
		if (!this._validators) return '';
		return this._validators[index].errorMessage;
	}

	/**
	 * Updates the initial value with the current value
	 */
	updateInitialValue() {
		this._initialValue = this._value;
	}

	/**
	 * Used to clear the error fields. Should only be called if you know what you are doing
	 */
	clearErrors() {
		this._errors = [];
	}

	/**
	 * Validates current value of control, based on the validators applied.
	 * @returns {boolean} True if control passes all validation test, false otherwise.
	 */
	async validate(): Promise<boolean> {
		this._errors = [];
		if (this._validators) {
			for (let index = 0; index < this._validators.length; index++) {
				const validator: RsValidator = this._validators[index];
				const validatorRule = validator.validator;
				switch (validatorRule) {
					case RsValidatorEnum.REQ:
						if (this._value === undefined || this._value === null) {
							this._errors.push(index);
							return false;
						}

						if (typeof this._value === 'string' && this._value.trim() === '') {
							this._errors.push(index);
							return false;
						}

						if (Array.isArray(this._value) && this._value.length === 0) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.MIN:
						const min = parseInt(validator.value as string) || 0;
						if ((this._value as string).length < min) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.MAX:
						const max = parseInt(validator.value as string) || 0;
						if ((this._value as string).length > max) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.NUM:
						if (isNaN(Number(this._value))) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.EMAIL:
						// If value is empty, don't validate
						if (this._value.toString().trim() === '') return true;
						const isEmail = EmailRegex.test(this._value as string);
						if (!isEmail) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.CHAR:
						// If value is empty, don't validate
						if (this._value.toString().trim() === '') return true;
						const isValidChars = InvalidCharactersRegex.test(this._value as string);
						if (!isValidChars) {
							this._errors.push(index);
							return false;
						}
						break;

					case RsValidatorEnum.NAME:
						// If value is empty, don't validate
						if (this._value.toString().trim() === '') return true;
						const isName = NameRegex.test(this._value as string);
						if (!isName) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.REG:
						if (!(validator.value as RegExp).test(this._value as string)) {
							this._errors.push(index);
							return false;
						}
						break;
					case RsValidatorEnum.CUSTOM:
						const result = await (
							validator.value as (control: RsFormControl) => boolean | Promise<boolean>
						)(this);
						if (!result) {
							this._errors.push(index);
							return false;
						}
						break;
				}
			}
		}
		return true;
	}
}
