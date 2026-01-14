import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { TextField, Checkbox } from "@mui/material"

interface IFormInputs {
  TextField: string
  MyCheckbox: boolean
}
/**
 * 使用component API 渲染 TextField 和 Checkbox
 * @returns
 */
export function UserForm2() {
  const { handleSubmit, control, reset:_reset } = useForm<IFormInputs>({
    defaultValues: {
      TextField: "",
      MyCheckbox: false,
    },
  })
  const onSubmit: SubmitHandler<IFormInputs> = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-2 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-center text-amber-500 font-bold">textArea & Checkbox</h1>
      <Controller
        name="TextField"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <TextField {...field} />}
      />
      <Controller
        name="MyCheckbox"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Checkbox {...field} />}
      />
      <button type="submit" className="btn btn-primary py-2 px-3 text-center font-bold text-white">Submit</button>
    </form>
  )
}