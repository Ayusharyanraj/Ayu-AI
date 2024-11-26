import React, { useContext } from 'react'
import "./Main.css"
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {

    const { prevPrompt,
        setPrevPrompt,
        input,
        setRecentPrompt,
        recentPrompt,
        setInput,
        showResult,
        setShowResult,
        loading,
        setLoading,
        resultData,
        setResultData,
        onSent}=useContext(Context)

  return (
    <div className='main'>
        <div className="nav">
            <p>Ayu-AI</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">

                {!showResult
                ?<>
                <div className="greet">
                <p><span>Hello, Chinmayans.</span></p>
                <p>How can I help you?</p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, quas?</p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, quas?</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, quas?</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, quas?</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>
                </>:
                <div className='result'>
                    <div className="result-tittle">
                        <img src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading?<div className='loader'>
                                <hr />
                                <hr />
                                <hr />
                        </div>:<p dangerouslySetInnerHTML={{__html:resultData}}></p>}
                        
                    </div>
                    </div>}

            
            <div className="main-bottom">
                <div className="search-box">
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                    <img src={assets.gallery_icon} alt="" />
                    <img src={assets.mic_icon} alt="" />
                    {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="" />:null}
                </div>
            </div>
            <p className="bottom-info">Ayu-AI can make mistakes. Check important info by yourself.</p>
        </div>
    </div>
  )
}

export default Main
