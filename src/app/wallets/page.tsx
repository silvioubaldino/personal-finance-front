import styles from "@/app/wallets/styles/wallets.module.css";
import Wallet from "@/app/shared/components/wallet/ui/wallet";

const WalletsPage = () => {
    return (
        <div className={styles.pageContainer}>
            <h1>Carteiras</h1>
            <div className={styles.wallet}>
                <Wallet isEditing={true}/>
            </div>
        </div>
    )
}

export default WalletsPage