import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Transform } from 'class-transformer';

export interface ValidationOptionsWithOptional extends ValidationOptions {
	isOptional?: boolean;
}

export function TrimAndValidate(max?: number, min?: number, validationOptions?: ValidationOptionsWithOptional) {
	return function (object: object, propertyName: string) {
		Transform(({ value }) => value?.trim())(object, propertyName);

		registerDecorator({
			name: 'trimAndValidate',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [min ?? 3, max ?? 20],
			validator: {
				validate(value: any, args: ValidationArguments) {
					const trimmedValue = value?.trim();

					if (validationOptions?.isOptional && trimmedValue.length === 0) return true;

					if (!trimmedValue) return false;

					const [minLength, maxLength] = args.constraints;
					return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
				},
				defaultMessage(args: ValidationArguments) {
					const [minLength, maxLength] = args.constraints;
					return `The field ${propertyName} must be between ${minLength} and ${maxLength} characters long and cannot be empty.`;
				},
			},
		});
	};
}
