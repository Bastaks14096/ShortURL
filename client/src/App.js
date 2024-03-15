import './App.css';
import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QrCodeGenerator from './QrCodeGenerator';

function App() {
  const [data, setData] = useState(null);
  const host = 'https://short-url-opal.vercel.app/';
  // const host = 'http://localhost:5000/';

  const [copyAlerts, setCopyAlerts] = useState({});

  const handleCopyClick = (urlId) => {
    setCopyAlerts((prevAlerts) => ({
      ...prevAlerts,
      [urlId]: true,
    }));

    setTimeout(() => {
      setCopyAlerts((prevAlerts) => ({
        ...prevAlerts,
        [urlId]: false,
      }));
    }, 1500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}getallUrl`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const validateURL = (url) => {
    const urlPattern = /^(http:\/\/|https:\/\/)/; // Regular expression pattern for http/https
    return urlPattern.test(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const urlInput = event.target.url.value;
    if (!validateURL(urlInput)) {
      alert("Please enter a URL starting with 'http://' or 'https://'.");
      return;
    }
    try {
      const response = await fetch(`${host}shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      });
      const result = await response.json();
      setData([result, ...data]); // Add the new shortened URL to the beginning of the list
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  return (
    <>
      <nav className='nav'>
        <div className='logo'>SPACE URL</div>
      </nav>
      <section className='container'>
        <h1>Make URL to short</h1>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='Enter URL to make short' name='url' required></input>
          <button>Short URL</button>
        </form>
        <div className='list-box'>
          <h2>Shortened URL</h2>
          {data && data.length > 0 ? (
            <ul className='list-item'>
              {[...data].reverse().map((url) => (
                <li key={url._id} className='row'>
                  <div className='txt-overflow'>URL: <a href={url.url}>{url.url}</a></div>
                  <p className='click-txt'>Clicked: <span>{url.click}</span></p>
                  <div className='r-box'>
                    <p>Short URL:</p>
                    <div className='short-box'>
                      <a href={host + url.shortUrl} target='_blank' rel='noopener noreferrer' className='link-short'>{host + url.shortUrl}</a>
                      <div className='copy-btn'>
                        <CopyToClipboard text={host + url.shortUrl} onCopy={() => handleCopyClick(url._id)}>
                          <button><i className="fa-regular fa-copy"></i></button>
                        </CopyToClipboard>
                        {copyAlerts[url._id] && <span id={`copy-alert-${url._id}`}>Copied!</span>}
                      </div>
                    </div>
                    <div className='qr-code'>
                      <QrCodeGenerator url={host + url.shortUrl} />
                    </div>
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
