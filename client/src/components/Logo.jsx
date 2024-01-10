import styles from '../styles/Logo.module.css';

function Logo() {
     return (
          <div className={styles.logo}>
               <div><img src="/Logo_UIT.png" alt='logo' /></div>
               <h2>UIT</h2>
          </div>
     )
}

export default Logo