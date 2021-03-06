import React, { useState, useRef, useEffect } from 'react';

import './searchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'


function SearchBar() {
    const [result, setResult] = useState([])
    const [arrowPosition, setArrowPosition] = useState(-1)
    const [showList, setShowList] = useState(false)
    const [query, setquery] = useState('')
    const refInput = useRef(null)


    function bingWebSearch(value, e) {
        if (!e) return
        if(value.trim() === ''){
            setResult([])
            setShowList(false)
            return
        }
        if ((e.key.length > 1 ) && e.key !== "ArrowRight" ) {
            return
        } else {
            setquery(value)
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
        if (refInput.current.value.trim() === '') return
        const res = result
        if (e.key === 'ArrowDown') {
            if (arrowPosition < result.length -1) {
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
            if (arrowPosition === -1) {
                setArrowPosition(result.length -1)

                refInput.current.value = result[result.length -1].displayText
            } if (arrowPosition <= result.length && arrowPosition > 0) {
                refInput.current.value = result[arrowPosition -1].displayText
                setArrowPosition(arrowPosition - 1)
            }if(arrowPosition === 0){
                refInput.current.value = query
                setArrowPosition(-1)

            }
            setResult(res)
        }
        if (e.key === 'ArrowRight') {
            if (arrowPosition === -1) {
                return
            }
            bingWebSearch(result[arrowPosition].displayText, false)
            refInput.current.value = result[arrowPosition].displayText

        }
        if (e.key === 'Enter') {
            if(arrowPosition === -1){
                const search = query.replaceAll(' ', '+')
                const link = `https://www.bing.com/search?q=${search}&FORM=USBAPI`
                window.open(link, '_blank').focus();
            }else{
                const url = result[arrowPosition].url
                window.open(url, '_blank').focus();
            }
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
    useEffect(() => {
        const app = document.querySelector('.App')
        app.addEventListener('click', (ev) => {

            for(let i = 0; i <= ev.path.length -1; i++ ){
                if(i === ev.path.length-1){
                    setShowList(false)
                    break
                }
                if(ev.path[i].className === 'search-input'){
                    setShowList(true)
                    break
                }
            }
        })
        refInput.current.select()
    }, [])

    return <div className="search-input">
        <div className='input'>
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Type to search..." onKeyUp={(e) => bingWebSearch(e.target.value.trim(), e)} ref={refInput} onKeyDown={(e) => arrowMove(e)}/>
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