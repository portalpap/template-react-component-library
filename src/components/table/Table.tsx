import React, { useState } from 'react';
import './Table.scss';
import FilterColumn from '../filterColumn/FilterColumn';
import Box from '../box/Box';
import { RsFormControl } from '../../form/FormControl';
import debounce from 'lodash.debounce';
import Input from '../input/Input';

export interface TableProps extends React.PropsWithChildren {
	searchInputCallback: (value: string) => void;
	debounceTimeout: number;
	toggleColumnFilters: () => void;
	placeholder?: string;
	tableInputRef?: React.RefObject<HTMLInputElement>;
	tableInputId?: string;
}

export interface ColumnProps {
	id: string;
	label: string;
	style?: object;
	align: 'center' | 'inherit' | 'justify' | 'left' | 'right';
	className?: string;
	sort: string | undefined;
}

const Table: React.FC<TableProps> = (props) => {
	const { searchInputCallback, toggleColumnFilters } = props;

	const [searchControl] = useState(new RsFormControl('search', '', []));

	function getTableClasses() {
		let classes = 'rsTableContainer';
		return classes;
	}

	const searchDebounced = debounce(async (value) => {
		searchInputCallback(value.value as string);
	}, 350);

	return (
		<div className="rsTable">
			<Box display="flex" alignItems={'center'} justifyContent={'space-between'} className="uiTableInputs">
				<Input
					id={props.tableInputId}
					placeholder={props.placeholder ? props.placeholder : 'Search'}
					inputRef={props.tableInputRef}
					color={'#858585'}
					look={'outlined'}
					type={'text'}
					updateControl={searchDebounced}
					control={searchControl}
					noAutocomplete
					searchIcon
				/>

				<FilterColumn enableColumnFilters={toggleColumnFilters} />
			</Box>

			<table className={getTableClasses()}>{props.children}</table>
		</div>
	);
};

export default Table;
