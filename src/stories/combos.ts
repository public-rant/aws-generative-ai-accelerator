interface PathEntry {}

const _helper = (path: any[], entries: [string, Array<any>][], acc: any[]) => {
  if (entries.length === 0) {
    acc.push(Object.fromEntries(path));
  } else {
    const [[key, vals], ...rest] = entries;
    vals.forEach((val) => {
      _helper([...path, [key, val]], rest, acc);
    });
  }
  return acc;
};

export const combos = (options: Record<string, Array<any>>) =>
  _helper([], Object.entries(options), []);

const _labeledHelper = (
  path: { labels: string[]; vals: [string, any][] },
  entries: [string, Record<string, any>][],
  acc: Record<string, Record<string, any>>
) => {
  if (entries.length === 0) {
    const fullLabel = path.labels.join('_');
    const value = Object.fromEntries(path.vals);
    acc[fullLabel] = value;
  } else {
    const [[key, options], ...rest] = entries;
    const optionEntries = Object.entries(options);
    optionEntries.forEach(([label, val]) => {
      _labeledHelper(
        {
          labels: [...path.labels, label] as string[],
          vals: [...path.vals, [key, val]],
        },
        rest,
        acc
      );
    });
  }
  return acc;
};

export const labeledCombos = (options: Record<string, Record<string, any>>) =>
  _labeledHelper(
    { labels: [] as string[], vals: [] as [string, any][] },
    Object.entries(options),
    {}
  );
