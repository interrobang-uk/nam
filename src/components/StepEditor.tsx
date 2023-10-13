import { useFieldArray } from "react-hook-form"
import Field from "./Field"
import { Step } from "./WorkflowForm"
import useSWR from "swr"

const StepEditor = ({
  step,
  i,
  onRemove,
}: {
  step: Step & { id: string }
  i: number
  onRemove: () => void
}) => {
  const { append, remove, fields } = useFieldArray({
    name: `steps.${i}.fields`,
  })

  const { data } = useSWR(`/api/custom-fields`)

  return (
    <fieldset className="card mb-3 p-3">
      <header className="d-flex justify-content-between align-items-center">
        <legend>{step.name}</legend>

        <button
          onClick={onRemove}
          type="button"
          className="btn-close"
          aria-label="Close"
        ></button>
      </header>

      <Field name={`steps.${i}.name`} label="Name this step" />

      <Field
        name={`steps.${i}.description`}
        label="Description"
        type="textarea"
      />

      <fieldset>
        <legend className="form-label fs-6">Fields</legend>

        <div className="list-group mb-3">
          {fields.map((field, j) => (
            <fieldset key={`${i}-${field.id}`} className="list-group-item">
              <legend className="visually-hidden">Field</legend>

              <div className="d-flex justify-content-end">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to remove this field?"))
                      remove(j)
                  }}
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                ></button>
              </div>

              <div className="row">
                <div className="col">
                  <Field
                    name={`steps.${i}.fields.${j}.question`}
                    label="What question shall we ask?"
                  />
                </div>

                <div className="col">
                  <Field
                    name={`steps.${i}.fields.${j}.name`}
                    label="Which custom field will this populate?"
                    type="select"
                  >
                    {data?.map(opt => (
                      <option
                        key={opt.name}
                        value={opt.name}
                        selected={step?.fields?.[j]?.name === opt.name}
                      >
                        {opt.name}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
            </fieldset>
          ))}
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => append({ question: "", name: "" })}
        >
          + Add {fields.length > 0 ? "another" : "first"} field
        </button>
      </fieldset>
    </fieldset>
  )
}

export default StepEditor
