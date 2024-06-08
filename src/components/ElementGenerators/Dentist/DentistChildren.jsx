import React from 'react';
import styles from '../style.module.scss'

function DentistChildren({ item }) {
    return (
        <div>
             <div className={styles.dentistContentItemChild}>
                <div className={styles.teethImg}>
                    <item.img />
                </div>
              <div className={styles.teethNumber}>{item?.number}</div>
            </div>
        </div>
    );
}

export default DentistChildren;