import './App.css';
import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QrCodeGenerator from './QrCodeGenerator';

function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/getallUrl');
        const result = await response.json();
        console.log(result)
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className='nav'>
        <div className='logo'>GREEN TEA</div>
        
      </nav>
      <section className='container'>
        <h1>Make URL to short</h1>
        <form action='http://localhost:5000/shorten' method='post'>
          <input type='text' placeholder='Enter URL to make short' name='url' required></input>
          <button>Shorten URL</button>
        </form>
        {/* <ShortUrl /> */}
        <div className='list-box'>
          <h2>History short URL</h2>
          {data && data.length > 0 ? (
            <ul className='list-item'>
              {[...data].reverse().map((url) => (
                <li key={url._id} className='row'>
                  <div className='txt-overflow'>Original URL: <a href={url.url}>{url.url}</a></div>
                  <div className='r-box'>
                    <div>Short URL: <a href={url.url} target='_blank' rel='noopener noreferrer' className='link-short'>https://greentea/{url.shortUrl}</a>
                      <CopyToClipboard text={url.shortUrl}>
                        <button>Copy</button>
                      </CopyToClipboard>
                    </div>
                    <QrCodeGenerator url={url.url} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No History</p>
          )}
        </div>
      </section>
      <footer>
        <p>Made by Me❤️</p>
      </footer>
    </>
  );
}

export default App;
