import React, { useEffect, useState } from "react"
import { useForm, type UseFormRegister, type SubmitHandler } from "react-hook-form"
import { UserForm1 } from "./UserForm1"
import { UserForm4 } from "./UserForm4"
import { Box } from "@mui/material"
import dayjs from 'dayjs'
interface IFormInput {
  firstName: string,
  lastName: string,
  age: number,
  gender: "female" | "male" | "other",
}

type InputProps = {
  label: string,
  register: UseFormRegister<IFormInput>,
  required: boolean,
}

const Input = ({ label, register, required }: InputProps) => (
  <>
    <label>{label}</label>
    <input className="border p-2 m-2" {...register(label as keyof IFormInput, { required })} />
  </>
)

const AgeSelect = React.forwardRef<
  HTMLSelectElement,
  ReturnType<UseFormRegister<IFormInput>>
>(({ onChange, onBlur, name }, ref) => (
  <>
    <label>Age</label>
    <select className="border p-2 m-2" name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
      <option value={20}>20</option>
      <option value={30}>30</option>
    </select>
  </>
))

const GenderSelect = React.forwardRef<
  HTMLSelectElement,
  ReturnType<UseFormRegister<IFormInput>>
>(({ onChange, onBlur, name }, ref) => (
  <>
    <label>Gender Selection</label>
    <select className="border p-2 m-2" name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
      <option value="female">female</option>
      <option value="male">male</option>
      <option value="other">other</option>
    </select>
  </>
))
/**
 * UserForm1 组件说明：
 * 1. 使用 react-hook-form 的 useForm 钩子创建表单实例，并传入泛型 IFormInput 约束字段类型。
 * 2. 通过 register 函数将每个字段注册到表单中，实现字段值收集与验证。
 * 3. handleSubmit 包装原生 onSubmit，在提交时自动校验并触发 onSubmit 回调，这里仅将数据打印到控制台。
 * 4. Input 组件通过 label 匹配 IFormInput 的键，动态注册文本输入并设置必填规则。
 * 5. AgeSelect 与 GenderSelect 使用 forwardRef 透传 ref，保证 react-hook-form 能正确绑定 select 的值。
 * 6. 最终渲染一个带边框的表单，包含姓名、年龄、性别字段及提交按钮。
 */
function UserForm() {
  const { register, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)
  const [time, setTime] = useState(dayjs())
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border border-gray-300 rounded-md">
      <Input label="First Name" register={register} required={true} />
      <Input label="Last Name" register={register} required={true} />
      <AgeSelect {...register("age")} />
      <GenderSelect {...register("gender")} />
      <button className="font-bold border p-2 m-2 btn-primary" type="submit">Submit</button>
      <span className='p-4'>current time: {time.format('YYYY-MM-DD HH:mm:ss')}</span>
    </form>
  )
}
export default function UserFormAll() {

  return (
    <div className="w-full">
      {/* 1. 基础的表单 */}
      <UserForm />
      <Box className="flex item-center gap-10">
        {/* 2. react-hook-form管理表单 */}
        <div className="max-w-sm">
          <UserForm1 />
        </div>
        {/* 3. 结合state管理表单 */}
        <div className="max-w-sm">
          <UserForm4 />
        </div>
      </Box>
    </div>
  )
}