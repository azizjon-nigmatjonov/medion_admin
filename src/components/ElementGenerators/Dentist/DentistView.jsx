import React from 'react';
import styles from '../style.module.scss'

function DentistView({ item, type }) {
    
    return (
        <div>
            <div className={styles.dentistContentItem}>
                <div className={styles.teethImg}>
                    <item.img />
                </div>
              <div className={styles.teethNumber}>{item?.number}</div>
            </div>
        </div>
    );
}

export default DentistView;