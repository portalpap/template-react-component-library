import React from 'react';
import './FilterDropdownCell.scss';
import Select, { SelectProps } from '../select/Select';

export type FilterDropdownCellProps = {
	className?: string;
} & SelectProps;

const FilterDropdownCell: React.FC<FilterDropdownCellProps> = (props) => {
	const { className, ...selectProps } = props;
	return (
		<td className={`${className}`}>
			<Select {...selectProps} />
		</td>
	);
};

export default FilterDropdownCell;
