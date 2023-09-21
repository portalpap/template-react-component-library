import React, { useEffect, useRef, useState } from 'react';
import './PerPageDropdown.scss';
import Icon from '../icon/Icon';
import Label from '../label/Label';

export interface PerPageDropdownProps {
	perPageOptions: number[];
	selectedOption: number;
	setSelectedOptionCallback: (value: number) => void;
	setSelectedPageCallback: (value: number) => void;
	id?: string;
}

const PerPageDropdown: React.FC<PerPageDropdownProps> = (props) => {
	const { perPageOptions, selectedOption, setSelectedOptionCallback, setSelectedPageCallback } = props;

	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutsideMenu(event: any) {
			if (dropdownRef && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutsideMenu);

		return () => {
			document.removeEventListener('mousedown', handleClickOutsideMenu);
		};
	}, [setShowDropdown]);

	useEffect(() => {}, [showDropdown]);

	function manageSelection(option: number) {
		setShowDropdown(false);

		setSelectedPageCallback(1);

		setSelectedOptionCallback(option);
	}

	function renderPerPageOptions() {
		return perPageOptions.map((option) => {
			return (
				<div key={option} className="selectableOptions" onClick={() => manageSelection(option)}>
					{option}
				</div>
			);
		});
	}

	return (
		<div ref={dropdownRef} id={props.id} className="rsPerPageDropdown">
			<Label
				onClick={() => {
					setShowDropdown(true);
				}}
			>
				{selectedOption}
			</Label>

			<Icon
				onClick={() => {
					setShowDropdown(true);
				}}
				iconImg={'icon-chevron-down'}
				className="chevronDown"
				size={12}
			/>

			{showDropdown && <div className="optionsContainer">{renderPerPageOptions()}</div>}
		</div>
	);
};

export default PerPageDropdown;
