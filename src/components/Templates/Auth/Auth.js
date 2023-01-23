import NavBar from '../../Layout/NavBar/NavBar'
import CustomHead from '../../Layout/Head/CustomHead'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth(props) {
  return (
    <div className="">
      <ToastContainer />
      <CustomHead />
      <NavBar />
      <main className="min-h-screen bg-gray-100">
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {props.children}
          </div>
        </div>
      </main>
    </div>
  )
}
