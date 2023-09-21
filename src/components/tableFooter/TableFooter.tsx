import React from 'react';
import './TableFooter.scss';

export interface TableFooterProps extends React.PropsWithChildren {
	className?: string;
}

const TableFooter: React.FC<TableFooterProps> = (props) => {
	const { className } = props;

	function getClasses() {
		let classes = 'rsTableFooter';

		if (className) classes += ` ${className}`;

		return classes;
	}

	return (
		<tfoot className={getClasses()}>
			<tr>
				<th colSpan={500}>{props.children}</th>
			</tr>
		</tfoot>
	);
};

export default TableFooter;
