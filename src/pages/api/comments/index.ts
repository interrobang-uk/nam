import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const comments = await prisma.comment.findMany({
          where: {
            objectId: req.query["objectId"] as string,
          },
        })
        res.json(comments)

        break
      case "POST":
        const data = JSON.parse(req.body)
        const comment = await prisma.comment.create({
          data,
        })
        res.json(comment)

        break

      default:
        throw "Method not allowed"
        break
    }
  } catch (e: any) {
    console.error(e)
    res.status(400).json({ error: e?.name || e })
  }
}

export default handler
