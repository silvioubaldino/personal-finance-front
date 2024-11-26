import styles from "@/app/wallets/styles/wallets.module.css";
import Wallets from "@/app/shared/components/wallet/ui/wallets";

const WalletsPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1>Carteiras</h1>
            <div className={styles.wallet}>
                <Wallets isEditing={true}/>
            </div>
        </div>
    )
}

export default WalletsPage