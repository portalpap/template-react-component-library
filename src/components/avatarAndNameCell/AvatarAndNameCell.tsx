import React from 'react';
import './AvatarAndNameCell.scss';
import Avatar from '../avatar/Avatar';

export interface AvatarAndNameCellProps {
	align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
	profilePicture?: string;
	name: string;
	className?: string;
	style?: any;
}

const AvatarAndNameCell: React.FC<AvatarAndNameCellProps> = (props) => {
	const { align, className, style } = props;

	function getClasses() {
		let classes = 'rsAvatarAndNameCell';

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
			<span>
				<Avatar
					className="avatarImage"
					widthHeight={36}
					backgroundColor={'#cccccc'}
					image={props.profilePicture}
					name={props.name}
				/>

				{props.name}
			</span>
		</td>
	);
};

export default AvatarAndNameCell;
