import { RsFormControl } from './FormControl';

/** Validator enumeration */
export enum RsValidatorEnum {
	/** Key of required validator.
	 * @description Checks if the value is empty.
	 */
	REQ = 'required',
	/** Key of min length validator.
	 * @description Checks if the length of the value is greater than a specified value
	 * @param _value the minimum length.
	 */
	MIN = 'minLength',
	/** Key of max length validator.
	 * @description Checks if the length of the value is smaller than a specified value
	 * @param _value the maximum length.
	 */
	MAX = 'maxLength',
	/** Key of email validator.
	 * @description Allows alphanumeric characters, and .!#$%&'*+/=?^_{|}~ before the @ sign, Allows Alphanumeric after the @ sign.
	 */
	EMAIL = 'email',
	/** Key of invalid characters validator.
	 * @description Allows A-Z, a-z, 0-9, hyphen, period, comma, space
	 */
	CHAR = 'invalidCharacters',
	/** Key of name validator.
	 * @description Allows A-Z, a-z, 0-9, hyphen, comma, period, space
	 */
	NAME = 'name',
	/** Key of numeric validator.
	 * @description Checks if the value is numeric.
	 */
	NUM = 'numeric',
	/** Key of regular expression validator.
	 * @description Compares the value with the value of another control.
	 * @param _value the chossen regular expression.
	 */
	REG = 'regexp',
	/** Key of custom validator.
	 * @description Creates a custom validator function.
	 * @param _value the custom validator function.
	 */
	CUSTOM = 'custom'
}

/** Supports form control validation. */
export class RsValidator {
	/**
	 * Creates a new `RsValidator` instance.
	 * @param _validator Validator enumeration from `RsValidatorEnum`.
	 * @param _errorMessage Error message for invalid state.
	 * @param _value Value for comparison validator, e.g. min, max,
	 * if putting a value of 3 here, validator will validate if the value lenght is smaller or greater than 3.
	 */
	constructor(
		private _validator: RsValidatorEnum,
		private _errorMessage: string,
		private _value?: string | number | RegExp | ((control: RsFormControl) => boolean | Promise<boolean>)
	) {}

	get validator() {
		return this._validator;
	}

	get errorMessage() {
		if (this._errorMessage.indexOf('$val') > -1) return this._errorMessage.replace(/\$val/g, this._value as string);
		else return this._errorMessage;
	}

	get value() {
		return this._value;
	}
}
