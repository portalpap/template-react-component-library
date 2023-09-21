import React, { ReactNode } from 'react';
import './ProgressBar.scss';

export interface ProgressBarProps {
	name?: string;
	className?: string;
	percentage?: number;
	ref?: React.Ref<HTMLInputElement>;
	indicatorPosition?: 'left' | 'center' | 'right';
	hideIndicator?: boolean;
	customIndicator?: boolean;
	customIndicatorContent?: ReactNode;
	striped?: boolean;
	animated?: boolean;
}

const getClasses = (props: ProgressBarProps) => {
	let classes = 'rsProgress';
	if (props.className) classes += ` ${props.className}`;
	return classes;
};

const getBarClasses = (props: ProgressBarProps) => {
	let classes = 'rsProgressBar';
	if (props.indicatorPosition) classes += ` ${props.indicatorPosition}`;
	if (props.striped) classes += ' rsProgressBarStriped';
	if (props.animated) classes += ' rsProgressBarAnimated';
	return classes;
};

const changeDivWidth = (progressBarRef: React.RefObject<HTMLDivElement>, percentage: number) => {
	const progressBar = progressBarRef.current;
	if (!progressBar) return;
	progressBar.style.width = `${percentage}%`;
};

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
	const name = props.name || `RsProgressBar_${Date.now()}`;
	const progressBarRef = React.createRef<HTMLDivElement>();

	React.useEffect(() => {
		changeDivWidth(progressBarRef, props.percentage || 0);
	});

	return (
		<>
			<div id={name} className={getClasses(props)}>
				<div
					className={getBarClasses(props)}
					role="progressbar"
					aria-valuenow={props.percentage}
					aria-valuemin={0}
					aria-valuemax={100}
					ref={progressBarRef}
				>
					{!props.hideIndicator &&
						(props.customIndicator ? (
							<span>{props.customIndicatorContent}</span>
						) : (
							<span>{props.percentage}% Complete</span>
						))}
				</div>
			</div>
		</>
	);
};

export default ProgressBar;
