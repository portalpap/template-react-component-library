import domUtils from '../../utils/domUtils';

const getPreviousPage = (pageElement: Element | null) => {
	if (!domUtils.validElement(pageElement)) return;
	let viewElement = pageElement?.parentElement;
	return getPreviousPageFromView(viewElement);
};

const getPreviousPageFromView = (viewElement: Element | null | undefined) => {
	if (!viewElement || !viewElement.children) return;
	let viewChildren = viewElement.children;
	let previousPage = null;
	let finalPage = null;
	for (let i in viewChildren) {
		if (!domUtils.hasClass(viewChildren[i], 'rs-page')) continue;
		previousPage = finalPage;
		finalPage = viewChildren[i];
	}
	return previousPage;
};

const clearTransform = (element: HTMLElement | null | undefined) => {
	if (!element) return;
	element.style.transform = '';
	allowTransition(element);
};

const clearEffects = (element: HTMLElement | null | undefined) => {
	if (!element) return;
	element.style.opacity = '';
	element.style.left = '';
	element.style.right = '';
	allowTransition(element);
};

const removeOpacityEffect = (previousPageElement: HTMLElement) => {
	let child = domUtils.firstChildWithClass(previousPageElement, 'page-opacity-effect');
	if (!child) return;
	child.remove();
};

const percentSwiped = (pixelsSwiped: number, pageElement: Element | null, startSwipeBack: number) => {
	if (!pageElement) return 0;
	let width = pageElement.getBoundingClientRect().width;
	return ((pixelsSwiped - startSwipeBack) / width) * 100;
};

const transformElement = (element: HTMLElement | null, percent: number) => {
	if (!element || !domUtils.validElement(element)) return;
	element.style.transform = 'translate3d(' + percent + '%, 0,0)';
	preventTransition(element);
};

const preventScroll = (element: HTMLElement | null) => {
	if (!element || !domUtils.validElement(element)) return;
	element.style.overflow = 'hidden';
};

const allowScroll = (element: HTMLElement) => {
	if (!domUtils.validElement(element)) return;
	element.style.overflow = '';
};

const setElementOpacity = (element: HTMLElement, percent: number) => {
	if (!domUtils.validElement(element)) return;
	element.style.opacity = percent / 100 + '';
	preventTransition(element);
};

const setElementPosition = (element: HTMLElement, percent: number) => {
	if (!domUtils.validElement(element)) return;
	element.style.left = percent + '%';
	element.style.right = -percent + '%';
	preventTransition(element);
};

const allowTransition = (element: HTMLElement) => {
	if (!domUtils.validElement(element)) return;
	element.style.transition = '';
};

const preventTransition = (element: HTMLElement) => {
	element.style.transition = 'unset';
};

const animatePreviousPage = (percent: number, pageElement: Element | null) => {
	let previousPage = getPreviousPage(pageElement) as HTMLElement;
	transformElement(previousPage, (100 - percent) * (-1 / 5));
	let opacityEffect = domUtils.firstChildWithClass(previousPage, 'page-opacity-effect') as HTMLElement;
	if (!opacityEffect) return console.log('NO opacity effect');
	opacityEffect.style.opacity = (-percent + 100) / 100 + '';
};

const animatePageForView = (viewElement: HTMLElement | null) => {
	let pages = findChildrenWithClass(viewElement, 'rs-page');
	if (pages.length <= 0) return;
	let pageCurrent = pages[pages.length - 1] as HTMLElement;
	makePageCurrent(pageCurrent);
	if (pages.length <= 1) return;
	let pagePrevious = pages[pages.length - 2] as HTMLElement;
	makePagePrevious(pagePrevious);
};

const animateBackForView = (view: string) => {
	let viewElement = document.getElementById(view);
	let pages = findChildrenWithClass(viewElement, 'rs-page');
	if (pages.length <= 1) return;
	let pageToRemove = pages[pages.length - 1] as HTMLElement;
	let pageCurrent = pages[pages.length - 2] as HTMLElement;
	let pagePrevious: HTMLElement | null = pages[pages.length - 3] as HTMLElement;
	if (pages.length <= 2) pagePrevious = null;
	animatePages(pagePrevious, pageCurrent, pageToRemove);
};

const animateHome = async (view: string) => {
	let viewElement = document.getElementById(view);
	let pages = findChildrenWithClass(viewElement, 'rs-page');
	let pageCurrent = pages[0] as HTMLElement;
	let pageToRemove = null;
	if (pages.length > 1) {
		pageToRemove = pages[pages.length - 1] as HTMLElement;
	}
	animatePages(null, pageCurrent, pageToRemove);
};

const animatePages = (pagePrevious: HTMLElement | null, pageCurrent: HTMLElement, pageToRemove: HTMLElement | null) => {
	if (pagePrevious) makePagePrevious(pagePrevious);
	if (pageCurrent) makePageCurrent(pageCurrent);
	if (pageToRemove) makePageToRemove(pageToRemove);
};

const findChildrenWithClass = (element: Element | null, className: string) => {
	if (!element) return [];
	if (!element.children) return [];
	let children = [];
	for (let i in element.children) {
		if (!element.children[i]) continue;
		if (!element.children[i].classList) continue;
		if (element.children[i].classList.contains(className)) {
			children.push(element.children[i]);
		}
	}
	return children;
};

const makePageCurrent = (element: HTMLElement) => {
	removePageClasses(element);
	domUtils.addClass(element, 'page-current');
};

const makePagePrevious = (element: HTMLElement) => {
	removePageClasses(element);
	domUtils.addClass(element, 'page-previous');
	if (!element) return;
	if (domUtils.firstChildWithClass(element, 'page-opacity-effect')) return;
	let child = document.createElement(`div`);
	child.className = 'page-opacity-effect';
	element.appendChild(child);
};

let makePageToRemove = (element: HTMLElement) => {
	removePageClasses(element);
	domUtils.addClass(element, 'page-to-remove');
};

const removePageClasses = (element: HTMLElement) => {
	domUtils.removeClasses(element, ['page-current', 'page-previous', 'page-to-remove']);
	let opacityEffect = domUtils.firstChildWithClass(element, 'page');
	if (opacityEffect) opacityEffect.remove();
};

export {
	getPreviousPage,
	getPreviousPageFromView,
	percentSwiped,
	clearTransform,
	animatePreviousPage,
	allowTransition,
	setElementOpacity,
	transformElement,
	clearEffects,
	removeOpacityEffect,
	animatePageForView,
	animateBackForView,
	setElementPosition,
	animateHome,
	preventScroll,
	allowScroll
};
