import React, { useState, useEffect } from 'react';
import './Dropdown.scss';

export interface DropdownProps {
	className?: string;
	placeholder?: string;
	list?: Array<any>;
	value?: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
	const [value, setValue] = useState('');

	useEffect(() => {
		if (props.value) setValue(props.value);
	}, [props.value]);

	const DropdownIcon = () => {
		return (
			<svg className="dropdownIcon" width="14px" height="7px" viewBox="0 0 10 5">
				<g stroke="none" strokeWidth="1" fillRule="evenodd">
					<g transform="translate(-1360.000000, -29.000000)" fill="#CDCFD3" fillRule="nonzero">
						<g transform="translate(1360.000000, 29.000000)">
							<polygon points="0 0 5 5 10 0"></polygon>
						</g>
					</g>
				</g>
			</svg>
		);
	};

	const DropdownInput = (props: DropdownProps) => {
		return (
			<div className="input" onClick={toggleDropdown}>
				{props.placeholder && !value && <p className="inputPlaceholder">{props.placeholder}</p>}
				{value && <p className="inputValue">{value}</p>}
				<DropdownIcon />
			</div>
		);
	};

	const DropdownList = (props: DropdownProps) => {
		const list = props.list?.map((index: string) => {
			return (
				<div className="listOption" key={'option_' + index} onClick={selectOption}>
					<p>{index}</p>
				</div>
			);
		});
		return <div className="list hidden">{list}</div>;
	};

	const toggleDropdown = (e: React.MouseEvent) => {
		const dropdownElement = (e.target as HTMLDivElement).closest<HTMLDivElement>('.rsDropdown');
		const dropdown = dropdownElement?.querySelector<HTMLDivElement>('.list');
		const input = dropdownElement?.querySelector<HTMLDivElement>('.input');
		input?.classList.toggle('inputActive');
		dropdown?.classList.toggle('hidden');
		hideOnClickOutside(dropdown);
	};

	const selectOption = (e: React.MouseEvent) => {
		const target = e.target as HTMLDivElement;
		const name = target.innerText;
		const dropdownElement = target.closest<HTMLDivElement>('.rsDropdown');
		const dropdown = dropdownElement?.querySelector<HTMLDivElement>('.list');
		setValue(name);
		dropdown?.classList.toggle('hidden');
		document.removeEventListener('mouseup', () => {});
	};

	const hideOnClickOutside = (dropdown: HTMLDivElement | null | undefined) => {
		const outsideClickListener = (event: any) => {
			if (
				(!event.target.classList.contains('listOption') && !dropdown?.classList.contains('hidden')) ||
				(event.target.classList.contains('inputValue') && !dropdown?.classList.contains('hidden'))
			) {
				dropdown?.classList.toggle('hidden');
				removeClickListener();
			}
		};
		const removeClickListener = () => {
			document.removeEventListener('mouseup', outsideClickListener);
		};
		document.addEventListener('mouseup', outsideClickListener);
	};

	return (
		<div className="rsDropdown">
			<DropdownInput placeholder={props.placeholder} value={props.value} />
			<DropdownList list={props.list} />
		</div>
	);
};

export default Dropdown;
