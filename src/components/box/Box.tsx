import React, { CSSProperties, MouseEvent, PropsWithChildren } from 'react';
import { getSpacingProperties, spacingKeys } from '../../utils/spacingUtils';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

export interface BoxProps extends React.PropsWithChildren {
	className?: string;
	onClick?: (event: MouseEvent) => void;
	boxRef?: React.RefObject<any>;
	id?: string;
	style?: CSSProperties;
	tooltipProperties?: TooltipProperties;

	// Spacing props
	m?: string | number;
	mt?: string | number;
	mr?: string | number;
	mb?: string | number;
	ml?: string | number;
	mx?: string | number;
	my?: string | number;
	p?: string | number;
	pt?: string | number;
	pr?: string | number;
	pb?: string | number;
	pl?: string | number;
	px?: string | number;
	py?: string | number;
	margin?: string | number;
	marginTop?: string | number;
	marginRight?: string | number;
	marginBottom?: string | number;
	marginLeft?: string | number;
	marginX?: string | number;
	marginY?: string | number;
	padding?: string | number;
	paddingTop?: string | number;
	paddingRight?: string | number;
	paddingBottom?: string | number;
	paddingLeft?: string | number;
	paddingX?: string | number;
	paddingY?: string | number;
	boxSizing?: CSSProperties['boxSizing'];
	// Display properties
	display?: CSSProperties['display'];
	//displayPrint?: string;
	//displayRaw?: string;
	overflow?: string;
	textOverflow?: 'clip' | 'ellipsis' | string | 'initial' | 'inherit';
	visibility?: 'visible' | 'hidden' | 'collapse' | 'initial' | 'inherit';
	whiteSpace?: CSSProperties['whiteSpace'];
	// Border properties
	border?: string | number;
	borderTop?: string | number;
	borderLeft?: string | number;
	borderRight?: string | number;
	borderBottom?: string | number;
	borderColor?: string;
	borderRadius?: string | number;
	// Flex properties
	flexDirection?: CSSProperties['flexDirection'];
	flexWrap?: CSSProperties['flexWrap'];
	justifyContent?: CSSProperties['justifyContent'];
	alignItems?: CSSProperties['alignItems'];
	alignContent?: CSSProperties['alignContent'];
	order?: CSSProperties['order'];
	flex?: CSSProperties['flex'];
	flexGrow?: string | number;
	flexShrink?: string | number;
	alignSelf?: string | number;
	textAlign?: string | number;
	gap?: string | number;
	// Grid Properties
	placeContent?: CSSProperties['placeContent'];
	gridTemplateColumn?: CSSProperties['gridTemplateColumns'];
	gridTemplateRow?: CSSProperties['gridTemplateRows'];
	gridTemplate?: CSSProperties['gridTemplate'];
	// Palette properties
	color?: CSSProperties['color'];
	bgcolor?: CSSProperties['backgroundColor'];
	//Width and MaxWidth
	width?: string | number;
	height?: string | number;
	maxWidth?: string | number;
	maxHeight?: string | number;
	minWidth?: string | number;
	minHeight?: string | number;
	// Position
	position?: CSSProperties['position'];
	left?: string | number;
	right?: string | number;
	top?: string | number;
	bottom?: string | number;
	cursorPointer?: boolean;
}

// Eventually move these transformation functions into a flexible system like material-ui
// See https://github.com/mui-org/material-ui/tree/next/packages/material-ui-system/src
function getBorder(value: string | number) {
	if (typeof value !== 'number') {
		return value;
	}
	return `${value}px solid`;
}

function transformProps(props: PropsWithChildren<BoxProps>): CSSProperties {
	let filtered: any = {};
	let i: keyof typeof props;
	for (i in props) {
		if (i === 'children') continue;

		if (i === 'm') {
			filtered['margin'] = props[i];
		} else if (i === 'p') {
			filtered['padding'] = props[i];
		} else if (i === 'border') {
			filtered[i] = getBorder(props[i] as string | number);
		} else if (spacingKeys.includes(i)) {
			let stylePropNames = getSpacingProperties(i);
			for (let propName of stylePropNames) {
				filtered[propName] = props[i];
			}
		} else if (i === 'bgcolor') {
			filtered['backgroundColor'] = props[i];
		} else {
			filtered[i] = props[i];
		}
	}
	return filtered;
}

const Box: React.FC<BoxProps> = (props) => {
	// Based on prop value we might perform some transformations (i.e. m = margin, etc.)
	const { className, onClick, id, boxRef, style, tooltipProperties, ...other } = props;
	let cssProperties = transformProps(other);
	if (style) cssProperties = { ...cssProperties, ...style };
	if (props.cursorPointer) cssProperties.cursor = 'pointer';

	const adjustedClassName = className ? `rsBox ${className}` : 'rsBox';

	function renderSingleBox(children: React.ReactNode) {
		return (
			<div id={id} ref={boxRef} className={adjustedClassName} style={cssProperties} onClick={props.onClick}>
				{children}
			</div>
		);
	}

	function renderBox() {
		if (!tooltipProperties) return renderSingleBox(props.children);
		if (tooltipProperties.wrapContents)
			return renderSingleBox(<TooltipWrapper {...tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...tooltipProperties}>{renderSingleBox(props.children)}</TooltipWrapper>;
	}

	return renderBox();
};
export default Box;
