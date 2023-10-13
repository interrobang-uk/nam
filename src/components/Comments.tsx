import { Comment, Object } from "@prisma/client"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"
import Field from "./Field"
import { relativeDate } from "@/lib/formatters"

type CommentInput = Pick<Comment, "text" | "objectId">

const Comments = ({ object }: { object: Object }) => {
  const { data, mutate } = useSWR(`/api/comments?objectId=${object.id}`)

  const helpers = useForm<CommentInput>()

  const onSubmit = async values => {
    const res = await fetch(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        objectId: object.id,
        ...values,
      }),
    })
    if (res.ok) {
      mutate()
      helpers.reset()
    }
  }

  const deleteComment = async id => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      if (res.ok) mutate()
    }
  }

  return (
    <aside>
      <h2 className="h4 mt-4 mb-3">Comments</h2>

      <div className="card px-3 py-4 bg-body-secondary mb-3">
        {data && data?.length > 0 ? (
          data?.map(comment => (
            <div key={comment.id} className="card p-3 mb-2">
              <p className="mb-1">{comment.text}</p>
              <small>
                Demo User | {relativeDate(comment.createdAt)} |{" "}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete
                </button>
              </small>
            </div>
          ))
        ) : (
          <p className="mb-0 text-center text-secondary">No comments yet</p>
        )}
      </div>

      <FormProvider {...helpers}>
        <form onSubmit={helpers.handleSubmit(onSubmit)}>
          <Field type="textarea" name="text" label="Comment" />
          <button className="btn btn-primary">Post</button>
        </form>
      </FormProvider>
    </aside>
  )
}

export default Comments
