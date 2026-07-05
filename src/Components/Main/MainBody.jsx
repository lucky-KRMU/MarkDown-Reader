import React, {useState} from 'react'

function MainBody() {
    const[fileContent, setFileContent] = useState('');

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
    }

  return (
    <>
    <main className='h-[88vh] w-full bg-zinc-800 flex items-center justify-center'>
        <input type="file" name="mdfile" id="mdfile" className='height-[60vh] w-[80vw]  
        text-center text-white cursor-pointer
        border-2 border-zinc-950 border-dashed rounded-2xl py-[30vh]' onChange={ExtractContent} />
        
    </main>
    </>
  )
}

export default MainBody