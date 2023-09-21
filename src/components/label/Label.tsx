import './Label.scss';
import React, { CSSProperties, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { getSpacingProperties, spacingKeys } from '../../utils/spacingUtils';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';
import { LabelVariants } from './LabelVariants';

export interface LabelProps extends React.PropsWithChildren {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLLabelElement> | void;
	id?: string;
	showMoreButton?: boolean;
	showMoreText?: string | ReactNode;
	showLessText?: string | ReactNode;
	tooltipProperties?: TooltipProperties;

	// Adds class names
	variant?: LabelVariants;

	lineClamp?: number;

	/*~~~~~ Directly converted to style properties ~~~~~*/

	// Display properties
	display?: CSSProperties['display'];
	overflowWrap?: CSSProperties['overflowWrap'];

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

	// Font properties
	overflow?: string;
	textOverflow?: 'clip' | 'ellipsis' | string | 'initial' | 'inherit';
	visibility?: 'visible' | 'hidden' | 'collapse' | 'initial' | 'inherit';
	whiteSpace?: string;

	/*~~~~~ Spacing props ~~~~~*/

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

	/*~~~~~ Palette properties ~~~~~*/

	color?: string;
	bgcolor?: string;

	/*~~~~~ Dimensions ~~~~~*/

	width?: string | number;
	height?: string | number;
	maxWidth?: string | number;
	maxHeight?: string | number;
	minWidth?: string | number;
	minHeight?: string | number;
}

function transformProps(props: PropsWithChildren<LabelProps>): CSSProperties {
	let filtered: any = {};
	let i: keyof typeof props;
	for (i in props) {
		if (i === 'm') {
			filtered['margin'] = props[i];
		} else if (i === 'p') {
			filtered['padding'] = props[i];
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

const Label: React.FC<LabelProps> = (props) => {
	const labelRef = useRef<HTMLDivElement>(null);
	const { className, onClick, variant, id, ...other } = props;
	const [showSeeMoreButton, setShowSeeMoreButton] = useState<boolean>(false);
	const [showText, setShowText] = useState<boolean>(false);

	useEffect(() => {
		let label = labelRef.current;
		if (!label || !props.lineClamp || !props.showMoreButton) return;
		setShowSeeMoreButton(label.scrollHeight > label.clientHeight);
	}, [props.children, props.lineClamp, props.showMoreButton]);

	let output = transformProps(other);
	let adjustedClassName = className ? `rsLabel ${className}` : 'rsLabel';
	adjustedClassName = variant ? `${adjustedClassName} ${variant}` : adjustedClassName;

	if (output.hasOwnProperty('lineClamp') && !showText) {
		output['WebkitLineClamp'] = output['lineClamp'];
		output['textOverflow'] = 'ellipsis';
		output['display'] = '-webkit-box';
		output['overflow'] = 'hidden';
	}

	function renderText() {
		let showMore = props.showMoreText || 'Show More';
		let showLess = props.showLessText || 'Show Less';
		if (showText) return showLess;
		else return showMore;
	}

	function renderSingleLabel(children: React.ReactNode) {
		return (
			<div
				id={id}
				onClick={props.onClick as React.MouseEventHandler}
				style={output}
				className={adjustedClassName}
				ref={labelRef}
			>
				{children}
			</div>
		);
	}

	function renderIndividualLabel() {
		if (!props.tooltipProperties) return renderSingleLabel(props.children);
		if (props.tooltipProperties.wrapContents)
			return renderSingleLabel(<TooltipWrapper {...props.tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...props.tooltipProperties}>{renderSingleLabel(props.children)}</TooltipWrapper>;
	}

	function renderLabel() {
		if (showSeeMoreButton)
			return (
				<>
					{renderIndividualLabel()}
					<div className={'rsLabelShowMoreButton'} onClick={() => setShowText((previous) => !previous)}>
						{renderText()}
					</div>
				</>
			);
		return renderIndividualLabel();
	}

	return renderLabel();
};

export default Label;
