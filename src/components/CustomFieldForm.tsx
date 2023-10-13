import { FormProvider, useForm } from "react-hook-form"
import Field from "./Field"
import { CustomField, FieldType } from "@prisma/client"
import useSWR from "swr"

type CustomFieldInput = Pick<CustomField, "name" | "required" | "type">

const CustomFieldForm = ({
  field,
  onClose,
}: {
  field?: CustomField
  onClose?: () => void
}) => {
  const helpers = useForm<CustomFieldInput>({
    defaultValues: field,
  })

  const { mutate } = useSWR("/api/custom-fields")

  const onSubmit = async (values: CustomFieldInput) => {
    if (field) {
      // update
      const res = await fetch(`/api/custom-fields/${field.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        if (onClose) onClose()
      }
    } else {
      //  create
      const res = await fetch(`/api/custom-fields`, {
        method: "POST",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        helpers.reset()
      }
    }
  }

  return (
    <FormProvider {...helpers}>
      <form onSubmit={helpers.handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col">
            <Field name="name" label="Name" required />
          </div>

          <div className="col">
            <Field name="type" label="Type" type="select">
              {Object.keys(FieldType).map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </Field>
          </div>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            {...helpers.register("required")}
            id="required"
          />
          <label htmlFor="required" className="form-check-label">
            Required?
          </label>
        </div>

        <button className="btn btn-primary mt-3">
          {field ? "Save changes" : "Create"}
        </button>
      </form>
    </FormProvider>
  )
}

export default CustomFieldForm
