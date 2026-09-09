import { ConfigProvider, Select } from 'antd'
import { selectTheme } from './input'

type SelectSize = 'small' | 'middle' | 'large'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  size?: SelectSize
  className?: string
  value?: string
  onChange?: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  allowClear?: boolean
  loading?: boolean
  disabled?: boolean
  showSearch?: boolean
  filterOption?: boolean
  onSearch?: (value: string) => void
  popupMatchSelectWidth?: boolean
}

export function SelectField({ size = 'middle', className, popupMatchSelectWidth = false, ...props }: SelectFieldProps) {
  return (
    <ConfigProvider theme={selectTheme}>
      <Select
        size={size}
        className={className ?? 'w-full'}
        popupMatchSelectWidth={popupMatchSelectWidth}
        allowClear={false}
        {...props}
      />
    </ConfigProvider>
  )
}