import styled, { keyframes } from 'styled-components'
import { slideInLeft, flash } from 'react-animations'
import { FaBitbucket } from 'react-icons/fa'
import Car from '../../Svg/Car'
import ReactLoading from 'react-loading';
const lightSpeedOutStyle = keyframes`${slideInLeft}`
const fadeOutStyle = keyframes`${flash}`

const BouncyDiv = styled.div`
    animation: 3s ${fadeOutStyle} ease-in-out;
    animation-iteration-count: infinite ;

`
const BackAndForthDiv = styled.div`
    animation: 3s ${slideInLeft} ease-in-out;
    animation-iteration-count: infinite ;
`

export default function Loading(props) {
    return (
        <BackAndForthDiv class="grid justify-items-center self-center justify-self-center place-self-center">
            <BouncyDiv className="flex w-auto justify-center content-center items-stretch self-center justify-self-center place-self-center">
                <div className="  w-20 justify-items-center content-center ">
                    {/* <Car className="fill-red-500 p-0 bg-contain" /> */}
                    {props.withoutText ? "" : <p className='text-center uppercase text-red-500 font-bold m-0 p-0 text-xs'>LOADING...</p> }
                    <ReactLoading  type={"cylon"} color={"red"} height={'20%'}  />
                    
                </div>
            </BouncyDiv>
        </BackAndForthDiv>
    )
}
