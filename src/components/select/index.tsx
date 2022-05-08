import React, { ReactNode, VFC } from 'react';

import styles from './index.module.css';

export type SelectProps = {
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	label: string;
	name: string;
	id: string;
	options: Array<{
		content: ReactNode;
		value: string;
	}>;
};

export const Select: VFC<SelectProps> = ({ onChange, id, name, options, label }) => (
	<div className={ styles.component }>
		<label htmlFor={ id }>{label}</label>
		<select name={ name } id={ id } onChange={ onChange } className={ styles.select }>
			{options.map(({ content, value }) => (
				<option key={ value } value={ value }>
					{content}
				</option>
			))}
		</select>
	</div>
);
