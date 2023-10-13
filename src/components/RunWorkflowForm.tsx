import { Workflow } from "@prisma/client"
import { JsonValue } from "@prisma/client/runtime/library"
import { useState } from "react"
import Field from "./Field"
import { FormProvider, useForm } from "react-hook-form"
import { Step } from "./WorkflowForm"
import { useRouter } from "next/router"

const RunWorkflowForm = ({ workflow: w }: { workflow: Workflow }) => {
  const workflow = w as Workflow & { steps: Step[] }

  const { replace } = useRouter()

  const [answers, setAnswers] = useState<JsonValue>({})
  const [currentStep, setCurrentStep] = useState<number>(0)

  const helpers = useForm()

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === workflow?.steps?.length - 1

  const step = workflow?.steps?.[currentStep]

  const onSubmit = async values => {
    const res = await fetch(`/api/workflows/${workflow.id}`, {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (res.ok) replace(`/workflows/${workflow.id}/finish`)
  }

  return (
    <FormProvider {...helpers}>
      <form onSubmit={helpers.handleSubmit(onSubmit)}>
        {workflow.type === "editObject" ? (
          <Field label="Which object do you want to edit?" name="objectId" />
        ) : (
          <Field label="Name" name="objectName" />
        )}

        <fieldset className="card p-4 mb-3">
          <legend>{step?.name}</legend>

          <p>
            <em>{step?.description}</em>
          </p>

          {step?.fields?.map((field, i) => {
            if (field.name && field.question)
              return (
                <Field
                  key={`${currentStep}-${field.name}`}
                  name={field?.name}
                  label={field?.question}
                />
              )
            return null
          })}
        </fieldset>

        <div className="btn-group" role="group">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={isFirstStep}
            type="button"
            className="btn btn-outline-secondary"
          >
            &lt;- Go back
          </button>

          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={isLastStep}
            type="button"
            className="btn btn-outline-secondary"
          >
            Next step -&gt;
          </button>
        </div>

        <p className="mt-3">
          Step {currentStep + 1} of {workflow.steps.length}
        </p>

        <button className="btn btn-primary" disabled={!isLastStep}>
          Finish
        </button>
      </form>
    </FormProvider>
  )
}

export default RunWorkflowForm
