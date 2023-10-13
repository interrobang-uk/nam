import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import Field from "./Field"
import { CustomField, Workflow, WorkflowType } from "@prisma/client"
import useSWR from "swr"
import { useRouter } from "next/router"
import StepEditor from "./StepEditor"

export interface StepField {
  question: string
  name: string
}

export interface Step {
  name: string
  description?: string
  fields: StepField[]
}

type WorkflowInput = Pick<CustomField, "name"> & { steps?: Step[] }

const WorkflowForm = ({
  workflow,
  onClose,
}: {
  workflow?: Workflow
  onClose?: () => void
}) => {
  const helpers = useForm<WorkflowInput>({
    // @ts-ignore
    defaultValues: workflow,
  })

  const {
    append,
    remove,
    fields: steps,
  } = useFieldArray({
    name: "steps",
    control: helpers.control,
  })

  const { mutate } = useSWR(
    workflow ? `/api/objects/${workflow?.id}` : `/api/objects`
  )

  const { replace } = useRouter()

  const onSubmit = async (values: WorkflowInput) => {
    if (workflow) {
      // update
      const res = await fetch(`/api/workflows/${workflow?.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        if (onClose) onClose()
      }
    } else {
      //  create
      const res = await fetch(`/api/workflows`, {
        method: "POST",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        const data = await res.json()
        replace(`/workflows/${data.id}`)
      }
    }
  }

  return (
    <FormProvider {...helpers}>
      <form onSubmit={helpers.handleSubmit(onSubmit)}>
        <Field name="name" label="Name" required />

        <Field
          name="type"
          label="What will this workflow do?"
          required
          type="select"
        >
          {Object.keys(WorkflowType).map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </Field>

        <fieldset>
          <legend>Steps</legend>

          {steps.map((step, i) => (
            <StepEditor
              key={step.id}
              step={step}
              i={i}
              onRemove={() => {
                if (confirm("Are you sure you want to remove this step?"))
                  remove(i)
              }}
            />
          ))}

          <button
            className="btn btn-outline-primary"
            onClick={() =>
              append({ name: `Step ${steps.length + 1}`, fields: [] })
            }
          >
            + Add {steps.length > 0 ? "another" : "first"} step
          </button>
        </fieldset>

        <button className="btn btn-primary mt-3">
          {workflow ? "Save changes" : "Create"}
        </button>
      </form>
    </FormProvider>
  )
}

export default WorkflowForm
