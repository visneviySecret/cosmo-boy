import type { Option } from "../shared/ui/BaseSelector/BaseSelector";

type ConstObject = { readonly [key: string]: string | number | symbol };

export const optionsFromConstObject = (
  type: ConstObject,
  label: ConstObject
): Option[] =>
  Object.entries(type).map(([key, value]) => ({
    label: label[key as keyof typeof label] as string,
    value: value as string,
  }));
