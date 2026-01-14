import Select from "react-select"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { Input } from "@mui/material"


interface IFormInput {
  firstName: string
  lastName: string
  iceCreamType: { label: string; value: string }
}
/**
 * UserForm1 演示了如何集成第三方 UI 库（Material-UI 和 React Select）并进行样式定制。
 * 
 * 核心特性：
 * 1. 使用 react-hook-form 的 Controller 组件实现对非原生输入组件的受控绑定。
 * 2. 通过 Controller 的 render 属性定义包装容器，实现自定义边框和焦点状态（focus-within）。
 * 3. 针对 React Select，利用 menuPortalTarget 属性将下拉菜单渲染至 document.body，
 *    彻底解决因父容器 overflow: hidden 或层级（z-index）限制导致的下拉选项不可见问题。
 * 
 * @returns 包含基础信息及偏好选择的受控表单组件
 */
export const UserForm1 = () => {
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      iceCreamType: { label: '', value: ''},
    },
  })
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div className="border border-gray-300 rounded-md p-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Input {...field} disableUnderline className="w-full px-2" />
            </div>
          )}
        />
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div className="border border-gray-300 rounded-md p-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Input {...field} disableUnderline className="w-full px-2" />
            </div>
          )}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Ice Cream Preference</label>
        <Controller
          name="iceCreamType"
          control={control}
          render={({ field }) => (
            <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <Select
                {...field}
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: 'none',
                    boxShadow: 'none',
                  }),
                }}
                options={[
                  { value: "chocolate", label: "Chocolate" },
                  { value: "strawberry", label: "Strawberry" },
                  { value: "vanilla", label: "Vanilla" },
                ]}
              />
            </div>
          )}
        />
      </div>
      <input className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit" />
    </form>
  )
}