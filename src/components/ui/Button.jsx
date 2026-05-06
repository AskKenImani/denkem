import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button className={styles.btn} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;