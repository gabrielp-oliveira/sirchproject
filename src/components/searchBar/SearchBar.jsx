import React, { useState, useRef } from 'react';

import './searchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'


function SearchBar() {
    const [result, setResult] = useState([])
    // const [history, setHistory] = useState([])
    const [arrowPosition, setArrowPosition] = useState(-1)
    const [showList, setShowList] = useState(false)
    const [query, setquery] = useState('')
    const refInput = useRef(null)


    function bingWebSearch(value, e) {
        if (!e) return
        if (e.code == "ArrowDown" || e.code == "ArrowUp") {
            return
        } else {

            setquery(value)
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
            }).catch((err) => {
                console.error(err)
            })
        }
    }
    function closeButton() {
        refInput.current.value = ''
        setResult([]);
        setShowList(false)
    }
    function arrowMove(e) {
        if (refInput.current.value.trim() == '') return
        const res = result
        if (e.key === 'ArrowDown') {
            if (arrowPosition < 7) {
                setArrowPosition(arrowPosition + 1)
            } else {
                setArrowPosition(-1)
                refInput.current.value = query
                return
            }
            if (arrowPosition == -1) {
                refInput.current.value = result[arrowPosition + 1].displayText
            } else {
                refInput.current.value = result[arrowPosition + 1].displayText
            }
            setResult(res)
        }
        if (e.key === 'ArrowUp') {
            if (arrowPosition == -1) {
                setArrowPosition(7)
                refInput.current.value = refInput.current.value = result[7].displayText
            } if (arrowPosition <= 7 && arrowPosition > 0) {
                refInput.current.value = result[arrowPosition].displayText
                setArrowPosition(arrowPosition - 1)
            }if(arrowPosition === 0){
                refInput.current.value = query
                setArrowPosition(-1)

            }
            setResult(res)
        }
        if (e.key == 'ArrowRight') {
            if (arrowPosition === -1) {
                return
            }
            // setHistory(oldArray => [...oldArray, refInput.current.value]);
            bingWebSearch(result[arrowPosition].displayText, false)
            refInput.current.value = result[arrowPosition].displayText

        }
        // if (e.key == 'ArrowLeft') {
        //     if (arrowPosition == -1) {
        //         return
        //     }
        //     if(history.length == 0){
        //         refInput.current.value = query
        //         bingWebSearch(query, false)

        //     }else{

        //         refInput.current.value = history[history.length -1]
        //         bingWebSearch(history[history.length -1], false)

        //         history.pop()
        //     }
        // }
        if (e.key === 'Enter') {
            const url = result[arrowPosition].url
            window.open(url, '_blank').focus();
        }
    }

    function formatResult(text, url) {
        const split = text.split('')
        const result = []
        const searched = []
        const length = query.split('').length
        for (let i = length; i < split.length; i++) {
            result.push(split[i])
        }
        for (let i = 0; i < length; i++) {
            searched.push(split[i])
        }
        result.join('')
        searched.join('')
        return <span onClick={() => window.open(url, '_blank').focus()}>
            <span><FontAwesomeIcon icon={faSearch} /></span>
            <span >{searched}</span>
            <span className='gray'>{result}</span>
        </span>
    }

    return <div className="search-input">
        <div className='input'>
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Type to search.." onKeyUp={(e) => bingWebSearch(e.target.value.trim(), e)} ref={refInput} onKeyDown={(e) => arrowMove(e)}/>
            <span onClick={() => closeButton()}><FontAwesomeIcon icon={faTimes} /></span>
        </div>
        {showList ? <div className="autocom-box" >
            {result.map((val, i) => {
                return <li key={val.displayText}
                    value={val.displayText}
                    className={i === arrowPosition ? 'select' : ''}>
                    {formatResult(val.displayText, val.url)}
                </li>
            })}
        </div>
            : <div></div>}
    </div>
}

export default SearchBar;