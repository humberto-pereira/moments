import React from 'react';
import NoResults from '../assets/no-results.png';
import styles from '../styles/NotFound.module.css';
import Asset from './Asset';

const NotFound = () => {
    return (
        <div 
        className={styles.NotFoundMarginTop}>
            <Asset
                src={NoResults}
                message={'Sorry, the page you are looking for does not exist.'}
            />
        </div>
    );
};

export default NotFound;

