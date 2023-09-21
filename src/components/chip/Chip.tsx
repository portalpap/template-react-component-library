import React from 'react';
import './Chip.scss';
import Icon from '../icon/Icon';
import Avatar from '../avatar/Avatar';

export interface ChipProps {
	label: string;
	look: 'standard' | 'outlined';
	color?: string;
	backgroundColor?: string;
	disabled?: boolean;
	icon?: string;
	avatarImg?: string;
	avatarInitials?: string;
	onClick?: (event?: React.MouseEvent) => void;
	onDelete?: (event?: React.MouseEvent) => void;
	className?: string;
}

const Chip: React.FC<ChipProps> = (props) => {
	function rippleEffect(event: React.MouseEvent<HTMLElement>) {
		let targetBoundingRect = event.currentTarget.getBoundingClientRect();
		let x = event.clientX - targetBoundingRect.x;
		let y = event.clientY - targetBoundingRect.y;
		let ripples = document.createElement('span');
		ripples.style.left = `${x}px`;
		ripples.style.top = `${y}px`;
		ripples.classList.add('ripple');
		event.currentTarget.appendChild(ripples);
		setTimeout(() => {
			ripples.remove();
		}, 600);
	}

	function renderChipClasses() {
		let classes = 'rsChip';
		if (props.onClick) classes += ' onClick';
		if (props.look === 'outlined') classes += ' outlined';
		if (props.disabled) classes += ' disabled';
		if (props.className) classes += ` ${props.className}`;
		return classes;
	}

	function renderLabelClasses() {
		let classes = 'label';
		if (props.icon || props.avatarImg || props.avatarInitials) classes += ' ml';
		if (props.onDelete) classes += ' mr';
		return classes;
	}

	return (
		<span
			className={renderChipClasses()}
			onClick={(event: React.MouseEvent<HTMLElement>) => {
				if (props.onClick) {
					rippleEffect(event);
					props.onClick(event);
				}
			}}
			style={props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}}
		>
			{(props.icon || props.avatarImg || props.avatarInitials) && (
				<>
					{!!props.icon && !props.avatarImg && !props.avatarInitials && <Icon iconImg={props.icon} />}
					{!!props.avatarImg && !props.icon && !props.avatarInitials && (
						<Avatar widthHeight={25} backgroundColor={'#8a8a8a'} image={props.avatarImg} />
					)}
					{!!props.avatarInitials && !props.icon && !props.avatarImg && (
						<Avatar widthHeight={25} backgroundColor={'#8a8a8a'} name={props.avatarInitials} />
					)}
				</>
			)}
			<div className={renderLabelClasses()}>{props.label}</div>
			{props.onDelete && (
				<Icon
					iconImg={'chip-x'}
					size={22}
					color={'#8a8a8a'}
					onClick={(event) => {
						if (props.onDelete) props.onDelete(event);
						event?.stopPropagation();
					}}
				/>
			)}
		</span>
	);
};

export default Chip;
