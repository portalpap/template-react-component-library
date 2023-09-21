import React, { useEffect } from 'react';
import './Switch.scss';

export interface SwitchProps {
	className?: string;
	checked?: boolean;
	label?: string;
	labelPosition?: string;
	name?: string;
	rectangle?: boolean;
	value?: string | number;
	vertical?: boolean;
	onChange?: (checked: boolean) => void;
}

interface SwitchLabel {
	left?: string;
	top?: string;
	bottom?: string;
	right?: string;
}

const getLeftRightLabelClasses = (props: SwitchProps) => {
	let classes = 'rsSwitchLabelLeftRight';
	if (props.vertical) classes += ' vertical';
	return classes;
};

const getTopBottomLabelClasses = (props: SwitchProps) => {
	let classes = 'rsSwitchLabelTopBottom';
	if (props.vertical) classes += ' vertical';
	return classes;
};

const getControlClasses = (props: SwitchProps) => {
	let classes = 'rsSwitchControl';
	if (props.vertical) classes += ' vertical';
	return classes;
};

const getClasses = (props: SwitchProps) => {
	let classes = 'rsSwitch';
	if (props.className) classes += ` ${props.className}`;
	return classes;
};

const Switch: React.FC<SwitchProps> = (props) => {
	const name = props.name || `RsSwitch_${Date.now()}`;
	const label = JSON.parse(props.label || '{"left":"label"}') as SwitchLabel;
	const labelPositions = (props.labelPosition || 'left').split('|');
	const [checked, setChecked] = React.useState(props.checked ?? false);
	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
		if (props.onChange) props.onChange(event.target.checked);
	};

	useEffect(() => {
		setChecked(props.checked ?? false);
	}, [props.checked]);

	return (
		<>
			<div id={name} className={getClasses(props)}>
				{labelPositions.indexOf('top') > -1 && (
					<div className={getTopBottomLabelClasses(props)}>{label['top']}</div>
				)}
				{labelPositions.indexOf('left') > -1 && (
					<span className={getLeftRightLabelClasses(props)}>{label['left']}</span>
				)}
				<label className={getControlClasses(props)}>
					<input
						id={`${name}_checkbox`}
						name={`${name}_checkbox`}
						type="checkbox"
						value={props.value}
						checked={checked}
						onChange={changeHandler}
					/>
					<span className={props.rectangle ? 'slider' : 'slider round'}></span>
				</label>
				{labelPositions.indexOf('right') > -1 && (
					<span className={getLeftRightLabelClasses(props)}>{label['right']}</span>
				)}
				{labelPositions.indexOf('bottom') > -1 && (
					<div className={getTopBottomLabelClasses(props)}>{label['bottom']}</div>
				)}
			</div>
		</>
	);
};

export default Switch;
