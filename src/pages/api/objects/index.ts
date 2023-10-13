import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const fields = await prisma.object.findMany()
        res.json(fields)

        break
      case "POST":
        const data = JSON.parse(req.body)
        const field = await prisma.object.create({
          data,
        })
        res.json(field)

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
