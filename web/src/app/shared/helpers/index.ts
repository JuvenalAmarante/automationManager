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

export function dateSetHours(time: string | null, hours: number, minutes?: number) {
	if (!time) return null;
	const date = new Date(time);
	date.setHours(hours, minutes || 0);
	return date;
}

export function resetFormAndChangeValue(form: FormGroup, key: string, actions: { reset?: boolean; clear?: boolean; disable?: boolean }, validators?: string[]) {
	if (actions.reset) form.get(key)?.reset();
	if (actions.clear) form.get(key)?.clearValidators();
	actions.disable ? form.get(key)?.disable() : form.get(key)?.enable();
	if (validators && validators?.length > 0) {
		if (validators.includes('required')) {
			form.get(key)?.addValidators(Validators.required);
		}
	}
	form.get(key)?.updateValueAndValidity();
}

export function booleanTransform(value: string | boolean | null | number | undefined): boolean {
	if (value === null) return false;
	if (value === undefined) return false;
	return ['true', '1', true, 1].includes(value);
}

export function stringTransform(value: string, separator: string = ''): string {
	return value
		?.toString()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z]/g, separator)
		.replace(/(_)\1+/g, '$1');
}
