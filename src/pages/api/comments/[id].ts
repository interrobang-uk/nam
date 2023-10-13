import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "DELETE": {
        const comment = await prisma.comment.delete({
          where: {
            id: req.query["id"] as string,
          },
        })
        res.json(comment)

        break
      }
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
