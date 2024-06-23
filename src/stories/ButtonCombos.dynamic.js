import { defineStories } from './dynamic';
import { labeledCombos } from './combos';
import dedent from 'ts-dedent';

export default defineStories({
  baseCsf: dedent`
    import { Button } from "./Button";
    export default { component: Button, args: { label: 'Button' }, tags: ['autodocs'] };
  `,
  stories: () => {
    const combos = labeledCombos({
      primary: {
        primary: true,
        secondary: false,
      },
      label: {
        short: 'Short',
        long: 'Really really long',
      },
      backgroundColor: {
        none: undefined,
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      size: {
        small: 'small',
        medium: 'medium',
        large: 'large',
      },
    });

    const result = {};
    Object.entries(combos).forEach((entry) => {
      const [label, val] = entry;
      result[label] = { args: val };
    });
    return result;
  },
});
