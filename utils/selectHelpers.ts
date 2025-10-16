export interface SmartSelectOption {
  value: string;
  label: string;
}

export interface SmartSelectOptionState extends SmartSelectOption {
  disabled?: boolean;
}

export interface BuildSmartOptionsConfig {
  options: SmartSelectOption[];
  currentValue?: string;
  reservedValues?: Set<string>;
  placeholderLabel?: string;
  placeholderValue?: string;
  ensureCurrent?: boolean;
}

export const buildSmartOptions = ({
  options,
  currentValue = '',
  reservedValues,
  placeholderLabel = '--',
  placeholderValue = '',
  ensureCurrent = true,
}: BuildSmartOptionsConfig): SmartSelectOptionState[] => {
  const trimmedCurrent = (currentValue ?? '').toString();
  const optionList: SmartSelectOptionState[] = [
    { value: placeholderValue, label: placeholderLabel },
  ];

  options.forEach(option => {
    const disabled = reservedValues?.has(option.value) && option.value !== trimmedCurrent;
    optionList.push({ ...option, disabled });
  });

  if (
    ensureCurrent &&
    trimmedCurrent &&
    trimmedCurrent !== placeholderValue &&
    !options.some(opt => opt.value === trimmedCurrent)
  ) {
    optionList.push({ value: trimmedCurrent, label: trimmedCurrent });
  }

  return optionList;
};

export const collectReservedValues = <T>({
  items,
  currentIndex,
  getValue,
}: {
  items: T[];
  currentIndex: number;
  getValue: (item: T, index: number) => string;
}): Set<string> => {
  const reserved = new Set<string>();
  items.forEach((item, index) => {
    if (index === currentIndex) return;
    const value = getValue(item, index);
    if (!value) return;
    reserved.add(value);
  });
  return reserved;
};
