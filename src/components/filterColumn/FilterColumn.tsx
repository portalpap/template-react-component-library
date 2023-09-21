import React, { useState } from 'react';
import './FilterColumn.scss';
import Label from '../label/Label';
import Icon from '../icon/Icon';
import Button from '../button/Button';

export interface FilterColumnProps {
	enableColumnFilters: () => void;
}

const FilterColumn: React.FC<FilterColumnProps> = (props) => {
	const [filterOption, setFilterOption] = useState<boolean>(false);

	const { enableColumnFilters } = props;

	return (
		<Button
			className={'rsFilterColumn'}
			look={filterOption ? 'outlinedSecondary' : 'none'}
			onClick={() => {
				enableColumnFilters();

				setFilterOption(!filterOption);
			}}
		>
			<Icon className={'filterIcon'} iconImg={'icon-filter'} size={19} />

			<Label>Filters</Label>
		</Button>
	);
};

export default FilterColumn;
