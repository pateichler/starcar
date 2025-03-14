import styles from "./loading-icon.module.css"

export default function LoadingIcon(){
    
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.ring}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}