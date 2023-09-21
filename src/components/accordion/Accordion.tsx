import React, { MouseEvent, useEffect, useState } from 'react';
import './Accordion.scss';
import Icon from '../icon/Icon';
import ResizeObserver from 'resize-observer-polyfill';
import Box from '../box/Box';

export interface AccordionProps extends React.PropsWithChildren {
	title?: string;
	titleReact?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	onClick?: () => void;
	color?: string;
	backgroundColor?: string;
	openedBackgroundColor?: string;
	hideChevron?: boolean;
	iconLeft?: string;
	disableRipple?: boolean;
	hideHoverEffect?: boolean;
	isOpen?: boolean;
	defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = (props) => {
	const [isOpened, setIsOpened] = useState<boolean>(props.isOpen || false);
	const divRef = React.createRef<HTMLDivElement>();

	useEffect(() => {
		accordionButtonHandler(divRef);
	}, [isOpened]);

	useEffect(() => {
		if (props.isOpen === undefined) return;
		setIsOpened(props.isOpen);
	}, [props.isOpen]);

	useEffect(() => {
		setIsOpened(props.defaultOpen ?? false);
	}, [props.defaultOpen]);

	useEffect(() => {
		const panel = divRef.current;
		if (!panel) return;
		const mutObserver = new MutationObserver(() => {
			if (panel.classList.value.includes('opened')) panel.style.height = panel.scrollHeight + 'px';
		});
		const observer = new ResizeObserver(function () {
			if (panel.classList.value.includes('opened')) panel.style.height = panel.scrollHeight + 'px';
		});

		mutObserver.observe(panel, { attributes: true, childList: true, subtree: true });
		for (let i = 0; i < panel.children.length; i++) {
			mutObserver.observe(panel.children[i], { attributes: true, childList: true, subtree: true });
			observer.observe(panel.children[i]);
		}

		return () => {
			mutObserver.disconnect();
			observer.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function accordionButtonHandler(divRef: React.RefObject<HTMLDivElement>) {
		const panel = divRef.current;
		if (!panel) return;

		if (panel.style.height || !isOpened) {
			panel.style.height = '';
		} else {
			panel.style.height = panel.scrollHeight + 'px';
		}
	}

	function renderClasses(...classes: string[]) {
		classes.push('rsAccordion');
		if (props.className) classes.push(props.className);
		if (!props.hideHoverEffect) classes.push('hoverEffect');
		return classes.join(' ');
	}

	function renderStyles() {
		let styles: any = {};
		if (props.openedBackgroundColor && isOpened) styles['backgroundColor'] = props.openedBackgroundColor;
		else if (props.backgroundColor) styles['backgroundColor'] = props.backgroundColor;
		if (props.color) {
			styles['color'] = props.color;
			styles['fill'] = props.color;
		}
		return styles;
	}

	function rippleEffect(event: MouseEvent) {
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

	function renderTitle() {
		if (props.titleReact) return <Box>{props.titleReact}</Box>;
		return (
			<Box className={'labelWrapper'}>
				{props.iconLeft && <Icon iconImg={props.iconLeft} size={17} />}
				<Box className={props.iconLeft ? 'marginLeft label' : 'label '}>{props.title}</Box>
			</Box>
		);
	}

	return (
		<Box key={props.title} className={renderClasses(isOpened ? 'active' : '')} style={renderStyles()}>
			<Box
				className="articleItemHeader"
				onClick={(event: MouseEvent) => {
					if (!props.disableRipple) rippleEffect(event);

					if (props.isOpen === undefined) setIsOpened((prev) => !prev);
					if (props.onClick) props.onClick();
				}}
			>
				{renderTitle()}
				{!props.hideChevron && (
					<Icon className={isOpened ? 'iconSpinDown' : 'iconSpinUp'} iconImg={'icon-chevron-up'} size={14} />
				)}
			</Box>
			<Box className={`articleItemChildren ${isOpened ? 'opened' : ''}`} boxRef={divRef}>
				{props.children}
			</Box>
		</Box>
	);
};

export default Accordion;
