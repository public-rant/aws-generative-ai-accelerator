# Storybook Dynamic Stories POC

Proof of concept for imperative story creation that's compatible with Storybook7 on-demand architecture.

## Why dynamic stories?

Storybook is based on Component Story Format (CSF), which statically defines your stories (component examples) as ESM named exports. We scan these named exports to create a global list of stories without having to evaluate the files, which dramatically improves startup time.

The problem with this approach is sometimes you want to define stories dynamically. Key examples of this include:

1. **Combinatorial testing** where you combine all the different possible input values to your component to create a wide range of test cases with a small amount of code
2. **Fixture-based testing** where you define stories based on reading some JSON fixture files, or asynchronously querying an API.

## What's the solution?

This POC sketches out a solution by creating a new syntax for dynamic stories.

```js
import { defineStories } from './dynamic';
import { dedent } from 'ts-dedent';

export default defineStories({
  baseCsf: dedent`
    import { Button } from "./Button";
    export default { component: Button };
  `,
  stories: async () => {
    const result = {};
    for (let i = 0; i < 3; i++) {
      result[`Story${i}`] = { args: { label: `Button ${i}` } };
    }
    return result;
  },
});
```

`defineStories` takes two required arguments:

1. `baseCsf` is a valid CSF string with a default export and zero or more stories.
2. `stories` is a sync or async function that generates zero or more story exports.

This repo contains examples for the use cases of combinatorial + fixture-based testing.

## Why isn't this addon released as part of Storybook?

This code is a proof of concept only. It works and is simple enough that if anybody wants to use it today, they are welcome to add the code to their project or release their own addon that builds on this code.

Static story definition is good enough for most use cases, which is why we only support that in CSF. We plan to extend CSF with the ability to show a programmatically-generated grid of "variants" within a story. That will likely become the recommended approach for combinatorial stories and other forms of simple generation. It won't solve for the fixture use case, and supporting that in core is on our radar but not on the roadmap.

## Implementation notes

This demo is implemented in two steps (1) indexing, and (2) loading.

**Indexing.** It executes the code in the `stories` argument to `defineStories` in Node, and then converts the results into indexable stories using Storybook's [Indexer API](https://github.com/storybookjs/storybook/discussions/23176).

**Loading.** Then, when Storybook tries to load the stories, it does the same transformation. But this time it outputs CSF. This means that the result must be a plain JavaScript literal, object, or array (i.e. no functions, and nothing complex). It uses [magicast](https://github.com/unjs/magicast) to create the CSF and [unplugin](https://github.com/unjs/unplugin) so that the loader will work with both Webpack and Vite.
