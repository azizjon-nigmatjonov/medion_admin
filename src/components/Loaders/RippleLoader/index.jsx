import "./style.scss"

const RippleLoader = ({ size = "", height='80px' }) => {
  return ( <div className={`lds-dual-ring ${size}`} styles={{ height: height }}></div> );
}
 
export default RippleLoader;