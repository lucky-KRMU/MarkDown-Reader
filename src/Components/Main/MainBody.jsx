import React, { useState } from 'react'
import Markdown from 'react-markdown';

function MainBody() {
    const [loader, setLoader] = useState(false);
    const [fileContent, setFileContent] = useState('');

    const ExtractContent = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;
            setFileContent(text)
        }

        reader.onerror = (e) => {
            console.error(e)
        }

        reader.readAsText(file);
        setLoader(true);
    }

    return (
        <>
            <main className='h-[88vh] w-full bg-zinc-800 flex flex-col items-center justify-center font-[Commissioner]'>
                {
                    loader ?
                        <div className='text-justify h-[60vh] w-[80vw] 
                        overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                      bg-zinc-600 text-white p-8 rounded-2xl'>
                            <Markdown>
                                {fileContent || "None"}
                            </Markdown>
                        </div>
                        :
                        <input type="file" name="mdfile" id="mdfile" className='height-[60vh] w-[80vw]  
                        text-center text-white cursor-pointer
                        border-2 border-zinc-950 border-dashed rounded-2xl py-[30vh]' onChange={ExtractContent} />
                }
            </main>
        </>
    )
}

export default MainBody