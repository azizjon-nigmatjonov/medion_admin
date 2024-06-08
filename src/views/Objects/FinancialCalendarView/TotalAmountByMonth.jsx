import React from 'react'
import styles from './style.module.scss'

export default function TotalAmountByMonth({totalBalance}) {

    return (
        <div>
            {/* <div className={styles.recursiveBlock} style={{padding: '15px'}} /> */}
            <div className={styles.recursiveBlock}>
                <div className={styles.title}>
                <div className={styles.parentElement} style={{paddingLeft: '15px'}}>Общий</div>
                </div>
                {totalBalance.total && totalBalance.total.length > 0 && totalBalance.total.map((el, index) => 
                <>
                {/* <div className={styles.priceBlockChild} /> */}
                    <div className={styles.joinedPriceBlockChild} key={`total-amount-${index}`}>
                        {el.amount}
                    </div>
                    {/* <div className={styles.priceBlockChild} /> */}
                </>
                )}
            </div>
            {totalBalance.items && totalBalance.items.length > 0 && totalBalance.items.map((el, index) => 
            <div className={styles.recursiveBlock} key={`items-${el.id}`}>
                <div className={styles.title} style={{paddingLeft: '30px'}}>{el.name}</div>
                {el.amounts.length && el?.amounts?.map((el, index) => 
                    <>
                    {/* <div className={styles.priceBlockChild} /> */}
                        <div className={styles.joinedPriceBlockChild} key={`total-amount-${index}`}>
                            {el.amount}
                        </div>
                        {/* <div className={styles.priceBlockChild} /> */}
                    </>
                )}
            </div>)}
        </div>
    )
}
