import styles from "./pannel.module.css"

export default function Pannel({style, children}: {style?: React.CSSProperties, children: React.ReactNode}){
    
    return (
        <div style={style} className={styles.pannel}>
            {children}
        </div>
    )
}