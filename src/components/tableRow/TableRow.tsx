import React from 'react';
import './TableRow.scss';

export interface TableRowProps extends React.PropsWithChildren {
	className?: string;
	id?: string;
	onClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = (props) => {
	function getClasses() {
		let classes = 'rsTableRow ';

		if (props.className) classes += ` ${props.className}`;

		return classes;
	}

	return (
		<tr
			className={getClasses()}
			id={props.id}
			onClick={() => {
				if (props.onClick) props.onClick();
			}}
		>
			{props.children}
		</tr>
	);
};

export default TableRow;
