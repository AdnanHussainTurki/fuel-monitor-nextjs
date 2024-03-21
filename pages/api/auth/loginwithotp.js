import { transporter } from '../../../lib/mailer'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }
    const { email, code } = req.body
    const client = await connectToDatabase()
    const db = await client.db()
    const existingUser = await db
        .collection('users')
        .findOne({ email: email, loginCode: code })
    client.close()
    if (!existingUser) {
        res.status(401).json({ status: false, message: 'Invalid code' })

        return
    }

    res.status(200).json({ success: false })
}
export default handler
