import React, { MouseEvent } from 'react';
import './Button.scss';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

export interface ButtonProps extends React.PropsWithChildren {
	children: React.ReactNode;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	small?: boolean;
	className?: string;
	disabled?: boolean;
	buttonRef?: React.RefObject<HTMLButtonElement>;
	look:
		| 'containedPrimary'
		| 'containedSecondary'
		| 'containedTertiary'
		| 'textPrimary'
		| 'textSecondary'
		| 'textTertiary'
		| 'outlinedPrimary'
		| 'outlinedSecondary'
		| 'outlinedTertiary'
		| 'none';
	id?: string;
	backgroundColor?: string;
	type?: 'button' | 'submit';
	disableRipple?: boolean;
	tooltipProperties?: TooltipProperties;
}

const Button: React.FC<ButtonProps> = (props) => {
	function rippleEffect(event: MouseEvent<HTMLElement>) {
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

	function getStyles() {
		let styles: any = {};
		if (props.backgroundColor && props.look === 'none') styles['backgroundColor'] = props.backgroundColor;

		return styles;
	}

	function getClasses() {
		let classes = 'rsButton';

		if (props.look === 'containedPrimary') classes += ' contained primary';
		else if (props.look === 'containedSecondary') classes += ' contained secondary';
		else if (props.look === 'containedTertiary') classes += ' contained tertiary';
		else if (props.look === 'textPrimary') classes += ' text primary';
		else if (props.look === 'textSecondary') classes += ' text secondary';
		else if (props.look === 'textTertiary') classes += ' text tertiary';
		else if (props.look === 'outlinedPrimary') classes += ' outlined primary';
		else if (props.look === 'outlinedSecondary') classes += ' outlined secondary';
		else if (props.look === 'outlinedTertiary') classes += ' outlined tertiary';
		else if (props.look === 'none') classes += ' none';
		if (props.tooltipProperties?.wrapContents) classes += ' wrappingTooltip';
		if (props.className) classes += ` ${props.className}`;
		if (props.small) classes += ` small`;

		return classes;
	}

	function renderSingleButton(children: React.ReactNode) {
		return (
			<button
				id={props.id}
				type={props.type || 'button'}
				className={getClasses()}
				onClick={(event: MouseEvent<HTMLButtonElement>) => {
					if (!props.disableRipple) rippleEffect(event);
					if (props.onClick) props.onClick(event);
				}}
				ref={props.buttonRef}
				disabled={props.disabled}
				style={getStyles()}
			>
				{children}
			</button>
		);
	}

	function renderButton() {
		if (!props.tooltipProperties) return renderSingleButton(props.children);
		if (props.tooltipProperties.wrapContents)
			return renderSingleButton(<TooltipWrapper {...props.tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...props.tooltipProperties}>{renderSingleButton(props.children)}</TooltipWrapper>;
	}

	return renderButton();
};

export default Button;
