import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const workflows = await prisma.workflow.findMany()
        res.json(workflows)

        break
      case "POST":
        const data = JSON.parse(req.body)
        const workflow = await prisma.workflow.create({
          data,
        })
        res.json(workflow)

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
