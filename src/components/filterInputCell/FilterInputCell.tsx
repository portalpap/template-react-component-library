import React, { useState } from 'react';
import './FilterInputCell.scss';
import { RsFormControl } from '../form/FormControl';
import Input from '../input/Input';
import debounce from 'lodash.debounce';

export interface FilterInputCellProps {
	options?: string[];
	enteredValueCallback: (value: string) => void;
	column: string;
}

const FilterInputCell: React.FC<FilterInputCellProps> = (props) => {
	const [searchControl] = useState(new RsFormControl('search', '', []));

	const { enteredValueCallback } = props;

	let searchDebounced = debounce(async (value) => {
		enteredValueCallback(value.toLowerCase());
	}, 350);

	return (
		<td className="rsFilterInputCell">
			<Input
				className="filterInput"
				type={'text'}
				look={'standard'}
				control={searchControl}
				placeholder={'Filter...'}
				color={'#858585'}
				updateControl={(input) => {
					searchDebounced(input.value as string);
				}}
				noAutocomplete
			/>
		</td>
	);
};

export default FilterInputCell;
