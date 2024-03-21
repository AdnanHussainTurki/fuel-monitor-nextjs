import { transporter } from '../../../lib/mailer'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }
    const { email } = req.body
    const client = await connectToDatabase()
    const db = await client.db()
    const existingUser = await db.collection('users').findOne({ email: email })
    const randomFourDigit = Math.floor(1000 + Math.random() * 9000)
    if (!existingUser) {
        const hashedPassword = await hashPassword(randomFourDigit)
        const firstPartOfEmail = email.split('@')[0]
        // Clean the first part of the email, by replacing . and _ with space and remove all non-alphanumeric characters
        let name = firstPartOfEmail
            .replace(/\./g, ' ')
            .replace(/_/g, ' ')
            .replace(/[^a-zA-Z0-9]/g, '')
        // Make the name title case
        await db.collection('users').insertOne({
            name: name,
            email: email,
            password: hashedPassword,
        })
    }
    const user = await db.collection('users').findOne({ email: email })
    // Update the loginCode in the user document
    await db.collection('users').updateOne(
        { email: email },
        {
            $set: {
                loginCode: randomFourDigit,
            },
        }
    )

    const info = await transporter.sendMail({
        from:
            '"' +
            process.env.MAIL_FROM_NAME +
            '" <' +
            process.env.MAIL_FROM_ADDRESS +
            '>', // sender address
        to: email, // list of receivers
        subject: 'Your login code is ' + randomFourDigit + '.', // Subject line
        text: 'Hi!', // plain text body
        html: 'Hi,<br> Your login code is <b>' + randomFourDigit + '</b>.', // html body
    })

    if (!!info) {
        res.status(200).json({ success: true })
    }
    res.status(200).json({ success: false })
}
export default handler
