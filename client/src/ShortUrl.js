import CopyToClipboard from 'react-copy-to-clipboard';
// import React, { useState } from 'react';

export default function ShortUrl() {
    const shortUrl = 'sdad'
    return (
        <div className='shortUrl'>
            <p>{shortUrl}</p>
            <CopyToClipboard text={shortUrl}>
                <button>Copy</button>
            </CopyToClipboard>
        </div>
    );
}