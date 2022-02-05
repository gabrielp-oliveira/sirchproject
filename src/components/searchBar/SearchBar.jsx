import React, { useState,  useRef } from 'react';

import './searchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function SearchBar() {
    const [result, setResult] = useState([])
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
    function closeButton(){
        refInput.current.value = ''
        setResult([]);
        setShowList(false) 
    }
    return <div className="search-input">
        <div className='input'>
            <input type="text" placeholder="Type to search.." onChange={(e) => bingWebSearch(e)} ref={refInput}/>
            <span onClick={() => closeButton()}>x</span>
        </div>
            {showList? <div className="autocom-box" >
                {result.map((val) => {
                    return <li key={val.displayText} value={val.displayText}><FontAwesomeIcon icon={faSearch} />  {val.displayText}</li>
                })}
            </div>
: <div></div>}
        </div>
}

export default SearchBar;