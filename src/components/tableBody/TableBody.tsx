import React from 'react';

import './TableBody.scss';

export interface TableBodyProps extends React.PropsWithChildren {
	isFilterShown?: boolean;
}

const TableBody: React.FC<TableBodyProps> = (props) => {
	function getClasses() {
		let classes = 'rsTableBody';

		if (props.isFilterShown) classes += ' filterShown';

		return classes;
	}

	return <tbody className={getClasses()}>{props.children}</tbody>;
};

export default TableBody;
