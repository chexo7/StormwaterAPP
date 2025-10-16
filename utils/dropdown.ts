export interface SmartDropdownOption {
  value: string;
  label: string;
}

interface ConfigureSmartDropdownArgs {
  select: HTMLSelectElement;
  options: SmartDropdownOption[];
  currentValue?: string | null;
  placeholderLabel?: string;
  placeholderValue?: string;
  usedValues?: Set<string>;
  unique?: boolean;
  appendMissingCurrent?: boolean;
}

const DEFAULT_PLACEHOLDER_LABEL = '--';

export const configureSmartDropdown = ({
  select,
  options,
  currentValue = '',
  placeholderLabel = DEFAULT_PLACEHOLDER_LABEL,
  placeholderValue = '',
  usedValues,
  unique = false,
  appendMissingCurrent = true,
}: ConfigureSmartDropdownArgs) => {
  const normalizedCurrent = currentValue ?? '';
  const normalizedUsed = new Set<string>(usedValues);
  if (normalizedCurrent) {
    normalizedUsed.delete(normalizedCurrent);
  }

  select.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = placeholderValue;
  placeholder.textContent = placeholderLabel;
  select.appendChild(placeholder);

  options.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    const isReserved = unique && normalizedUsed.has(option.value);
    optionEl.textContent = isReserved ? `${option.label} (ocupado)` : option.label;
    if (isReserved) {
      optionEl.disabled = true;
      optionEl.dataset.state = 'unavailable';
    }
    if (!isReserved && option.value === normalizedCurrent) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  if (
    appendMissingCurrent &&
    normalizedCurrent &&
    !Array.from(select.options).some(opt => opt.value === normalizedCurrent)
  ) {
    const currentOption = document.createElement('option');
    currentOption.value = normalizedCurrent;
    currentOption.textContent = normalizedCurrent;
    currentOption.selected = true;
    select.appendChild(currentOption);
  }

  if (!normalizedCurrent) {
    select.value = placeholderValue;
  }
};
