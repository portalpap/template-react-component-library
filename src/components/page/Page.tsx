import React, { Component, createRef } from 'react';
import './Page.scss';
import events from '../../utils/events';
import domUtils from '../../utils/domUtils';
import {
	getPreviousPage,
	percentSwiped,
	clearTransform,
	animatePreviousPage,
	transformElement,
	preventScroll,
	allowScroll
} from './PageAnimation';

let debounce = function (func: (e: any) => any, wait = 100) {
	let timeout: any;
	return function (...args: any) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			// @ts-ignore
			func.apply(this, args);
		}, wait);
	};
};

export interface PageProps extends React.PropsWithChildren {
	className?: string;
	children?: any;
	disableBackSwipe?: boolean;
	id?: string;
}

export default class Page extends Component<PageProps, {}> {
	private lastSwipe: number;
	private lastPixelsSwiped: number;
	private startSwipeBack: number;
	private pageElement = createRef<HTMLDivElement>();

	constructor(props: any) {
		super(props);
		this.lastSwipe = 0;
		this.lastPixelsSwiped = 0;
		this.startSwipeBack = 0;
	}

	componentDidMount = () => {
		events.dispatch('pageDidMount', this.pageElement.current);
	};

	componentDidUpdate() {
		events.dispatch('pageDidUpdate', this.pageElement.current);
	}

	componentWillUnmount = () => {
		events.dispatch('pageWillUnmount', this.pageElement.current);
	};

	swipeBack = (pixelsSwiped: number) => {
		this.lastPixelsSwiped = pixelsSwiped;
		if (!this.startSwipeBack) return;

		let now = Date.now();
		if (this.lastSwipe > now - 20) return;
		if (this.percentSwiped(this.lastPixelsSwiped) < 0) {
			this.lastPixelsSwiped = this.startSwipeBack;
		}
		this.lastSwipe = now;
		let percent = this.percentSwiped(this.lastPixelsSwiped);
		transformElement(this.pageElement.current, percent);
		if (percent > 10) {
			preventScroll(this.pageElement.current);
		}
		animatePreviousPage(percent, this.pageElement.current);
	};

	percentSwiped = (pixelsSwiped: number) => {
		return percentSwiped(pixelsSwiped, this.pageElement.current, this.startSwipeBack);
	};

	handleTouchEnd = debounce((e: any) => {
		getPreviousPage(this.pageElement.current); // if(!window.cordova)return;
		if (!this.pageElement.current) return;
		allowScroll(this.pageElement.current);
		if (!this.startSwipeBack) return;
		let percent = this.percentSwiped(this.lastPixelsSwiped);
		if (percent && percent > 10) {
			events.dispatch('routerBack', {});
		} else {
		}
		this.startSwipeBack = 0;
		this.lastPixelsSwiped = 0;
		clearTransform(this.pageElement.current);
		clearTransform(getPreviousPage(this.pageElement.current) as HTMLElement);
	}, 21);

	handleTouchStart = (e: any) => {
		let previousPage = getPreviousPage(this.pageElement.current);
		if (previousPage && previousPage.className.includes('disable-back-swipe')) return;
		if (!this.pageElement.current) return;
		if (this.isFirstPageOfView()) return;
		this.startSwipeBack = 0;
		let touchX = e.touches[0].clientX;
		if (this.percentSwiped(touchX) > 10) return;
		this.startSwipeBack = touchX;
		this.lastSwipe = 0;
	};

	handleTouchMove = (e: any) => {
		getPreviousPage(this.pageElement.current); // if(!window.cordova)return;
		if (!this.pageElement.current) return;
		// if (this.isFirstPageOfView()) return;
		if (!this.startSwipeBack) return;
		this.swipeBack(e.touches[0].clientX);
	};

	isFirstPageOfView = () => {
		let firstPage = domUtils.firstChildWithClass(this.pageElement.current?.parentElement, 'rs-page');
		if (firstPage === this.pageElement.current) return true;
		return false;
	};

	classes = () => {
		let classes = ['rs-page', 'rsPage'];
		if (this.props.disableBackSwipe) classes.push('disable-back-swipe');
		if (this.props.className) classes.push(this.props.className);
		return classes.join(' ');
	};

	render() {
		return (
			<div
				ref={this.pageElement}
				className={this.classes()}
				onTouchStart={this.handleTouchStart}
				onTouchEnd={this.handleTouchEnd}
				onTouchMove={this.handleTouchMove}
				id={this.props.id}
			>
				{this.props.children}
			</div>
		);
	}
}
