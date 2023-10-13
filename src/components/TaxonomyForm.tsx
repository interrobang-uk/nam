import { FormProvider, useForm } from "react-hook-form"
import Field from "./Field"
import { CustomField, FieldType, Taxonomy } from "@prisma/client"
import useSWR from "swr"

type TaxonomyInput = Pick<Taxonomy, "name" | "context" | "parentId">

const TaxonomyForm = ({
  taxonomy,
  onClose,
}: {
  taxonomy?: Taxonomy
  onClose?: () => void
}) => {
  const helpers = useForm<TaxonomyInput>({
    defaultValues: taxonomy,
  })

  const { mutate, data } = useSWR("/api/taxonomies")

  const onSubmit = async (values: TaxonomyInput) => {
    if (taxonomy) {
      // update
      const res = await fetch(`/api/taxonomies/${taxonomy.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        if (onClose) onClose()
      }
    } else {
      //  create
      const res = await fetch(`/api/taxonomies`, {
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
        <Field name="name" label="Name" required />

        <div className="row">
          <div className="col">
            <Field name="parentId" label="Parent" required type="select">
              <option value="">No parent</option>
              {data?.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </Field>
          </div>

          <div className="col">
            <Field name="context" label="Context" required type="select">
              <option>Accession register</option>
            </Field>
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-primary">
            {taxonomy ? "Save changes" : "Create"}
          </button>

          {taxonomy && (
            <button className="btn btn-outline-danger ms-2" type="button">
              Delete
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default TaxonomyForm
