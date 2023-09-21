import React from 'react';

import './DateCell.scss';

export interface DateCellProps {
	date: string | Date | undefined;
	align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
	className?: string;
	style?: any;
	format: 'ymd' | 'mdy' | 'dmy' | 'dmyy';
}

const DateCell: React.FC<DateCellProps> = (props) => {
	const { align, className } = props;

	function renderDate(date: string | Date | undefined) {
		if (!date) return 'no date found';

		try {
			return formatDate(date.toString().slice(0, 10));
		} catch (e) {
			return;
		}
	}

	function formatDate(date: string) {
		let formattedDate = date.split('-');

		let year = formattedDate[0];

		let month = formattedDate[1];

		let day = formattedDate[2];

		switch (props.format) {
			case 'ymd':
				// equivalent to date.replaceAll('-', ' / ');
				return date.replace(/-/g, ' / ');

			case 'dmy':
				return day + ' / ' + month + ' / ' + year;

			case 'dmyy':
				return day + ' / ' + month + ' / ' + year.slice(1, 3);

			case 'mdy':
				return month + ' / ' + day + ' / ' + year;

			default:
				return date;
		}
	}

	function getClasses() {
		let classes = 'rsDateCell';

		if (align === 'center') classes += ' centerAlign';
		else if (align === 'inherit') classes += ' inheritClass';
		else if (align === 'justify') classes += ' justifyClass';
		else if (align === 'left') classes += ' leftAlign';
		else if (align === 'right') classes += ' rightAlign';

		if (className) classes += ` ${className}`;

		return classes;
	}

	return (
		<td className={getClasses()} style={props.style}>
			{renderDate(props.date)}
		</td>
	);
};

export default DateCell;
