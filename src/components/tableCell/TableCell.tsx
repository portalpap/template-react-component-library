import React from 'react';
import './TableCell.scss';

export interface TableCellProps extends React.PropsWithChildren {
	align: 'center' | 'inherit' | 'justify' | 'left' | 'right';
	className?: string;
	component?: React.ReactNode;
	size?: 'medium' | 'small';
	style?: any;
	isHeader?: boolean;
	selectedCell?: (selectedCell: string) => void;
}

const TableCell: React.FC<TableCellProps> = (props) => {
	const { align, className } = props;

	function getClasses() {
		let classes = 'rsTableCell';

		if (align === 'center') classes += ' centerAlign';
		else if (align === 'inherit') classes += ' inheritClass';
		else if (align === 'justify') classes += ' justifyClass';
		else if (align === 'left') classes += ' leftAlign';
		else if (align === 'right') classes += ' rightAlign';

		if (className) classes += ` ${className}`;

		return classes;
	}

	function renderHeaderCell() {
		return (
			<th className={getClasses()} style={props.style}>
				{props.children}
			</th>
		);
	}

	return props.isHeader ? (
		renderHeaderCell()
	) : (
		<td className={getClasses()} style={props.style}>
			{props.children}
		</td>
	);
};

export default TableCell;
