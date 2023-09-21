import React, { useState } from 'react';
import './TableHead.scss';
import TableCell from '../tableCell/TableCell';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { ColumnProps } from '../table/Table';

export interface TableHeadProps {
	columns: ColumnProps[];
	className?: string[];
	separator?: string | React.ReactNode;
	selectedHeaderSort: (column: string) => void;
}

const TableHead: React.FC<TableHeadProps> = (props) => {
	const [selectedColumn, setSelectedColumn] = useState<string>('');

	function splitCamelCase(str: string) {
		let breakDown = str.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g);

		return breakDown?.join(' ');
	}

	function renderSortArrow(sort: string | undefined, id: string) {
		// if (!sort) return;

		const iconSize = 18;

		if (id !== selectedColumn) return <AiOutlineArrowDown size={iconSize} className="arrowIcon" />;
		else if (sort === 'ASC') return <AiOutlineArrowDown size={iconSize} className="arrowIcon" />;

		return <AiOutlineArrowUp size={iconSize} className="arrowIcon" />;
	}

	function renderColumnHeaders() {
		let columns = props.columns;

		let headerTitles = [];

		for (let column of columns) {
			headerTitles.push(
				<TableCell
					key={column.label}
					isHeader
					align={column.align}
					style={column.style}
					className={column.className + ' cellHeader'}
				>
					<div
						className={`directionArrowContainer ${selectedColumn === column.id ? ' visible' : ''}`}
						onClick={() => {
							props.selectedHeaderSort(column.id);

							setSelectedColumn(column.id);
						}}
					>
						{splitCamelCase(column.label)}

						{renderSortArrow(column.sort, column.id)}
					</div>
				</TableCell>
			);
		}

		return headerTitles;
	}

	function getClasses() {
		let classes = 'rsTableHeader ';

		if (props.className) classes += props.className.join(' ');

		return classes;
	}

	return (
		<thead className={getClasses()}>
			<tr>{renderColumnHeaders()}</tr>
		</thead>
	);
};

export default TableHead;
