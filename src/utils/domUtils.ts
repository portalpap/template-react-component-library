declare const window: any;

class DomUtils {
	addClass(element: Element | null, className: string) {
		if (!this.validElement(element)) return false;
		element?.classList.add(className);
	}
	removeClass(element: Element | null, className: string) {
		if (!this.validElement(element)) return false;
		element?.classList.remove(className);
	}
	removeClasses(element: Element | null, classes: string[]) {
		if (!this.validElement(element)) return false;
		for (let i in classes) {
			element?.classList.remove(classes[i]);
		}
	}
	hasClass(element: Element | null, className: string) {
		if (!this.validElement(element)) return false;
		return element?.classList.contains(className);
	}

	childrenWithClass(element: Element | null, className: string) {
		if (!element || !this.validElement(element)) return [];
		let children = [];
		for (let i in element.children) {
			if (this.hasClass(element?.children[i], className)) children.push(element?.children[i]);
		}
		return children;
	}

	firstChildWithClass(element: HTMLElement | null | undefined, className: string) {
		if (!element) return null;
		for (let i in element.children) {
			if (this.hasClass(element.children[i], className)) return element.children[i];
		}
		return null;
	}

	lastChildWithClass(element: Element, className: string) {
		if (!this.validElement(element)) return null;
		let last = null;
		for (let i in element?.children) {
			if (this.hasClass(element?.children[i], className)) last = element?.children[i];
		}
		return last;
	}

	validElement = (element: Element | null) => {
		if (!element) return false;
		if (!element.classList) return false;
		return true;
	};

	parent = (element: Element | null) => {
		if (!element) return null;
		return element.parentElement;
	};
}

const domUtils = new DomUtils();

export default domUtils;
window.domUtils = domUtils;
