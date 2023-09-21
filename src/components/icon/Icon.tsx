import React, { CSSProperties, MouseEvent } from 'react';

export interface IconProps {
	iconImg: string;
	id?: string;
	color?: string;
	size?: number;
	className?: string;
	onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
	cursorPointer?: boolean;
}

const Icon: React.FC<IconProps> = (props) => {
	let iconStyles: CSSProperties = {
		color: props.color,
		fontSize: props.size ? `${props.size}px` : '16px'
	};

	if (props.cursorPointer) iconStyles['cursor'] = 'pointer';

	let iconClassName = `rsIcon ${props.iconImg} ${props.className ? props.className : ''}`;

	return <span id={props.id} className={iconClassName} style={iconStyles} onClick={props.onClick}></span>;
};

export default Icon;
