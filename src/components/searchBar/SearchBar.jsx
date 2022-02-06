import React, { useState, useRef } from 'react';

import './searchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'


function SearchBar() {
    const [result, setResult] = useState([])
    const [arrowPosition, setArrowPosition] = useState(-1)
    const [showList, setShowList] = useState(false)
    const refInput = useRef(null)

    function bingWebSearch(query) {
        const value = query.target.value.trim()
        if (value == '') {
            setResult([])
            setShowList(false)
            return
        }
        axios.get(`https://api.bing.microsoft.com/v7.0/Suggestions?q=${value}`, {
            headers: { 'Ocp-Apim-Subscription-Key': process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY }
        }).then((result) => {
            setResult(result.data.suggestionGroups[0].searchSuggestions)
            setShowList(true)
        })
            .catch((err) => {
                console.error(err)
            })


    }
    function closeButton() {
        refInput.current.value = ''
        setResult([]);
        setShowList(false)
    }
    function arrowMove(e) {
        if (e.key == 'ArrowDown') {
            if (arrowPosition <= 6) {
                setArrowPosition(arrowPosition + 1)
            }
        }
        if (e.key == 'ArrowUp') {
            if (arrowPosition >= 1) {
                setArrowPosition(arrowPosition - 1)
            }
        }
        if(e.key == 'Enter'){
            const url = result[arrowPosition].url
            window.open(url, '_blank').focus();
        }
    }

    function formatResult(text, length, url) {
        const split = text.split('')
        const result = []
        for (let i = length; i < split.length; i++) {
            result.push(split[i])
        }
        result.join('')
        return <span onClick={() => window.open(url, '_blank').focus()}>
            <span><FontAwesomeIcon icon={faSearch} /></span>
            <span >{refInput.current.value}</span>
            <span className='gray'>{result}</span>
        </span>
    }

    return <div className="search-input">
        <div className='input'>
            <FontAwesomeIcon icon={faSearch} /> 
            <input type="text" placeholder="Type to search.." onChange={(e) => bingWebSearch(e)} ref={refInput} onKeyDown={(e) => arrowMove(e)} />
            <span onClick={() => closeButton()}><FontAwesomeIcon icon={faTimes} /></span>
        </div>
        {showList ? <div className="autocom-box" >
            {result.map((val, i) => {
                return <li key={val.displayText}
                    value={val.displayText}
                    className={i === arrowPosition ? 'select' : ''}>
                    {formatResult(val.displayText, refInput.current.value.length, val.url)}
                </li>
            })}
        </div>
            : <div></div>}
    </div>
}

export default SearchBar;