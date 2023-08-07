import PropTypes from 'prop-types';

const Button = ({color, text, onClick}) => {
  return (
    <button className="btn" onClick={onClick} style={{backgroundColor: color}}>{text}</button>        
  )
}

Button.defaultProbs = {
    color: 'steelblue',
}

Button.prototype = {
    text: PropTypes.string,
    color: PropTypes.string,
}

export default Button
