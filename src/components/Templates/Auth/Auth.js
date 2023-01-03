import NavBar from '../../Layout/NavBar/NavBar'
import CustomHead from '../../Layout/Head/CustomHead'

export default function Auth(props) {
  return (
    <div className="">
      <CustomHead />
      <NavBar />
      <main className="min-h-screen bg-gray-700">
        <div class="py-12">
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {props.children}
          </div>
        </div>
      </main>
    </div>
  )
}
