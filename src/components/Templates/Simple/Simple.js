import NavBar from '../../Layout/NavBar/NavBar'
import CustomHead from '../../Layout/Head/CustomHead'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Simple(props) {
  return (
    <div className="">
      <ToastContainer />
      <CustomHead />
      <div className="font-sans text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gray-100">
          {props.children}
        </div>
      </div>
    </div>
  )
}
