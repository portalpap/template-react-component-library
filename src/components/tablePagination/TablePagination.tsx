import React from 'react';
import './TablePagination.scss';
import { GoChevronRight, GoChevronLeft } from 'react-icons/go';
import PerPageDropdown from '../perPageDropdown/PerPageDropdown';
import Label from '../label/Label';

export interface TablePaginationProps {
	selectedRowsPerPage: number;
	rowsPerPageOptions: number[];
	index: number[];
	total: number;
	setSelectedPage: (page: number) => void;
	setPerPage: (perPage: number) => void;
	currentPageNumber: number;
	id?: string;
}

const TablePagination: React.FC<TablePaginationProps> = (props) => {
	const { selectedRowsPerPage, rowsPerPageOptions, index, total, setSelectedPage, setPerPage, currentPageNumber } =
		props;

	const totalAvailablePages = Math.ceil(total / selectedRowsPerPage);

	function renderPageNumbers() {
		let numberArray = [];

		if (totalAvailablePages <= 6) {
			numberArray = Array.from(Array(totalAvailablePages + 1).keys());
			numberArray.shift();
			return numberArray;
		}

		numberArray.push(1);

		if (props.currentPageNumber < 4) {
			numberArray.push(...[2, 3, 4, '...', totalAvailablePages]);

			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber === totalAvailablePages - 2) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 1,
					props.currentPageNumber,
					props.currentPageNumber + 1,
					props.currentPageNumber + 2
				]
			);

			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber === totalAvailablePages - 1) {
			numberArray.push(
				...[
					'...',

					props.currentPageNumber - 2,

					props.currentPageNumber - 1,

					props.currentPageNumber,

					props.currentPageNumber + 1
				]
			);

			return numberArray;
		} else if (props.currentPageNumber >= 4 && props.currentPageNumber < totalAvailablePages) {
			numberArray.push(
				...[
					'...',

					props.currentPageNumber - 1,

					props.currentPageNumber,

					props.currentPageNumber + 1,

					'...',

					totalAvailablePages
				]
			);

			return numberArray;
		} else if (props.currentPageNumber > 4 && props.currentPageNumber > totalAvailablePages - 2) {
			numberArray.push(
				...[
					'...',
					props.currentPageNumber - 3,
					props.currentPageNumber - 2,
					props.currentPageNumber - 1,
					props.currentPageNumber
				]
			);

			return numberArray;
		}
	}

	function renderNumberDisplay() {
		let pages: any = renderPageNumbers();

		if (!pages) return;

		let displayedPageNumbers = [];

		for (let i in pages) {
			displayedPageNumbers.push(
				<Label
					key={i}
					className={pages[i] === currentPageNumber ? 'pageNumberSelection selected' : 'pageNumberSelection'}
					onClick={() => {
						if (pages[i] !== '...') setSelectedPage(pages[i]);
					}}
				>
					{pages[i]}
				</Label>
			);
		}

		return displayedPageNumbers;
	}

	return (
		<div id={props.id} className="rsTablePagination">
			<div className="rowsPerPage">
				<Label className="rowsPerPageLabel">Rows per page:</Label>

				<PerPageDropdown
					selectedOption={selectedRowsPerPage}
					setSelectedOptionCallback={(value) => setPerPage(value)}
					perPageOptions={rowsPerPageOptions}
					setSelectedPageCallback={(value: number) => setSelectedPage(value)}
				/>
			</div>

			<div className="index">
				<Label>
					{index[0]}-{index[1]} of {total}
				</Label>
			</div>

			<div className="pageNavigationContainer">
				<GoChevronLeft
					onClick={() => {
						if (props.currentPageNumber - 1 >= 1) {
							props.setSelectedPage(props.currentPageNumber - 1);
						}
					}}
					className={props.currentPageNumber - 1 >= 1 ? 'chevronSelect' : 'notSelectable'}
				/>

				{renderNumberDisplay()}

				<GoChevronRight
					onClick={() => {
						if (props.currentPageNumber + 1 <= totalAvailablePages) {
							props.setSelectedPage(props.currentPageNumber + 1);
						}
					}}
					className={props.currentPageNumber + 1 <= totalAvailablePages ? 'chevronSelect' : 'notSelectable'}
				/>
			</div>
		</div>
	);
};

export default TablePagination;
