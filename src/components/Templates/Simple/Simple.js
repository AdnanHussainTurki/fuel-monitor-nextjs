import NavBar from '../../Layout/NavBar/NavBar'
import CustomHead from '../../Layout/Head/CustomHead'

export default function Simple(props) {
  return (
    <div className="">
      <CustomHead />
      <div className="font-sans text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-100">
          {props.children}
        </div>
      </div>
    </div>
  )
}
