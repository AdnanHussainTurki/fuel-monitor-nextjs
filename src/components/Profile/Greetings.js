import { useEffect, useState } from "react"

export default function (props) {
    const [ name, setName ] = useState(props.user.name)
    const [ className, setClassName ] = useState("text-blue-600/100 dark:text-blue-500/100")
    const [ greeting, setGreeting ] = useState("Hey!")
    useEffect(() => {
        const firstName = props.user.name.split(" ")[0] || props.user.name 
        setName(firstName)
    }, [props.user.name])
    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) {
            setGreeting("Good Morning,")
            setClassName("text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400")
        } else if (hour < 18) {
            setGreeting("Good Afternoon,")
            setClassName("text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-400")
        } else {
            setGreeting("Good Evening,")
            setClassName(" text-1xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-500")

        }
    }, [])

    return (
        <h1
            className="animate-pulse  text-xl font-semibold "
        >
            <span className={className}>{greeting}</span> <span className="font-thin">{name}</span>
        </h1>
    )
}
