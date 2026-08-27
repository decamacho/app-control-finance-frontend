import { ConfigProvider, Select } from 'antd'
import type { SelectProps } from 'antd'
import { selectTheme } from './input'

type SelectSize = 'small' | 'middle' | 'large'

interface SelectFieldProps extends Omit<SelectProps<string>, 'size'> {
  size?: SelectSize
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
