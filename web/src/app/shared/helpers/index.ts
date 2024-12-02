import { FormGroup, Validators } from '@angular/forms';

export function normalizeParams(values: { [key: string]: any }) {
	Object.keys(values).forEach((key) => {
		if ((!values[key] && values[key] != false) || values[key] === '' || values[key].length == 0) {
			delete values[key];
		}
	});
	return values;
}

let timeout: any[] = [];
export const debounce = (func: () => void, index: number = 0, time: number = 200) => {
	clearTimeout(timeout[index]);
	timeout[index] = setTimeout(() => {
		func();
	}, time);
};
